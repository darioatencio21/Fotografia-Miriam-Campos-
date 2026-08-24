import { useLang } from '../i18n';
import { WHATSAPP_NUMBER } from './WhatsAppButton';

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.3" cy="6.7" r="1.35" fill="currentColor" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M16 4C9.9 4 5 8.9 5 15c0 2.4.7 4.6 2.1 6.4L5.5 27l5.8-1.5c1.5.8 3 1.2 4.7 1.2 6.1 0 11-4.9 11-11S22.1 4 16 4zm0 20c-1.6 0-3-.4-4.3-1.1l-.3-.2-3.4.9.9-3.3-.2-.3C7.7 18.7 7 17 7 15c0-5 4-9 9-9s9 4 9 9-4 9-9 9zm5-6.7c-.3-.1-1.6-.8-1.9-.9-.3-.1-.5-.2-.7.2-.2.3-.7 1-.9 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.6c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.6l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1.1 1-1.1 2.5s1.1 3 1.2 3.2c.2.2 2.2 3.3 5.3 4.6.7.3 1.3.5 1.8.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect
        x="3"
        y="5.5"
        width="18"
        height="13"
        rx="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M4.8 7.6L12 13l7.2-5.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();
  const rights = t.footer.rightsTemplate.replace('{year}', String(year));
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}`;

  return (
    <footer className="site-footer">
      <div className="container footer-cta">
        <p className="eyebrow eyebrow-light">{t.footer.eyebrow}</p>
        <p className="footer-big serif-italic">
          {t.footer.bigA}
          <br />
          {t.footer.bigB}
        </p>
        <a className="btn btn-light" href="/reservar">
          {t.bookCta}
        </a>
      </div>

      <a
        className="footer-ig"
        href="https://www.instagram.com/miriamtellezphotography/"
        target="_blank"
        rel="noreferrer"
      >
        <span className="footer-ig-eyebrow">{t.footer.igEyebrow}</span>
        <span className="footer-ig-handle">
          <InstagramIcon />
          @miriamtellezphotography
        </span>
      </a>

      <div className="container footer-main">
        <div className="footer-brandline">
          <a className="brand brand-logo-footer" href="/" aria-label="Miriam Tellez">
            <img src="/images/logo.png" alt="" width={480} height={480} loading="lazy" />
          </a>
          <nav className="footer-nav-inline" aria-label={t.footer.navigate}>
            <a href="#sobre-mi">{t.nav.about}</a>
            <a href="#servicios">{t.nav.services}</a>
            <a href="#galeria">{t.nav.gallery}</a>
            <a href="/testimonios">{t.nav.testimonials}</a>
          </nav>
        </div>
        <div className="footer-social">
          <a
            className="social-dot"
            href="https://www.instagram.com/miriamtellezphotography/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram · @miriamtellezphotography"
            title="Instagram · @miriamtellezphotography"
          >
            <InstagramIcon />
          </a>
          <a
            className="social-dot"
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.whatsappAria}
            title={t.whatsappAria}
          >
            <WhatsAppIcon />
          </a>
          <a
            className="social-dot"
            href="mailto:hola@miriamtellez.photo"
            aria-label={t.contact.email}
            title={t.contact.email}
          >
            <MailIcon />
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>© {rights}</span>
          <span className="serif-italic">{t.footer.madeWith}</span>
        </div>
      </div>
    </footer>
  );
}
