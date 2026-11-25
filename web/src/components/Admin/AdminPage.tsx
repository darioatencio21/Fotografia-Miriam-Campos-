import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import type {
  AdminInquiry,
  AdminTestimonial,
  GalleryCategory,
  InquiryStatus,
  Photo,
} from '../../types';
import {
  adminDecideInquiry,
  adminDeletePhoto,
  adminDeleteTestimonial,
  adminFetchInquiries,
  adminFetchTestimonials,
  adminSendCustomMail,
  adminSetTestimonialApproved,
  adminUploadPhoto,
  clearAdminKey,
  downloadInquiriesExcel,
  fetchCategories,
  fetchPhotos,
  getStoredAdminKey,
  saveAdminKey,
} from '../../lib/api';
import { AdminAuthError } from '../../lib/api';
import { prepareUploadImage } from '../../lib/images';
import { useLang } from '../../i18n';
import type { Lang } from '../../i18n';

type View = 'solicitudes' | 'resenas' | 'fotos';
type Filter = InquiryStatus | 'todas';

const NOTE_LIMIT = 500;

const WEEKDAYS: Record<Lang, string[]> = {
  es: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  en: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
};

const MONTHS: Record<Lang, string[]> = {
  es: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],
  en: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
};

function fill(tpl: string, vars: Record<string, string | number>): string {
  return tpl.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ''));
}

function localeOf(lang: Lang): string {
  return lang === 'es' ? 'es-MX' : 'en-US';
}

