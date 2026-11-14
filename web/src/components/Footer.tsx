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
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" strokeWidth="1.6" />
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
        strokeWidth="1.6"
      />
      <path
        d="M4.8 7.6L12 13l7.2-5.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path
        d="M2 8h11M9 3.5L13.5 8 9 12.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FooterHummingbird() {
  return (
    <img
      className="footer-art-img"
      src="/images/decor/colibri-dorado.webp"
      alt=""
      width={720}
      height={686}
      loading="lazy"
      decoding="async"
      aria-hidden="true"
    />
  );
}

function MountainLayer() {
  return (
    <img
      className="footer-mountains"
      src="/images/decor/montanas-doradas.webp"
      alt=""
      width={1280}
      height={427}
      loading="lazy"
      decoding="async"
      aria-hidden="true"
    />
  );
}

export default function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();
  const rights = t.footer.rightsTemplate.replace('{year}', String(year));
  const isSubpage = window.location.pathname.replace(/\/+$/, '') !== '';
  const prefix = isSubpage ? '/' : '';

  return (
    <footer className="site-footer">
      <div className="footer-editorial">
        <MountainLayer />

        <div className="container footer-cta-grid">
          <div className="footer-art">
            <FooterHummingbird />
          </div>

          <div className="footer-message">
            <p className="footer-label">{t.footer.eyebrow}</p>
            <p className="footer-headline">
              <span>{t.footer.bigA}</span>
              <em>{t.footer.bigB}</em>
            </p>
            <a className="footer-book" href="/reservar">
              {t.bookCta}
              <ArrowIcon />
            </a>
          </div>

          <div className="footer-social-col">
            <p className="footer-label">{t.footer.igEyebrow}</p>
            <a
              className="footer-handle"
              href="https://www.instagram.com/miriamtellezphotography/"
              target="_blank"
              rel="noreferrer"
            >
              <InstagramIcon />
              <span>@miriamtellezphotography</span>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-nav-wrap">
        <div className="container footer-nav-row">
          <div className="footer-brandline">
            <a className="footer-logo" href="/" aria-label="Miriam Tellez">
              <img
                src="/images/logo.webp"
                alt=""
                width={480}
                height={480}
                loading="lazy"
                decoding="async"
              />
            </a>
            <span className="footer-vline" aria-hidden="true" />
            <nav className="footer-nav-inline" aria-label={t.footer.navigate}>
              <a href={`${prefix}#sobre-mi`}>{t.nav.about}</a>
              <a href={`${prefix}#servicios`}>{t.nav.services}</a>
              <a href={`${prefix}#galeria`}>{t.nav.gallery}</a>
              <a href="/testimonios">{t.nav.testimonials}</a>
            </nav>
          </div>

          <div className="footer-social">
            <a
              className="social-dot"
              href="https://www.instagram.com/miriamtellezphotography/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram Â· @miriamtellezphotography"
              title="Instagram Â· @miriamtellezphotography"
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
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>Â© {rights}</span>
          <span className="footer-made">{t.footer.madeWith}</span>
        </div>
      </div>
    </footer>
  );
}
