import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST ?? '';
const SMTP_PORT = Number(process.env.SMTP_PORT ?? 1025);
const SMTP_USER = process.env.SMTP_USER ?? '';
const SMTP_PASS = process.env.SMTP_PASS ?? '';
const MAIL_FROM = process.env.MAIL_FROM ?? 'Miriam Tellez <miriamtellezphotography@gmail.com>';
const PHOTOGRAPHER_EMAIL = process.env.PHOTOGRAPHER_EMAIL ?? 'miriamtellezphotography@gmail.com';

export type MailLang = 'en' | 'es';

export interface InquiryMailData {
  name: string;
  email: string;
  phone?: string;
  sessionType: string;
  eventDate?: string;
  message: string;
  lang: MailLang;
}

let transporter: Transporter | null = null;

function smtpUnavailableReason(): string | null {
  if (!SMTP_HOST) return 'SMTP_HOST sin configurar';
  if (SMTP_USER && !SMTP_PASS) return 'falta la API key de Resend (pega tu clave en SMTP_PASS)';
  return null;
}

function getTransport(): Transporter | null {
  if (smtpUnavailableReason()) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    });
  }
  return transporter;
}

const esc = (value: string) =>
  value.replace(/[&<>"']/g, (c) =>
    c === '&'
      ? '&amp;'
      : c === '<'
        ? '&lt;'
        : c === '>'
          ? '&gt;'
          : c === '"'
            ? '&quot;'
            : '&#39;'
  );

function formatDate(date?: string, lang: MailLang = 'es'): string {
  if (!date) return '';
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString(lang === 'es' ? 'es-MX' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function layout(innerHtml: string): string {
  return `<!doctype html>
<html><body style="margin:0;padding:0;background-color:#f3eada;font-family:Georgia,'Times New Roman',serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3eada;padding:32px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#fbf6ed;border-radius:18px;overflow:hidden;border:1px solid rgba(46,33,21,0.14);">
<tr><td style="padding:26px 34px 8px;">
  <p style="margin:0;font-size:15px;letter-spacing:3px;text-transform:uppercase;color:#a96f15;font-family:Arial,Helvetica,sans-serif;font-weight:bold;">Miriam Tellez</p>
</td></tr>
${innerHtml}
<tr><td style="padding:6px 34px 30px;border-top:1px solid rgba(46,33,21,0.12);margin-top:10px;">
  <p style="margin:16px 0 0;font-size:13px;line-height:1.7;color:#6e5b47;">
    Central Valley, CA &middot; <a href="https://www.instagram.com/miriamtellezphotography/" style="color:#a96f15;">@miriamtellezphotography</a>
  </p>
</td></tr>
</table>
</td></tr></table>
</body></html>`;
}

function detailRow(label: string, value: string): string {
  if (!value) return '';
  return `<tr>
    <td style="padding:9px 0;color:#6e5b47;font-size:14px;width:150px;font-family:Arial,Helvetica,sans-serif;">${esc(label)}</td>
    <td style="padding:9px 0;color:#2e2115;font-size:14px;font-weight:bold;">${esc(value)}</td>
  </tr>`;
}

function clientEmail(d: InquiryMailData): { to: string; subject: string; html: string; text: string } {
  const es = d.lang === 'es';
  const dateLabel = formatDate(d.eventDate, d.lang);

  const inner = `
<tr><td style="padding:18px 34px 0;">
  <h1 style="margin:0;font-size:24px;font-weight:normal;color:#2e2115;">${
    es ? 'Recibimos tu solicitud' : 'We received your request'
  }</h1>
  <p style="margin:14px 0 0;font-size:15px;line-height:1.75;color:#2e2115;">
    ${es
      ? `Hola ${esc(d.name.split(' ')[0])}, gracias por escribir. Te voy a responder en menos de <strong>24 horas</strong> al correo con el que te contactaste para platicar los detalles de tu sesión.`
      : `Hi ${esc(d.name.split(' ')[0])}, thanks for reaching out. I will reply within <strong>24 hours</strong> to the email you left so we can plan your session together.`}
  </p>
</td></tr>
<tr><td style="padding:20px 34px 4px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fffdf7;border-radius:12px;border:1px solid rgba(46,33,21,0.1);">
    ${detailRow(es ? 'Tipo de sesión' : 'Session type', d.sessionType)}
    ${dateLabel ? detailRow(es ? 'Fecha tentativa' : 'Preferred date', dateLabel) : ''}
    ${detailRow(es ? 'Tu mensaje' : 'Your message', d.message.length > 140 ? `${d.message.slice(0, 140)}…` : d.message)}
  </table>
</td></tr>
<tr><td style="padding:18px 34px 0;">
  <p style="margin:0;font-size:14px;line-height:1.7;color:#6e5b47;">
    ${es
      ? 'Mientras tanto sígueme en Instagram y sueña esa luz dorada.'
      : 'In the meantime follow me on Instagram and dream about that golden light.'}
  </p>
</td></tr>`;

  const text = es
    ? `Hola ${d.name}: recibimos tu solicitud (${d.sessionType}). Te responderemos en menos de 24 horas. — Miriam Tellez`
    : `Hi ${d.name}: we received your request (${d.sessionType}). We will reply within 24 hours. — Miriam Tellez`;

  return {
    to: d.email,
    subject: es
      ? 'Recibimos tu solicitud · Miriam Tellez Fotografía'
      : 'We received your request · Miriam Tellez Photography',
    html: layout(inner),
    text,
  };
}

function photographerEmail(d: InquiryMailData): { to: string; replyTo: string; subject: string; html: string; text: string } {
  const dateLabel = formatDate(d.eventDate, 'en');

  const inner = `
<tr><td style="padding:18px 34px 0;">
  <h1 style="margin:0;font-size:22px;font-weight:normal;color:#2e2115;">New session request</h1>
  <p style="margin:10px 0 0;font-size:14px;line-height:1.7;color:#2e2115;">
    <strong>${esc(d.name)}</strong> wants a <strong>${esc(d.sessionType)}</strong> session.
    Reply straight to this email — it goes to their address (<strong>${esc(d.email)}</strong>).
  </p>
</td></tr>
<tr><td style="padding:20px 34px 4px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fffdf7;border-radius:12px;border:1px solid rgba(46,33,21,0.1);">
    ${detailRow('Language', d.lang === 'en' ? 'English' : 'Spanish')}
    ${detailRow('Email', d.email)}
    ${detailRow('Phone', d.phone || '—')}
    ${detailRow('Preferred date', dateLabel || '—')}
    ${detailRow('Message', d.message)}
  </table>
</td></tr>`;

  const text = [
    `New request: ${d.name} (${d.email})`,
    d.phone ? `Phone: ${d.phone}` : null,
    `Session: ${d.sessionType}`,
    dateLabel ? `Date: ${dateLabel}` : null,
    `Language: ${d.lang === 'en' ? 'English' : 'Spanish'}`,
    '',
    d.message,
  ]
    .filter(Boolean)
    .join('\n');

  return {
    to: PHOTOGRAPHER_EMAIL,
    replyTo: `${d.name} <${d.email}>`,
    subject: `New request: ${d.sessionType} — ${d.name}`,
    html: layout(inner),
    text,
  };
}

async function deliver(d: InquiryMailData): Promise<void> {
  const reason = smtpUnavailableReason();
  if (reason) {
    console.log(`[mail] Correos omitidos: ${reason}.`);
    return;
  }
  const transport = getTransport()!;

  const client = clientEmail(d);
  try {
    await transport.sendMail({ from: MAIL_FROM, ...client });
    console.log(`[mail] Confirmación enviada al cliente ${d.email}`);
  } catch (err) {
    console.error('[mail] Error confirmando al cliente:', err instanceof Error ? err.message : err);
  }

  const photographer = photographerEmail(d);
  try {
    await transport.sendMail({ from: MAIL_FROM, ...photographer });
    console.log(`[mail] Notificación enviada a la fotógrafa (${PHOTOGRAPHER_EMAIL})`);
  } catch (err) {
    console.error('[mail] Error notificando a la fotógrafa:', err instanceof Error ? err.message : err);
  }
}

export function sendInquiryEmails(d: InquiryMailData): void {
  void deliver(d);
}

export interface DecisionMailData {
  name: string;
  email: string;
  sessionType: string;
  eventDate?: string;
  lang: MailLang;
  accepted: boolean;
  note?: string;
}

async function deliverDecision(d: DecisionMailData): Promise<void> {
  const reason = smtpUnavailableReason();
  if (reason) {
    console.log(`[mail] Correo de decisión omitido: ${reason}.`);
    return;
  }
  const transport = getTransport()!;

  const es = d.lang === 'es';
  const dateLabel = formatDate(d.eventDate, d.lang);
  const firstName = esc(d.name.split(' ')[0]);

  const noteBlock = d.note
    ? `<tr><td style="padding:18px 34px 0;">
        <div style="background-color:#fffdf7;border-left:4px solid #d9962f;border-radius:10px;padding:14px 18px;">
          <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#a96f15;font-family:Arial,Helvetica,sans-serif;font-weight:bold;">
            ${es ? 'Nota de Miriam' : 'A note from Miriam'}
          </p>
          <p style="margin:8px 0 0;font-size:15px;line-height:1.75;color:#2e2115;">${esc(d.note)}</p>
        </div>
      </td></tr>`
    : '';

  const headline = d.accepted
    ? es
      ? '¡Tu sesión quedó agendada!'
      : 'Your session is officially booked!'
    : dateLabel
      ? es
        ? 'Esa fecha ya no está disponible'
        : 'That date is no longer available'
      : es
        ? 'Sobre tu solicitud'
        : 'About your request';

  const bodyText = d.accepted
    ? es
      ? `Hola ${firstName}: confirmamos tu sesión de <strong>${esc(d.sessionType)}</strong>${
          dateLabel ? ` para el <strong>${dateLabel}</strong>` : ''
        }. Te escribiré pronto con los últimos detalles (ubicación exacta y hora de encuentro). ¡Prepárate para la luz dorada!`
      : `Hi ${firstName}: your <strong>${esc(d.sessionType)}</strong> session${
          dateLabel ? ` on <strong>${dateLabel}</strong>` : ''
        } is confirmed. I will reach out soon with the final details (exact location and meeting time). Get ready for that golden light!`
    : es
      ? `Hola ${firstName}: gracias por pensar en mí para tu sesión de ${esc(
          d.sessionType
        )}. Lamentablemente${dateLabel ? ` la fecha del <strong>${dateLabel}</strong> ya está tomada` : ' no puedo tomar esta solicitud en este momento'}.
        Si puedes, respóndeme este correo proponiendo otro día — con gusto buscamos una nueva hora dorada juntos.`
      : `Hi ${firstName}: thank you for thinking of me for your ${esc(
          d.sessionType
        )} session. Unfortunately,${
          dateLabel ? ` <strong>${dateLabel}</strong> is already taken` : ' I cannot take this request right now'
        }. If you can, reply to this email with another day — I would love to find a new golden hour together.`;

  const inner = `
<tr><td style="padding:18px 34px 0;">
  <h1 style="margin:0;font-size:24px;font-weight:normal;color:#2e2115;">${headline}</h1>
  <p style="margin:14px 0 0;font-size:15px;line-height:1.75;color:#2e2115;">${bodyText}</p>
</td></tr>
${noteBlock}
<tr><td style="padding:20px 34px 0;">
  <p style="margin:0;font-size:14px;color:#6e5b47;">${
    es ? 'Un abrazo, Miriam' : 'Warmly, Miriam'
  }</p>
</td></tr>`;

  const text = `${headline}\n\n${d.note ? `${d.note}\n\n` : ''}— Miriam Tellez`;

  try {
    await transport.sendMail({
      from: MAIL_FROM,
      to: d.email,
      replyTo: PHOTOGRAPHER_EMAIL,
      subject: d.accepted
        ? es
          ? '¡Tu sesión quedó agendada! · Miriam Tellez Fotografía'
          : 'Your session is booked! · Miriam Tellez Photography'
        : es
          ? 'Novedades sobre tu solicitud · Miriam Tellez Fotografía'
          : 'An update on your request · Miriam Tellez Photography',
      html: layout(inner),
      text,
    });
    console.log(`[mail] Decisión (${d.accepted ? 'aceptada' : 'rechazada'}) enviada a ${d.email}`);
  } catch (err) {
    console.error('[mail] Error enviando decisión:', err instanceof Error ? err.message : err);
  }
}

export function sendDecisionEmail(d: DecisionMailData): void {
  void deliverDecision(d);
}

export interface NewReviewMailData {
  author: string;
  rating: number;
}

async function deliverNewReview(d: NewReviewMailData): Promise<void> {
  const reason = smtpUnavailableReason();
  if (reason) {
    console.log(`[mail] Aviso de reseña omitido: ${reason}.`);
    return;
  }
  const transport = getTransport()!;

  const inner = `
<tr><td style="padding:18px 34px 0;">
  <h1 style="margin:0;font-size:22px;font-weight:normal;color:#2e2115;">New review awaiting approval</h1>
  <p style="margin:14px 0 0;font-size:15px;line-height:1.75;color:#2e2115;">
    <strong>${esc(d.author)}</strong> left a <strong>${'★'.repeat(d.rating)}</strong> review on the site.
  </p>
  <p style="margin:12px 0 0;font-size:15px;color:#2e2115;">
    Open it from your dashboard at <strong>/admin → Reviews</strong> to publish or discard it.
  </p>
</td></tr>
<tr><td style="padding:20px 34px 0;"><p style="margin:0;font-size:14px;color:#6e5b47;">— Miriam's website</p></td></tr>`;

  try {
    await transport.sendMail({
      from: MAIL_FROM,
      to: PHOTOGRAPHER_EMAIL,
      subject: 'New review pending approval · Dashboard',
      html: layout(inner),
      text: `New review by ${d.author} (${d.rating} stars). Review it in /admin → Reviews.`,
    });
    console.log(`[mail] Aviso de reseña nueva enviado a ${PHOTOGRAPHER_EMAIL}`);
  } catch (err) {
    console.error('[mail] Error enviando aviso de reseña:', err instanceof Error ? err.message : err);
  }
}

export function sendNewReviewEmail(d: NewReviewMailData): void {
  void deliverNewReview(d);
}
