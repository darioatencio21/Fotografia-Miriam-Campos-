import { useEffect, useState } from 'react';
import { useLang } from '../i18n';
import LanguageSwitcher from './LanguageSwitcher';

const LINKS = [
  { href: '#sobre-mi', key: 'about' as const },
  { href: '#servicios', key: 'services' as const },
  { href: '#galeria', key: 'gallery' as const },
];

const MOBILE_LINKS = [
  ...LINKS,
  { href: '/testimonios', key: 'testimonials' as const },
];

export default function Header() {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    return () => document.body.classList.remove('menu-open');
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container header-inner">
          <a className="brand" href="/" onClick={close} aria-label="Miriam Tellez">
            <img src="/images/logo.png" alt="Miriam Tellez" width={480} height={480} />
          </a>
          <nav className="header-nav" aria-label={t.mainNavAria}>
            {LINKS.map((l) => (
              <a key={l.href} href={l.href}>
                {t.nav[l.key]}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <a className="btn btn-primary btn-sm" href="/reservar">
              {t.bookCta}
            </a>
            <LanguageSwitcher />
            <button
              className="menu-toggle"
              aria-expanded={open}
              aria-label={open ? t.closeMenu : t.openMenu}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${open ? 'is-open' : ''}`}>
        <nav aria-label={t.mainNavAria}>
          {MOBILE_LINKS.map((l, i) => (
            <a key={l.href} href={l.href} style={{ transitionDelay: `${80 + i * 60}ms` }} onClick={close}>
              {t.nav[l.key]}
            </a>
          ))}
          <span style={{ transitionDelay: '340ms' }} className="mobile-lang">
            <LanguageSwitcher onSelect={close} />
          </span>
          <a href="/reservar" className="btn btn-primary" style={{ transitionDelay: '400ms' }} onClick={close}>
            {t.bookCta}
          </a>
        </nav>
      </div>
    </>
  );
}