function fmtDateTime(iso: string, lang: Lang): string {
  return new Date(iso).toLocaleString(localeOf(lang), {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function fmtDay(value: string | null, lang: Lang): string {
  if (!value) return '';
  const d = new Date(`${value}T12:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(localeOf(lang), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

function isoDay(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3 12h18M12 3c2.6 2.4 4 5.5 4 9s-1.4 6.6-4 9c-2.6-2.4-4-5.5-4-9s1.4-6.6 4-9z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M15 18l-6-6 6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M9 18l6-6-6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M18 6 6 18M6 6l12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={filled ? 'is-filled' : ''}>
      <path
        d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <span className="admin-lang-toggle" role="group" aria-label="ES / EN">
      <GlobeIcon />
      {(['es', 'en'] as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          className={`chip ${lang === l ? 'is-active' : ''}`}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </span>
  );
}

export default function AdminPage() {
  const { t } = useLang();
  const a = t.admin;
  const [phase, setPhase] = useState<'checking' | 'login' | 'ready'>('checking');
  const [view, setView] = useState<View>('solicitudes');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingCount, setPendingCount] = useState(0);

  async function load(): Promise<void> {
    setLoading(true);
    setError('');
    try {
      const rows = await adminFetchInquiries();
      setPendingCount(rows.filter((r) => r.status === 'pending').length);
      setPhase('ready');
    } catch (err) {
      if (err instanceof AdminAuthError) {
        clearAdminKey();
        setPendingCount(0);
        setPhase('login');
      } else {
        setError(err instanceof Error ? err.message : a.errLoadInquiries);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!getStoredAdminKey()) {
      setPhase('login');
      return;
    }
    void load();
  }, []);

  async function onLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!password.trim()) return;
    saveAdminKey(password.trim());
    await load();
    setPassword('');
  }

  function logout() {
    clearAdminKey();
    setPhase('login');
    setPassword('');
  }

  if (phase === 'login') {
    return (
      <div className="admin-page">
        <div className="admin-login-wrap">
          <form className="admin-login" onSubmit={onLogin}>
            <div className="admin-login-top">
              <LangToggle />
            </div>
            <p className="admin-brand">{a.brand}</p>
            <h1>{a.loginTitle}</h1>
            <p className="admin-login-hint">{a.loginHint}</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={a.passwordPlaceholder}
              autoComplete="current-password"
              autoFocus
            />
            <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
              {loading ? a.checking : a.enter}
            </button>
            {error && (
              <p className="admin-error" role="alert">
                {error}
              </p>
            )}
            <a className="admin-back-link" href="/">
              {a.backToSite}
            </a>
          </form>
        </div>
      </div>
    );
  }

  if (phase !== 'ready') {
    return (
      <div className="admin-page">
        <main className="admin-container">
          <p className="admin-empty">{a.loading}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <p className="admin-brand">{a.brand}</p>
        <div className="admin-header-actions">
          <LangToggle />
          <a
            className="admin-header-control admin-header-site"
            href="/"
            aria-label={a.viewSite}
          >
            <ExternalLinkIcon />
            <span className="admin-header-site-label">{a.viewSite}</span>
          </a>
          <button className="admin-header-control admin-header-logout" type="button" onClick={logout}>
            <LogoutIcon />
            <span>{a.logout}</span>
          </button>
        </div>
      </header>

      <nav className="admin-view-tabs container-admin" aria-label={a.navAria}>
        {(
          [
            ['solicitudes', a.views.solicitudes],
            ['resenas', a.views.resenas],
            ['fotos', a.views.fotos],
          ] as [View, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`chip ${view === key ? 'is-active' : ''}`}
            onClick={() => setView(key)}
          >
            {label}
            {key === 'solicitudes' && pendingCount > 0 && (
              <span className="tab-badge" title={`${a.fPending}: ${pendingCount}`}>
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      {error && (
        <div className="container-admin">
          <p className="admin-error" role="alert">
            {error}
          </p>
        </div>
      )}

      {view === 'solicitudes' && <InquiriesView loading={loading} reload={load} />}
      {view === 'resenas' && <ReviewsView />}
      {view === 'fotos' && <PhotosView />}
    </div>
  );
}

/* ==================== Vista: Solicitudes ==================== */

function InquiriesView({ loading, reload }: { loading: boolean; reload: () => Promise<void> }) {
  const { lang, t } = useLang();
  const a = t.admin;
  const [inquiries, setInquiries] = useState<AdminInquiry[]>([]);
  const [filter, setFilter] = useState<Filter>('todas');
  const [typeFilter, setTypeFilter] = useState<string>('todas');
  const [busyId, setBusyId] = useState<number | null>(null);
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [flash, setFlash] = useState('');
  const [error, setError] = useState('');
  const [monthCursor, setMonthCursor] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [customPanelId, setCustomPanelId] = useState<number | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [customBusy, setCustomBusy] = useState(false);

  useEffect(() => {
    adminFetchInquiries()
      .then(setInquiries)
      .catch((err) => {
        if (!(err instanceof AdminAuthError)) setError(a.errLoadInquiries);
      });
  }, []);

  async function decide(id: number, status: 'accepted' | 'declined', withNote?: string) {
    setBusyId(id);
    setError('');
    try {
      await adminDecideInquiry(id, status, withNote);
      setFlash(status === 'accepted' ? a.flashAccepted : a.flashDeclined);
      setRejectId(null);
      setNote('');
      await reload();
      adminFetchInquiries().then(setInquiries);
    } catch (err) {
      if (err instanceof AdminAuthError) {
        clearAdminKey();
        window.location.href = '/admin';
        return;
      }
      setError(err instanceof Error ? err.message : a.errUpdate);
    } finally {
      setBusyId(null);
    }
  }

  function accept(inq: AdminInquiry) {
    const when = inq.event_date ? `${a.forDate}${fmtDay(inq.event_date, lang)}` : '';
    const ok = window.confirm(fill(a.confirmAccept, { name: inq.name, when }));
    if (ok) void decide(inq.id, 'accepted');
  }

  function openReject(id: number) {
    setRejectId((cur) => (cur === id ? null : id));
    setNote('');
  }

  function submitReject(e: FormEvent<HTMLFormElement>, id: number) {
    e.preventDefault();
    void decide(id, 'declined', note.trim());
  }

  async function sendCustom(id: number, message: string) {
    if (!message.trim()) return;
    setCustomBusy(true);
    setError('');
    try {
      await adminSendCustomMail(id, message.trim());
      setFlash(a.customSentFlash);
      setCustomPanelId(null);
      setCustomMessage('');
    } catch (err) {
      if (err instanceof AdminAuthError) {
        clearAdminKey();
        window.location.href = '/admin';
        return;
      }
      setError(err instanceof Error ? err.message : a.errCustomSend);
    } finally {
      setCustomBusy(false);
    }
  }

  /* ---- Calendario ---- */
  const byDay = useMemo(() => {
    const map = new Map<string, { accepted: number; pending: number }>();
    for (const i of inquiries) {
      if (!i.event_date || i.status === 'declined') continue;
      const cur = map.get(i.event_date) ?? { accepted: 0, pending: 0 };
      if (i.status === 'accepted') cur.accepted += 1;
      else cur.pending += 1;
      map.set(i.event_date, cur);
    }
    return map;
  }, [inquiries]);

  const sessionTypes = useMemo(
    () =>
      [...new Set(inquiries.map((i) => i.session_type).filter(Boolean))].sort((x, y) =>
        x.localeCompare(y, localeOf(lang))
      ),
    [inquiries, lang]
  );

  const summary = useMemo(() => {
    const y = monthCursor.getFullYear();
    const m = monthCursor.getMonth();
    let received = 0;
    let acceptedCreated = 0;
    let confirmed = 0;
    for (const i of inquiries) {
      const created = new Date(i.created_at);
      if (created.getFullYear() === y && created.getMonth() === m) {
        received += 1;
        if (i.status === 'accepted') acceptedCreated += 1;
      }
      if (i.status === 'accepted' && i.event_date) {
        const ev = new Date(`${i.event_date}T12:00:00`);
        if (ev.getFullYear() === y && ev.getMonth() === m) confirmed += 1;
      }
    }
    return { received, rate: received > 0 ? Math.round((acceptedCreated / received) * 100) : null, confirmed };
  }, [inquiries, monthCursor]);

  const dayInquiries = useMemo(
    () => (selectedDay ? inquiries.filter((i) => i.event_date === selectedDay) : []),
    [inquiries, selectedDay]
  );

  const calendarCells = useMemo(() => {
    const y = monthCursor.getFullYear();
    const m = monthCursor.getMonth();
    const firstWeekday = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const cells: (Date | null)[] = Array.from({ length: firstWeekday }, () => null);
    for (let d = 1; d <= daysInMonth; d += 1) cells.push(new Date(y, m, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [monthCursor]);

  const todayIso = isoDay(new Date());
  const shiftMonth = (delta: number) => {
    setSelectedDay(null);
    setMonthCursor((cur) => new Date(cur.getFullYear(), cur.getMonth() + delta, 1));
  };

  async function exportCsv() {
    setError('');
    try {
      await downloadInquiriesExcel();
    } catch (err) {
      if (!(err instanceof AdminAuthError)) {
        setError(a.errExcel);
      }
    }
  }

  const counts = {
    pending: inquiries.filter((i) => i.status === 'pending').length,
    accepted: inquiries.filter((i) => i.status === 'accepted').length,
    declined: inquiries.filter((i) => i.status === 'declined').length,
    todas: inquiries.length,
  };
  let visible = filter === 'todas' ? inquiries : inquiries.filter((i) => i.status === filter);
  if (typeFilter !== 'todas') visible = visible.filter((i) => i.session_type === typeFilter);
  if (selectedDay) visible = visible.filter((i) => i.event_date === selectedDay);

  return (
    <main className="admin-container">
      {/* Resumen del mes mostrado en el calendario */}
      <section className="admin-summary" aria-label={`${a.sumReceived} · ${MONTHS[lang][monthCursor.getMonth()]} ${monthCursor.getFullYear()}`}>
        <p className="summary-month">
          {MONTHS[lang][monthCursor.getMonth()]} {monthCursor.getFullYear()}
        </p>
        <div className="summary-cards">
          <div className="summary-card">
            <strong>{summary.received}</strong>
            <span>{a.sumReceived}</span>
          </div>
          <div className="summary-card">
            <strong>{summary.rate === null ? 'N/A' : `${summary.rate}%`}</strong>
            <span>{a.sumRate}</span>
          </div>
          <div className="summary-card">
            <strong>{summary.confirmed}</strong>
            <span>{a.sumConfirmed}</span>
          </div>
        </div>
      </section>

      {/* Calendario mensual */}
      <section className="admin-calendar" aria-label={a.calAria}>
        <p className="cal-eyebrow">{a.calAria}</p>
        <div className="cal-head">
          <div className="cal-month">
            <button
              type="button"
              className="cal-nav"
              onClick={() => shiftMonth(-1)}
              aria-label={a.prevMonth}
            >
              <ChevronLeftIcon />
            </button>
            <strong>
              {MONTHS[lang][monthCursor.getMonth()]} {monthCursor.getFullYear()}
            </strong>
            <button
              type="button"
              className="cal-nav"
              onClick={() => shiftMonth(1)}
              aria-label={a.nextMonth}
            >
              <ChevronRightIcon />
            </button>
          </div>
          <button type="button" className="cal-today" onClick={() => setMonthCursor(new Date())}>
            <CalendarIcon />
            {a.today}
          </button>
        </div>
        <div className="cal-grid" role="grid">
          {WEEKDAYS[lang].map((w, i) => (
            <span key={`${w}${i}`} className="cal-weekday" aria-hidden="true">
              {w}
            </span>
          ))}
          {calendarCells.map((d, idx) => {
            if (!d) return <span key={`blank${idx}`} />;
            const iso = isoDay(d);
            const info = byDay.get(iso);
            const classes = [
              'cal-day',
              info?.accepted ? 'is-accepted' : '',
              info && !info.accepted ? 'is-pending' : '',
              iso === todayIso ? 'is-today' : '',
              selectedDay === iso ? 'is-selected' : '',
            ]
              .filter(Boolean)
              .join(' ');
            return (
              <button
                key={iso}
                type="button"
                className={classes}
                disabled={!info}
                title={
                  info
                    ? fill(a.dayTitle, { a: info.accepted, p: info.pending })
                    : undefined
                }
                onClick={() => setSelectedDay(selectedDay === iso ? null : iso)}
              >
                <span>{d.getDate()}</span>
                {info && (
                  <span className="cal-dots" aria-hidden="true">
                    {Array.from({ length: Math.min(info.accepted, 3) }, (_, i) => (
                      <i key={`a${i}`} className="cal-dot is-accepted" />
                    ))}
                    {Array.from({ length: Math.min(info.pending, 3) }, (_, i) => (
                      <i key={`p${i}`} className="cal-dot is-pending" />
                    ))}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <p className="cal-legend">
          <span className="cal-legend-item">
            <i className="dot dot-full" aria-hidden="true" />
            {a.legendAccepted}
          </span>
          <span className="cal-legend-item">
            <i className="dot dot-empty" aria-hidden="true" />
            {a.legendPending}
          </span>
          {selectedDay && (
            <span className="cal-legend-selected">
              {a.showing} <strong>{fmtDay(selectedDay, lang)}</strong>
              <button type="button" className="cal-clear" onClick={() => setSelectedDay(null)}>
                {a.seeAll}
              </button>
            </span>
          )}
        </p>
        {selectedDay && dayInquiries.length > 0 && (
          <div className="cal-day-panel" role="region" aria-label={`${a.dayPanelFor} ${fmtDay(selectedDay, lang)}`}>
            <div className="cal-day-panel-head">
              <strong>
                {a.dayPanelFor} {fmtDay(selectedDay, lang)}
              </strong>
              <button
                type="button"
                className="cal-close"
                onClick={() => setSelectedDay(null)}
                aria-label={a.dayPanelClose}
              >
                <CloseIcon />
              </button>
            </div>
            <ul>
              {dayInquiries.map((i) => (
                <li key={i.id}>
                  <span className={`status-badge is-${i.status}`}>{a.statusLabels[i.status]}</span>
                  <div className="cal-day-panel-info">
                    <strong>{i.name}</strong>
                    <span>{i.session_type}</span>
                    <span>
                      <a href={`mailto:${i.email}`}>{i.email}</a>
                      {i.phone ? ` · ${i.phone}` : ''}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <div className="admin-tabs" role="tablist" aria-label={a.tabsAria}>
        {(['todas', 'pending', 'accepted', 'declined'] as Filter[]).map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            className={`chip ${filter === f ? 'is-active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'todas'
              ? `${a.fAll} (${counts.todas})`
              : f === 'pending'
                ? `${a.fPending} (${counts.pending})`
                : f === 'accepted'
                  ? `${a.fAccepted} (${counts.accepted})`
                  : `${a.fDeclined} (${counts.declined})`}
          </button>
        ))}
        <label className="admin-type-select">
          <select
            value={typeFilter}
            aria-label={a.typeFilterAria}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="todas">{a.fSessionAll}</option>
            {sessionTypes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="chip admin-refresh" onClick={() => void reload()} disabled={loading}>
          <RefreshIcon />
          {a.refresh}
        </button>
        <button
          type="button"
          className="btn btn-csv"
          onClick={() => void exportCsv()}
          title={a.excelTitle}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              fill="currentColor"
              d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1.5 13.5L11 18l-1.5-2.5L8 18l-1-1 2-3-2-3 1-1 1.5 2.5L11 10l1 1-2 3 2 3 0.5-1.5zM14 9V3.5L19.5 9H14z"
            />
          </svg>
          <span>
            {a.excelBtn} <small>({fill(a.excelCount, { n: counts.todas })})</small>
          </span>
          <svg className="csv-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path fill="currentColor" d="M12 16l-6-6h4V4h4v6h4l-6 6zM5 20h14v-2H5v2z" />
          </svg>
        </button>
      </div>

      {!error && flash && (
        <p className="admin-flash" role="status">
          ✓ {flash}
        </p>
      )}

      {visible.length === 0 && !loading && <p className="admin-empty">{a.emptyInquiries}</p>}

      {visible.map((inq) => (
        <article key={inq.id} className={`admin-card status-${inq.status}`}>
          <div className="admin-card-top">
            <div className="admin-card-meta">
              <span className={`status-badge is-${inq.status}`}>{a.statusLabels[inq.status]}</span>
              <span className="admin-lang-chip">{inq.lang === 'en' ? 'EN' : 'ES'}</span>
            </div>
            <time>{fmtDateTime(inq.created_at, lang)}</time>
          </div>

          <div className="admin-card-body">
            <div className="admin-card-main">
              <h2>{inq.name}</h2>
              <p className="admin-session">{inq.session_type}</p>
              {inq.event_date && (
                <p className="admin-date">
                  <CalendarIcon />
                  {fmtDay(inq.event_date, lang)}
                </p>
              )}
            </div>
            <ul className="admin-contact">
              <li>
                <a href={`mailto:${inq.email}`}>
                  <MailIcon />
                  {inq.email}
                </a>
              </li>
              {inq.phone && (
                <li>
                  <PhoneIcon />
                  {inq.phone}
                </li>
              )}
            </ul>
          </div>

          <blockquote>{inq.message}</blockquote>

          {(inq.status === 'pending' || inq.admin_note) && (
            <footer className="admin-card-footer">
              {inq.status === 'pending' ? (
                <>
                  <a
                    className="btn btn-primary btn-sm"
                    href={`mailto:${inq.email}?subject=${encodeURIComponent(a.contactSubject)}`}
                  >
                    {a.contactBtn}
                  </a>
                  <div className="admin-decision-actions">
                    <button
                      type="button"
                      className="btn btn-accept"
                      disabled={busyId === inq.id}
                      onClick={() => accept(inq)}
                    >
                      {a.acceptBtn}
                    </button>
                    <button
                      type="button"
                      className="btn btn-reject"
                      disabled={busyId === inq.id}
                      onClick={() => openReject(inq.id)}
                    >
                      {a.rejectBtn}
                    </button>
                  </div>
                </>
              ) : (
                <div className="admin-decision-note">
                  <strong>{a.yourReply}</strong> {inq.admin_note || 'N/A'}
                  {inq.responded_at && <em> ({fmtDateTime(inq.responded_at, lang)})</em>}
                </div>
              )}
            </footer>
          )}

          {rejectId === inq.id && inq.status === 'pending' && (
            <form className="admin-reject-panel" onSubmit={(e) => submitReject(e, inq.id)}>
              <label>
                {a.rejectLabel}
                <textarea
                  rows={4}
                  maxLength={NOTE_LIMIT}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={a.rejectPlaceholder}
                  autoFocus
                />
              </label>
              <span className="field-counter">
                {note.length}/{NOTE_LIMIT}
              </span>
              <div className="admin-reject-actions">
                <button type="submit" className="btn btn-reject" disabled={busyId === inq.id}>
                  {busyId === inq.id ? a.sendingShort : a.sendReject}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setRejectId(null)}>
                  {a.cancel}
                </button>
              </div>
            </form>
          )}

          {customPanelId === inq.id ? (
            <form className="admin-custom-panel" onSubmit={(e) => { e.preventDefault(); void sendCustom(inq.id, customMessage); }}>
              <label>
                {a.customLabel}
                <textarea
                  rows={5}
                  maxLength={1000}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder={a.customPlaceholder}
                  autoFocus
                />
              </label>
              <span className="field-counter">{customMessage.length}/1000</span>
              <div className="admin-reject-actions">
                <button type="submit" className="btn btn-accept" disabled={customBusy || !customMessage.trim()}>
                  {customBusy ? a.sendingShort : a.customSendBtn}
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => { setCustomPanelId(null); setCustomMessage(''); }}
                >
                  {a.cancel}
                </button>
              </div>
            </form>
          ) : (
            inq.status === 'accepted' && (
              <div className="admin-card-custom">
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => { setCustomPanelId(inq.id); setCustomMessage(''); }}
                >
                  {a.customOpenBtn}
                </button>
              </div>
            )
          )}
        </article>
      ))}
    </main>
  );
}

