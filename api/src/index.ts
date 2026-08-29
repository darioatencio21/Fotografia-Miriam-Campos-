import express from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';
import ExcelJS from 'exceljs';
import { pool } from './db.js';
import {
  sendCustomEmail,
  sendDecisionEmail,
  sendInquiryEmails,
  sendNewReviewEmail,
  sendReminderEmail,
} from './mailer.js';
import type { MailLang } from './mailer.js';

const app = express();
const port = Number(process.env.PORT ?? 4000);
const UPLOAD_DIR = process.env.UPLOAD_DIR ?? path.resolve('uploads');

app.set('trust proxy', true);
app.use(express.json());

/* ---------- Anti-spam: límite de solicitudes por IP ---------- */

const RATE_LIMIT_MAX = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const hits = new Map<string, number[]>();

const RESUBMIT_LOCK_MS = 10 * 60 * 1000;

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) return true;
  recent.push(now);
  hits.set(key, recent);
  return false;
}

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch {
    res.status(503).json({ status: 'error' });
  }
});

app.get('/api/services', async (_req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM services ORDER BY sort_order');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

app.get('/api/testimonials', async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM testimonials WHERE approved ORDER BY sort_order, id'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

app.post('/api/testimonials', async (req, res, next) => {
  try {
    if (rateLimited(`resena:${req.ip ?? 'x'}`)) {
      res.status(429).json({ error: 'Demasiados intentos. Intenta más tarde.' });
      return;
    }
    const body = (req.body ?? {}) as Record<string, unknown>;
    if (String(body.website ?? '').trim() !== '') {
      res.status(201).json({ id: 0, confirmation: '¡Gracias!' });
      return;
    }
    const author = String(body.author ?? '').trim().replace(/\s+/g, ' ').slice(0, 40);
    const quote = String(body.quote ?? '').trim().slice(0, 300);
    const rating = Number(body.rating);
    const lang: MailLang = body.lang === 'en' ? 'en' : 'es';

    const errors: string[] = [];
    if (author.length < 2 || author.length > 30) {
      errors.push('Escribe tu nombre (2–30 caracteres).');
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      errors.push('Elige una calificación de 1 a 5 estrellas.');
    }
    if (quote.length < 15 || quote.length > 300) {
      errors.push('Cuéntanos un poco más de tu experiencia (15–300 caracteres).');
    }
    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    const sessionType = lang === 'en' ? 'Web review' : 'Reseña web';
    const { rows } = await pool.query(
      `INSERT INTO testimonials
         (author, session_type, session_type_en, quote, quote_en, rating,
          sort_order, approved)
       VALUES ($1, $2, $2, $3, $3, $4,
               (SELECT COALESCE(MAX(sort_order), 10) + 1 FROM testimonials),
               false)
       RETURNING id`,
      [author, sessionType, quote, rating]
    );
    res.status(201).json({ id: rows[0].id, confirmation: '¡Gracias! Tu reseña aparecerá muy pronto.' });

    sendNewReviewEmail({ author, rating });
  } catch (err) {
    next(err);
  }
});

app.get('/api/stats', async (_req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM stats ORDER BY sort_order');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

app.get('/api/photos/categories', async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, slug, label, label_en FROM gallery_categories ORDER BY sort_order'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

app.get('/api/photos', async (req, res, next) => {
  try {
    const category = typeof req.query.category === 'string' ? req.query.category.trim() : '';
    const sql = `
      SELECT p.id, p.src, p.alt, p.alt_en, p.orientation, p.width, p.height,
             c.id AS category_id, c.slug AS category_slug,
             c.label AS category_label, c.label_en AS category_label_en
      FROM photos p
      JOIN gallery_categories c ON c.id = p.category_id
      ${category ? 'WHERE c.slug = $1' : ''}
      ORDER BY c.sort_order, p.sort_order
    `;
    const params = category ? [category] : [];
    const { rows } = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function isValidUSPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 10) return /^[2-9]/.test(digits);
  if (digits.length === 11) return digits[0] === '1' && /^[2-9]/.test(digits.slice(1));
  return false;
}

app.post('/api/inquiries', async (req, res, next) => {
  try {
    if (rateLimited(`inq:${req.ip ?? 'x'}`)) {
      res.status(429).json({
        errors: ['Demasiadas solicitudes desde esta conexión. Intenta de nuevo más tarde.'],
      });
      return;
    }
    const body = (req.body ?? {}) as Record<string, unknown>;
    // Honeypot: los bots llenan el campo oculto "website"; respondemos éxito falso sin guardar nada.
    if (String(body.website ?? '').trim() !== '') {
      res
        .status(201)
        .json({ id: 0, createdAt: new Date().toISOString(), confirmation: 'Solicitud recibida.' });
      return;
    }
    const name = String(body.name ?? '').trim().replace(/\s+/g, ' ');
    const email = String(body.email ?? '').trim().toLowerCase();
    const phone = body.phone ? String(body.phone).trim() : '';
    const sessionType = String(body.sessionType ?? '').trim();
    const eventDate = body.eventDate ? String(body.eventDate).trim() : null;
    const message = String(body.message ?? '').trim();
    const lang: MailLang = body.lang === 'en' ? 'en' : 'es';

    const errors: string[] = [];
    if (name.length < 2 || name.length > 25) {
      errors.push('El nombre debe tener entre 2 y 25 caracteres.');
    }
    if (!EMAIL_RE.test(email)) errors.push('El correo no parece válido.');
    else if (email.length > 30) errors.push('El correo no puede exceder 30 caracteres.');
    if (phone && !isValidUSPhone(phone)) {
      errors.push('Ingresa un teléfono válido de EE.UU. (10 dígitos, +1 opcional).');
    } else if (phone.length > 15) {
      errors.push('El teléfono no puede exceder 15 caracteres.');
    }
    if (!sessionType || sessionType.length > 60) errors.push('Selecciona el tipo de sesión.');
    if (message.length < 10 || message.length > 150) {
      errors.push('El mensaje debe tener entre 10 y 150 caracteres.');
    }
    if (eventDate && Number.isNaN(Date.parse(eventDate))) errors.push('La fecha elegida no es válida.');

    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    // Anti-reescritura: impedir que el mismo correo vuelva a enviar dentro de 10 min.
    const lastRes = await pool.query(
      `SELECT created_at FROM inquiries
       WHERE email = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [email]
    );
    if (lastRes.rowCount && lastRes.rowCount > 0) {
      const lastAt = new Date(lastRes.rows[0].created_at).getTime();
      const remaining = RESUBMIT_LOCK_MS - (Date.now() - lastAt);
      if (remaining > 0) {
        res.status(429).json({
          errors: ['Ya enviaste una solicitud hace poco. Espera unos minutos antes de enviar otra.'],
          retryAfter: Math.ceil(remaining / 1000),
        });
        return;
      }
    }

    const { rows } = await pool.query(
      `INSERT INTO inquiries (name, email, phone, session_type, event_date, message, lang)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, created_at`,
      [name, email, phone || null, sessionType, eventDate, message, lang]
    );
    res.status(201).json({
      id: rows[0].id,
      createdAt: rows[0].created_at,
      confirmation: 'Solicitud recibida. Te responderé muy pronto.',
    });

    sendInquiryEmails({
      name,
      email,
      phone: phone || undefined,
      sessionType,
      eventDate: eventDate || undefined,
      message,
      // Los correos siempre salen en inglés, sin importar el idioma del formulario.
      lang: 'en',
    });
  } catch (err) {
    next(err);
  }
});

app.get('/api/availability', async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT DISTINCT event_date::text AS date
       FROM inquiries
       WHERE status = 'accepted' AND event_date IS NOT NULL
       ORDER BY date`
    );
    res.json(rows.map((r) => r.date));
  } catch (err) {
    next(err);
  }
});

function isAdmin(req: express.Request): boolean {
  const expected = process.env.ADMIN_KEY ?? '';
  if (!expected) return false;
  const given = req.header('x-admin-key') ?? '';
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

const ADMIN_STATUS_FILTERS = ['pending', 'accepted', 'declined'];

app.get('/api/admin/inquiries', async (req, res, next) => {
  if (!isAdmin(req)) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }
  try {
    const status = typeof req.query.status === 'string' ? req.query.status : '';
    const useFilter = ADMIN_STATUS_FILTERS.includes(status);
    const { rows } = await pool.query(
      `SELECT id, name, email, phone, session_type, event_date::text AS event_date,
              message, lang, status, admin_note, responded_at, created_at
       FROM inquiries
       ${useFilter ? 'WHERE status = $1' : ''}
       ORDER BY (status = 'pending') DESC, created_at DESC`,
      useFilter ? [status] : []
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

app.patch('/api/admin/inquiries/:id', async (req, res, next) => {
  if (!isAdmin(req)) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: 'Id inválido.' });
      return;
    }
    const body = (req.body ?? {}) as Record<string, unknown>;
    const status = String(body.status ?? '');
    if (status !== 'accepted' && status !== 'declined') {
      res.status(400).json({ error: "Estado inválido: usa 'accepted' o 'declined'." });
      return;
    }
    const note = body.note ? String(body.note).trim().slice(0, 500) : null;

    const { rows } = await pool.query(
      `UPDATE inquiries
       SET status = $1,
           admin_note = $2,
           responded_at = now()
       WHERE id = $3
       RETURNING id, name, email, session_type,
                 event_date::text AS event_date, lang, status, responded_at`,
      [status, note, id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: 'Solicitud no encontrada.' });
      return;
    }

    const row = rows[0];
    sendDecisionEmail({
      name: row.name,
      email: row.email,
      sessionType: row.session_type,
      eventDate: row.event_date || undefined,
      // Correos de decisión siempre en inglés.
      lang: 'en',
      accepted: status === 'accepted',
      note: note || undefined,
    });

    res.json(row);
  } catch (err) {
    next(err);
  }
});

/* ---------- Mensaje personalizado (info de pago, etc.) ---------- */

app.post('/api/admin/inquiries/:id/custom-mail', async (req, res, next) => {
  if (!isAdmin(req)) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: 'Id inválido.' });
      return;
    }
    const body = (req.body ?? {}) as Record<string, unknown>;
    const message = String(body.message ?? '').trim();
    if (message.length < 3 || message.length > 1000) {
      res.status(400).json({ error: 'El mensaje debe tener entre 3 y 1000 caracteres.' });
      return;
    }

    const { rows } = await pool.query(
      `SELECT id, name, email, session_type, lang, event_date::text AS event_date
       FROM inquiries WHERE id = $1`,
      [id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: 'Solicitud no encontrada.' });
      return;
    }
    const row = rows[0];

    await pool.query(
      'INSERT INTO custom_emails (inquiry_id, message) VALUES ($1, $2)',
      [row.id, message]
    );

    sendCustomEmail({
      name: row.name,
      email: row.email,
      sessionType: row.session_type,
      // Correos personalizados siempre en inglés.
      lang: 'en',
      message,
    });

    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

/* ---------- Exportar solicitudes a Excel (.xlsx) ---------- */

const STATUS_XLSX: Record<string, { label: string; bg: string; fg: string }> = {
  pending: { label: 'Pendiente', bg: 'FFFFEB9C', fg: 'FF9C6500' },
  accepted: { label: 'Aceptada', bg: 'FFC6EFCE', fg: 'FF276738' },
  declined: { label: 'Rechazada', bg: 'FFFFC7CE', fg: 'FF9C0006' },
};

const BORDER_COLOR: Partial<ExcelJS.Borders> = {
  top: { style: 'thin', color: { argb: 'FFE0D5C2' } },
  left: { style: 'thin', color: { argb: 'FFE0D5C2' } },
  bottom: { style: 'thin', color: { argb: 'FFE0D5C2' } },
  right: { style: 'thin', color: { argb: 'FFE0D5C2' } },
};

app.get('/api/admin/inquiries.xlsx', async (req, res, next) => {
  if (!isAdmin(req)) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }
  try {
    const { rows } = await pool.query(
      `SELECT id, created_at, name, email, phone, session_type,
              event_date::text AS event_date, status, message, admin_note, lang
       FROM inquiries
       ORDER BY created_at DESC`
    );

    const wb = new ExcelJS.Workbook();
    wb.creator = 'Miriam Tellez · Panel';
    wb.created = new Date();

    const ws = wb.addWorksheet('Solicitudes');
    ws.columns = [
      { header: 'Fecha de solicitud', width: 20 },
      { header: 'Nombre', width: 20 },
      { header: 'Correo', width: 30 },
      { header: 'Teléfono', width: 16 },
      { header: 'Tipo de sesión', width: 20 },
      { header: 'Fecha del evento', width: 17 },
      { header: 'Estado', width: 13 },
      { header: 'Mensaje', width: 46 },
      { header: 'Nota admin', width: 38 },
      { header: 'Idioma', width: 9 },
    ];

    const head = ws.getRow(1);
    head.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
    head.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFA96F15' } };
    head.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    head.height = 26;
    head.eachCell((cell) => {
      cell.border = BORDER_COLOR;
    });

    for (const r of rows) {
      const st = STATUS_XLSX[r.status] ?? {
        label: String(r.status),
        bg: 'FFFFFFFF',
        fg: 'FF000000',
      };
      const row = ws.addRow([
        new Date(r.created_at),
        r.name,
        r.email,
        r.phone ?? '',
        r.session_type,
        r.event_date ? new Date(`${r.event_date}T12:00:00`) : null,
        st.label,
        r.message,
        r.admin_note ?? '',
        r.lang === 'en' ? 'EN' : 'ES',
      ]);
      row.alignment = { vertical: 'top' };

      row.getCell(1).numFmt = 'dd/mm/yyyy hh:mm';
      if (r.event_date) row.getCell(6).numFmt = 'dd/mm/yyyy';

      for (const col of [8, 9]) {
        row.getCell(col).alignment = { vertical: 'top', wrapText: true };
      }

      const statusCell = row.getCell(7);
      statusCell.font = { bold: true, color: { argb: st.fg } };
      statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: st.bg } };
      statusCell.alignment = { vertical: 'top', horizontal: 'center' };

      row.eachCell((cell) => {
        cell.border = BORDER_COLOR;
      });
    }

    ws.views = [{ state: 'frozen', ySplit: 1 }];
    ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: 10 } };

    const stamp = new Date().toISOString().slice(0, 10);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename="solicitudes_${stamp}.xlsx"`);
    res.send(Buffer.from(await wb.xlsx.writeBuffer()));
  } catch (err) {
    next(err);
  }
});

/* ---------- Reseñas: gestión en el panel ---------- */

app.get('/api/admin/testimonials', async (req, res, next) => {
  if (!isAdmin(req)) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }
  try {
    const { rows } = await pool.query(
      `SELECT id, author, session_type, session_type_en, quote, quote_en,
              rating, approved, sort_order, created_at
       FROM testimonials
       ORDER BY approved ASC, created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

app.patch('/api/admin/testimonials/:id', async (req, res, next) => {
  if (!isAdmin(req)) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: 'Id inválido.' });
      return;
    }
    const body = (req.body ?? {}) as Record<string, unknown>;
    if (typeof body.approved !== 'boolean') {
      res.status(400).json({ error: "Falta 'approved' (true/false)." });
      return;
    }
    const { rows } = await pool.query(
      `UPDATE testimonials SET approved = $1 WHERE id = $2
       RETURNING id, author, rating, approved`,
      [body.approved, id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: 'Reseña no encontrada.' });
      return;
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

app.delete('/api/admin/testimonials/:id', async (req, res, next) => {
  if (!isAdmin(req)) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: 'Id inválido.' });
      return;
    }
    const { rowCount } = await pool.query('DELETE FROM testimonials WHERE id = $1', [id]);
    if (!rowCount) {
      res.status(404).json({ error: 'Reseña no encontrada.' });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

/* ---------- Fotos: subida desde el panel ---------- */

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '30d', immutable: true }));

