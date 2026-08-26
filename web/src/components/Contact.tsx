import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { Service } from '../types';
import { useLang } from '../i18n';
import { fetchAvailability, sendInquiry } from '../lib/api';
import Reveal from './Reveal';

type Status = 'idle' | 'sending' | 'success' | 'error';

const LIMITS = { name: 25, email: 30, phone: 15, message: 150 };
const initialForm = {
  name: '',
  email: '',
  phone: '',
  sessionType: '',
  eventDate: '',
  message: '',
  website: '',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function isValidUSPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 10) return /^[2-9]/.test(digits);
  if (digits.length === 11) return digits[0] === '1' && /^[2-9]/.test(digits.slice(1));
  return false;
}

export default function Contact({ services }: { services: Service[] }) {
  const { lang, t } = useLang();
  const [form, setForm] = useState(() => ({
    ...initialForm,
    sessionType: new URLSearchParams(window.location.search).get('servicio') ?? '',
  }));
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<string[]>([]);
  const [serverError, setServerError] = useState(false);
  const [bookedDates, setBookedDates] = useState<string[]>([]);

  const serviceTitle = (slug: string) => {
    const s = services.find((sv) => sv.slug === slug);
    if (!s) return '';
    return lang === 'en' ? s.title_en : s.title;
  };

  const messageLeft = Math.max(LIMITS.message - form.message.length, 0);

  useEffect(() => {
    let active = true;
    fetchAvailability().then((dates) => {
      if (active) setBookedDates(dates);
    });
    return () => {
      active = false;
    };
  }, []);

  const update =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  function validate(): string[] {
    const errs: string[] = [];
    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const message = form.message.trim();

    if (name.length < 2 || name.length > LIMITS.name) errs.push(t.contact.errName);
    if (!EMAIL_RE.test(email) || email.length > LIMITS.email) errs.push(t.contact.errEmail);
    if (phone && !isValidUSPhone(phone)) errs.push(t.contact.errPhone);
    if (!form.sessionType) errs.push(t.contact.errSession);
    if (message.length < 10 || message.length > LIMITS.message) errs.push(t.contact.errMessage);
    return errs;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setServerError(false);
    if (errs.length > 0) return;

    setStatus('sending');
    try {
      await sendInquiry({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        sessionType:
          form.sessionType === 'other'
            ? t.contact.other
            : serviceTitle(form.sessionType) || form.sessionType,
        eventDate: form.eventDate || undefined,
        message: form.message.trim(),
        lang,
        website: form.website,
      });
      setStatus('success');
      setForm(initialForm);
    } catch {
      setStatus('error');
      setServerError(true);
    }
  }

  return (
    <section className="section contact" id="contacto">
      <div className="container contact-grid">
        <div className="contact-copy">
          <Reveal>
            <p className="eyebrow">{t.contact.eyebrow}</p>
            <h2 className="section-title">
              {t.contact.titlePre}
              <em>{t.contact.titleEm}</em>
              {t.contact.titleEnd}
            </h2>
            <p>{t.contact.intro}</p>
          </Reveal>
          <Reveal delay={120}>
            <ul className="contact-info">
              <li>
                <span className="contact-info-label">{t.contact.email}</span>
                <a href="mailto:miriamtellezphotography@gmail.com">miriamtellezphotography@gmail.com</a>
              </li>
              <li>
                <span className="contact-info-label">{t.contact.phone}</span>
                <a href="tel:+15551234567">+1 (555) 123-4567</a>
              </li>
              <li>
                <span className="contact-info-label">{t.contact.area}</span>
                <span>{t.contact.areaValue}</span>
              </li>
            </ul>
          </Reveal>
        </div>

        <Reveal className="contact-form-wrap" delay={150}>
          {status === 'success' ? (
            <div className="form-success" role="status">
              <span className="form-success-icon" aria-hidden="true">
                ☀
              </span>
              <h3>{t.contact.successTitle}</h3>
              <p>{t.contact.successText}</p>
              <button className="btn btn-outline" onClick={() => setStatus('idle')}>
                {t.contact.sendAnother}
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={onSubmit} noValidate>
              <div className="field-row">
                <label className="field">
                  <span>{t.contact.name}</span>
                  <input
                    type="text"
                    maxLength={LIMITS.name}
                    value={form.name}
                    onChange={update('name')}
                    placeholder={t.contact.namePlaceholder}
                    autoComplete="name"
                  />
                </label>
                <label className="field">
                  <span>{t.contact.emailField}</span>
                  <input
                    type="email"
                    maxLength={LIMITS.email}
                    value={form.email}
                    onChange={update('email')}
                    placeholder={t.contact.emailPlaceholder}
                    autoComplete="email"
                  />
                </label>
              </div>

              <div className="field-row">
                <label className="field">
                  <span>{t.contact.phoneField}</span>
                  <input
                    type="tel"
                    maxLength={LIMITS.phone}
                    value={form.phone}
                    onChange={update('phone')}
                    placeholder={t.contact.phonePlaceholder}
                    autoComplete="tel"
                  />
                </label>
                <label className="field">
                  <span>{t.contact.date}</span>
                  <input
                    type="date"
                    min={new Date().toISOString().slice(0, 10)}
                    value={form.eventDate}
                    onChange={update('eventDate')}
                  />
                  {form.eventDate && bookedDates.includes(form.eventDate) && (
                    <span className="field-warning">⚠ {t.contact.dateTaken}</span>
                  )}
                </label>
              </div>

              <label className="field">
                <span>{t.contact.sessionType}</span>
                <select value={form.sessionType} onChange={update('sessionType')}>
                  <option value="" disabled>
                    {t.contact.chooseOption}
                  </option>
                  {services.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {lang === 'en' ? s.title_en : s.title}
                    </option>
                  ))}
                  <option value="other">{t.contact.other}</option>
                </select>
              </label>

              <label className="field">
                <span>{t.contact.message}</span>
                <textarea
                  rows={5}
                  maxLength={LIMITS.message}
                  value={form.message}
                  onChange={update('message')}
                  placeholder={t.contact.messagePlaceholder}
                />
                <span
                  className={`field-counter${messageLeft <= 20 ? ' is-active' : ''}${
                    messageLeft <= 10 ? ' is-warning' : ''
                  }`}
                  aria-hidden="true"
                >
                  {messageLeft <= 20 ? messageLeft : ''}
                </span>
              </label>

              {errors.length > 0 && (
                <ul className="form-error" role="alert">
                  {errors.map((err) => (
                    <li key={err}>{err}</li>
                  ))}
                </ul>
              )}
              {serverError && (
                <p className="form-error" role="alert">
                  {t.contact.genericError}
                </p>
              )}

              <label className="hp-field" aria-hidden="true">
                <span>Website</span>
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={update('website')}
                />
              </label>

              <button
                className="btn btn-primary btn-block"
                type="submit"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? t.contact.sending : t.contact.submit}
              </button>
              <p className="form-note">{t.contact.replyNote}</p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