/* ==================== Vista: Reseñas ==================== */

function ReviewsView() {
  const { lang, t } = useLang();
  const a = t.admin;
  const [reviews, setReviews] = useState<AdminTestimonial[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [flash, setFlash] = useState('');
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    adminFetchTestimonials()
      .then((rows) => {
        setReviews(rows);
        setLoaded(true);
      })
      .catch((err) => {
        if (!(err instanceof AdminAuthError)) setError(a.errLoadReviews);
        setLoaded(true);
      });
  }, []);

  async function act(fn: () => Promise<unknown>, msg: string, id: number) {
    setBusyId(id);
    setError('');
    try {
      await fn();
      setFlash(msg);
      setReviews(await adminFetchTestimonials());
    } catch (err) {
      if (!(err instanceof AdminAuthError)) setError(a.errReviewAction);
    } finally {
      setBusyId(null);
    }
  }

  const pending = reviews.filter((r) => !r.approved);
  const published = reviews.filter((r) => r.approved);

  function ReviewCard({ r }: { r: AdminTestimonial }) {
    const busy = busyId === r.id;

    function toggle(approved: boolean) {
      void act(
        () => adminSetTestimonialApproved(r.id, approved),
        approved
          ? fill(a.revPublishedFlash, { name: r.author })
          : fill(a.revHiddenFlash, { name: r.author }),
        r.id
      );
    }

    return (
      <article className={`admin-card review-card ${r.approved ? 'status-accepted' : 'status-pending'}`}>
        <div className="review-card-head">
          <span className="review-stars" role="img" aria-label={fill(a.ratingAria, { n: r.rating })}>
            {Array.from({ length: 5 }, (_, i) => (
              <StarIcon key={i} filled={i < r.rating} />
            ))}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={r.approved}
            aria-label={fill(a.reviewToggleAria, { name: r.author })}
            className={`review-switch ${r.approved ? 'is-on' : ''}`}
            disabled={busy}
            onClick={() => toggle(!r.approved)}
          >
            <span className="review-switch-track" aria-hidden="true">
              <span className="review-switch-thumb" />
            </span>
            <span className="review-switch-label">{r.approved ? a.reviewOn : a.reviewOff}</span>
          </button>
        </div>
        <blockquote>“{r.quote}”</blockquote>
        <footer className="review-foot">
          <span className="review-author">
            <span className="review-avatar" aria-hidden="true">
              {r.author.charAt(0).toUpperCase()}
            </span>
            <span className="review-author-info">
              <strong>{r.author}</strong>
              <time>{fmtDateTime(r.created_at, lang)}</time>
            </span>
          </span>
          {!r.approved && (
            <button
              type="button"
              className="btn btn-reject btn-sm"
              disabled={busy}
              onClick={() => {
                if (window.confirm(fill(a.confirmDiscard, { name: r.author }))) {
                  void act(() => adminDeleteTestimonial(r.id), a.revDiscardedFlash, r.id);
                }
              }}
            >
              <TrashIcon />
              {a.discard}
            </button>
          )}
        </footer>
      </article>
    );
  }

  return (
    <main className="admin-container">
      {flash && (
        <p className="admin-flash" role="status">
          ✓ {flash}
        </p>
      )}
      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}
      {!loaded && <p className="admin-empty">{a.loading}</p>}

      {loaded && pending.length > 0 && (
        <>
          <h2 className="admin-section-title">{fill(a.revPendingTitle, { n: pending.length })}</h2>
          {pending.map((r) => (
            <ReviewCard key={r.id} r={r} />
          ))}
        </>
      )}

      {loaded && (
        <>
          <h2 className="admin-section-title">
            {fill(a.revPublishedTitle, { n: published.length })}
          </h2>
          {published.length === 0 && <p className="admin-empty">{a.revEmpty}</p>}
          {published.map((r) => (
            <ReviewCard key={r.id} r={r} />
          ))}
        </>
      )}
    </main>
  );
}

