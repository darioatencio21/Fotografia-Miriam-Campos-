import { useEffect, useRef, useState } from 'react';
import { useLang } from '../i18n';
import type { Lang } from '../i18n';

const OPTIONS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
];

export default function LanguageSwitcher({ onSelect }: { onSelect?: () => void }) {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={`lang-switcher ${open ? 'is-open' : ''}`}
      role="group"
      aria-label={t.langLabel}
    >
      <button
        type="button"
        className="lang-toggle"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <svg className="lang-globe" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
          <circle cx="10" cy="10" r="7.4" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M2.6 10h14.8M10 2.6c2.3 2 3.5 4.5 3.5 7.4s-1.2 5.4-3.5 7.4c-2.3-2-3.5-4.5-3.5-7.4S7.7 4.6 10 2.6z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        <span className="lang-current">{lang === 'en' ? 'EN' : 'ES'}</span>
        <svg className="lang-chevron" viewBox="0 0 12 8" aria-hidden="true" focusable="false">
          <path
            d="M1 1.5l5 5 5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className={`lang-menu ${open ? 'is-open' : ''}`} role="menu">
        {OPTIONS.map((option) => (
          <button
            key={option.code}
            type="button"
            role="menuitem"
            className={`lang-option ${lang === option.code ? 'is-active' : ''}`}
            aria-current={lang === option.code || undefined}
            onClick={() => {
              setLang(option.code);
              setOpen(false);
              onSelect?.();
            }}
          >
            {option.label}
            {lang === option.code && (
              <svg viewBox="0 0 12 10" aria-hidden="true" focusable="false">
                <path
                  d="M1 5.4L4.4 9 11 1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
