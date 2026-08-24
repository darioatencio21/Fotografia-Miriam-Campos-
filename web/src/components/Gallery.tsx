import { useEffect, useState } from 'react';
import type { GalleryCategory, Photo } from '../types';
import { useLang } from '../i18n';
import Reveal from './Reveal';

export default function Gallery({
  photos,
  categories,
}: {
  photos: Photo[];
  categories: GalleryCategory[];
}) {
  const { lang, t } = useLang();
  const [active, setActive] = useState<string>('todas');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const visible =
    active === 'todas' ? photos : photos.filter((p) => p.category_slug === active);

  const chips = categories.map((c) => ({
    slug: c.slug,
    label: lang === 'en' ? c.label_en || c.label : c.label,
  }));

  const captionFor = (p: Photo): string =>
    lang === 'en'
      ? chips.find((c) => c.slug === p.category_slug)?.label ??
        p.category_label_en ??
        p.category_label
      : p.category_label || chips.find((c) => c.slug === p.category_slug)?.label || '';

  const altFor = (p: Photo): string => (lang === 'en' ? p.alt_en || p.alt : p.alt);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowLeft') setLightbox((cur) => (cur === null ? cur : (cur - 1 + visible.length) % visible.length));
      if (e.key === 'ArrowRight') setLightbox((cur) => (cur === null ? cur : (cur + 1) % visible.length));
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox, visible.length]);

  const current = lightbox === null ? null : visible[lightbox];

  return (
    <section className="section gallery" id="galeria">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">{t.gallery.eyebrow}</p>
          <h2 className="section-title">
            {t.gallery.titlePre} <em>{t.gallery.titleEm}</em>
          </h2>
        </Reveal>

        <div className="gallery-filters" role="tablist" aria-label={t.gallery.filtersLabel}>
          {chips.map((c) => (
            <button
              key={c.slug}
              role="tab"
              aria-selected={active === c.slug}
              className={`chip ${active === c.slug ? 'is-active' : ''}`}
              onClick={() => setActive(c.slug)}
            >
              {c.label}
            </button>
          ))}
        </div>

        {visible.length > 0 ? (
          <div className="masonry" key={active}>
            {visible.map((p, i) => (
              <figure
                key={p.id}
                className={`masonry-item ${p.orientation}`}
                style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}
                onClick={() => setLightbox(i)}
              >
                <img
                  src={p.src}
                  alt={altFor(p)}
                  loading="lazy"
                  decoding="async"
                  width={p.width ?? undefined}
                  height={p.height ?? undefined}
                />
                <figcaption>{captionFor(p)}</figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <p className="gallery-empty">{t.gallery.empty}</p>
        )}
      </div>

      {current && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={altFor(current)}
          onClick={() => setLightbox(null)}
        >
          <button type="button" className="lightbox-close" aria-label={t.gallery.close}>
            ✕
          </button>
          <figure className="lightbox-figure" onClick={(e) => e.stopPropagation()}>
            <img src={current.src} alt={altFor(current)} />
            <figcaption>
              <span>{captionFor(current)}</span>
              <span className="lightbox-count">
                {(lightbox ?? 0) + 1} / {visible.length}
              </span>
            </figcaption>
          </figure>
          {visible.length > 1 && (
            <>
              <button
                type="button"
                className="lightbox-nav lightbox-prev"
                aria-label={t.gallery.prev}
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox(((lightbox ?? 0) - 1 + visible.length) % visible.length);
                }}
              >
                ‹
              </button>
              <button
                type="button"
                className="lightbox-nav lightbox-next"
                aria-label={t.gallery.next}
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox(((lightbox ?? 0) + 1) % visible.length);
                }}
              >
                ›
              </button>
            </>
          )}
        </div>
      )}
    </section>
  );
}