/* ==================== Vista: Fotos ==================== */

function PhotosView() {
  const { t } = useLang();
  const a = t.admin;
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [categoryId, setCategoryId] = useState<number>(0);
  const [alt, setAlt] = useState('');
  const [altEn, setAltEn] = useState('');
  const [uploading, setUploading] = useState(false);
  const [flash, setFlash] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories()
      .then((cats) => {
        setCategories(cats);
        if (cats.length > 0) setCategoryId((cur) => cur || cats[0].id);
      })
      .catch(() => setError(a.errCats));
    fetchPhotos().then(setPhotos).catch(() => undefined);
  }, []);

  function pickFile(f: File | null) {
    setFile(f);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (!f) {
      setPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    const img = new Image();
    img.onload = () => setOrientation(img.naturalWidth >= img.naturalHeight ? 'landscape' : 'portrait');
    img.src = url;
  }

  async function onSubmitUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setFlash('');
    if (!file) {
      setError(a.errPickFile);
      return;
    }
    if (!categoryId) {
      setError(a.errPickCat);
      return;
    }
    if (alt.trim().length < 3) {
      setError(a.errPickAlt);
      return;
    }
    setUploading(true);
    try {
      const prepared = await prepareUploadImage(file);
      const created = await adminUploadPhoto({
        file: prepared.file,
        categoryId,
        alt: alt.trim(),
        altEn: altEn.trim() || alt.trim(),
        orientation,
        width: prepared.width || undefined,
        height: prepared.height || undefined,
      });
      setPhotos((prev) => [...prev, created]);
      setFlash(fill(a.uploadedFlash, { cat: created.category_label }));
      pickFile(null);
      setAlt('');
      setAltEn('');
    } catch (err) {
      if (!(err instanceof AdminAuthError)) {
        setError(err instanceof Error ? err.message : a.errUpload);
      }
    } finally {
      setUploading(false);
    }
  }

  async function removePhoto(p: Photo) {
    if (!window.confirm(fill(a.delConfirm, { cat: p.category_label }))) return;
    setError('');
    try {
      await adminDeletePhoto(p.id);
      setPhotos((prev) => prev.filter((x) => x.id !== p.id));
      setFlash(a.deletedFlash);
    } catch (err) {
      if (!(err instanceof AdminAuthError)) setError(a.errDeletePhoto);
    }
  }

  const grouped = useMemo(() => {
    const map = new Map<number, Photo[]>();
    for (const p of photos) {
      const arr = map.get(p.category_id) ?? [];
      arr.push(p);
      map.set(p.category_id, arr);
    }
    return [...map.entries()];
  }, [photos]);

  return (
    <main className="admin-container">
      {flash && (
        <p className="admin-flash" role="status">
          ✓ {flash}
        </p>
      )}
      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}

      <section className="admin-upload card-panel">
        <h2 className="admin-section-title">{a.uploadTitle}</h2>
        <form onSubmit={onSubmitUpload} className="photo-upload-form">
          <div className="field-row">
            <label className="field">
              <span>{a.categoryLabel}</span>
              <select value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))}>
                {categories.map((c) => (
                  <option key={c.slug} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>{a.orientationLabel}</span>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value as 'portrait' | 'landscape')}
              >
                <option value="portrait">{a.portrait}</option>
                <option value="landscape">{a.landscape}</option>
              </select>
            </label>
          </div>

          <div className="field-row">
            <label className="field">
              <span>{a.descEs}</span>
              <input
                type="text"
                maxLength={80}
                value={alt}
                placeholder={a.phAltEs}
                onChange={(e) => setAlt(e.target.value)}
              />
            </label>
            <label className="field">
              <span>{a.descEn}</span>
              <input
                type="text"
                maxLength={80}
                value={altEn}
                placeholder={a.phAltEn}
                onChange={(e) => setAltEn(e.target.value)}
              />
            </label>
          </div>

          <label className="field">
            <span>{a.fileLabel}</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
            />
          </label>

          {previewUrl && (
            <div className={`upload-preview ${orientation}`}>
              <img src={previewUrl} alt={a.previewAlt} />
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={uploading}>
            {uploading ? a.uploading : a.uploadBtn}
          </button>
        </form>
      </section>

      <h2 className="admin-section-title">{fill(a.galleryTitle, { n: photos.length })}</h2>
      {grouped.map(([catId, items]) => (
        <section key={catId} className="photo-group">
          <h3>{items[0]?.category_label ?? ''}</h3>
          <div className="photo-grid-admin">
            {items.map((p) => (
              <figure key={p.id} className="photo-cell">
                <img src={p.src} alt={p.alt} loading="lazy" />
                <figcaption title={p.alt}>{p.alt}</figcaption>
                <button
                  type="button"
                  className="photo-del"
                  aria-label={fill(a.delAria, { alt: p.alt })}
                  onClick={() => void removePhoto(p)}
                >
                  ✕
                </button>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
