import { useLang } from '../i18n';

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
            href="mailto:miriamtellezphotography@gmail.com"
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
