import { useEffect, useState } from 'react';
import { useLang } from '../i18n';
import LanguageSwitcher from './LanguageSwitcher';

const BASE_LINKS = [
  { hash: '#sobre-mi', key: 'about' as const },
  { hash: '#servicios', key: 'services' as const },
  { hash: '#galeria', key: 'gallery' as const },
];

export default function Header() {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const isSubpage = window.location.pathname.replace(/\/+$/, '') !== '';

  const links = BASE_LINKS.map((l) => ({
    href: isSubpage ? `/${l.hash}` : l.hash,
    key: l.key,
  }));

  const mobileLinks = [
    ...links,
    { href: '/testimonios', key: 'testimonials' as const },
  ];

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
            <img src="/images/logo.webp" alt="Miriam Tellez" width={480} height={480} fetchPriority="high" />
          </a>
          <nav className="header-nav" aria-label={t.mainNavAria}>
            {links.map((l) => (
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
          {mobileLinks.map((l, i) => (
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