const ALLOWED_IMAGE_MIME = new Map<string, string>([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
]);

const photoUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
      const ext = ALLOWED_IMAGE_MIME.get(file.mimetype) ?? path.extname(file.originalname).toLowerCase();
      cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`);
    },
  }),
  limits: { fileSize: 12 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    cb(null, ALLOWED_IMAGE_MIME.has(file.mimetype));
  },
});

function requireAdmin(req: express.Request, res: express.Response): boolean {
  if (!isAdmin(req)) {
    res.status(401).json({ error: 'No autorizado' });
    return false;
  }
  return true;
}

app.post('/api/admin/photos', (req, res, next) => {
  if (!requireAdmin(req, res)) return;
  photoUpload.single('photo')(req, res, (err) => {
    if (err) {
      console.error('[upload] error multer:', err instanceof Error ? `${err.name}: ${err.message}` : err);
      const msg =
        err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE'
          ? 'La foto pesa más de 12 MB.'
          : 'Formato no permitido. Usa JPG, PNG o WebP.';
      res.status(400).json({ error: msg });
      return;
    }
    (async () => {
      try {
        const body = (req.body ?? {}) as Record<string, unknown>;
        const categoryId = Number(body.categoryId);
        if (!Number.isInteger(categoryId) || categoryId <= 0 || !req.file) {
          res.status(400).json({ error: 'Falta la foto o la categoría es inválida.' });
          return;
        }
        const cat = await pool.query(
          'SELECT id, slug, label, label_en FROM gallery_categories WHERE id = $1',
          [categoryId]
        );
        if (cat.rowCount === 0) {
          res.status(400).json({ error: 'La categoría no existe.' });
          return;
        }
        const alt = String(body.alt ?? '').trim().replace(/\s+/g, ' ').slice(0, 80);
        if (alt.length < 3) {
          res.status(400).json({ error: 'Describe la foto en español (mínimo 3 caracteres).' });
          return;
        }
        const altEnRaw = String(body.altEn ?? '').trim().replace(/\s+/g, ' ').slice(0, 80);
        const orientation = body.orientation === 'landscape' ? 'landscape' : 'portrait';
        const width = Number.isInteger(Number(body.width)) && Number(body.width) > 0 ? Number(body.width) : null;
        const height =
          Number.isInteger(Number(body.height)) && Number(body.height) > 0 ? Number(body.height) : null;

        const { rows } = await pool.query(
          `INSERT INTO photos (category_id, src, alt, alt_en, orientation, sort_order, width, height)
           VALUES ($1, $2, $3, $4, $5,
                   (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM photos WHERE category_id = $1),
                   $6, $7)
           RETURNING id`,
          [categoryId, `/uploads/${req.file.filename}`, alt, altEnRaw || alt, orientation, width, height]
        );

        const inserted = await pool.query(
          `SELECT p.id, p.src, p.alt, p.alt_en, p.orientation, p.width, p.height,
                  c.id AS category_id, c.slug AS category_slug, c.label AS category_label
           FROM photos p JOIN gallery_categories c ON c.id = p.category_id
           WHERE p.id = $1`,
          [rows[0].id]
        );
        res.status(201).json(inserted.rows[0]);
      } catch (e) {
        next(e);
      }
    })();
  });
});

app.delete('/api/admin/photos/:id', async (req, res, next) => {
  if (!requireAdmin(req, res)) return;
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: 'Id inválido.' });
      return;
    }
    const { rows } = await pool.query('SELECT src FROM photos WHERE id = $1', [id]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Foto no encontrada.' });
      return;
    }
    await pool.query('DELETE FROM photos WHERE id = $1', [id]);

    const src = String(rows[0].src);
    if (src.startsWith('/uploads/')) {
      fs.promises.unlink(path.join(UPLOAD_DIR, path.basename(src))).catch(() => undefined);
    }
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[api]', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const server = app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});

/* ---------- Recordatorio automático 48h antes de la sesión ---------- */

const REMINDER_WINDOW_MS = 2 * 60 * 60 * 1000; // margen de 2h para no perder solicitudes
const REMINDER_INTERVAL_MS = 30 * 60 * 1000;

async function runReminders(): Promise<void> {
  try {
    const now = new Date();
    const upper = new Date(now.getTime() + 48 * 60 * 60 * 1000 + REMINDER_WINDOW_MS);
    const { rows } = await pool.query(
      `SELECT id, name, email, session_type, event_date::text AS event_date, lang
       FROM inquiries
       WHERE status = 'accepted'
         AND reminder_48h_sent = false
         AND event_date IS NOT NULL
         AND event_date::timestamp >= $1
         AND event_date::timestamp <= $2
       ORDER BY event_date`,
      [now, upper]
    );
    for (const row of rows) {
      sendReminderEmail({
        name: row.name,
        email: row.email,
        sessionType: row.session_type,
        eventDate: row.event_date,
        // Recordatorios siempre en inglés.
        lang: 'en',
      });
      await pool.query('UPDATE inquiries SET reminder_48h_sent = true WHERE id = $1', [row.id]);
    }
  } catch (err) {
    console.error('[reminder] Error ejecutando recordatorios:', err instanceof Error ? err.message : err);
  }
}

void runReminders();
setInterval(() => void runReminders(), REMINDER_INTERVAL_MS);

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => {
    server.close(() => pool.end().then(() => process.exit(0)));
  });
}
