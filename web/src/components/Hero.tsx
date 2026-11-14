import { useEffect, useState } from 'react';
import { useLang } from '../i18n';

interface HeroImage {
  src: string;
  srcset: string;
  width: number;
  height: number;
}

const image = (base: string, width: number, height: number): HeroImage => ({
  src: `/images/hero/${base}.webp`,
  srcset: `/images/hero/${base}-640.webp 640w, /images/hero/${base}.webp ${width}w`,
  width,
  height,
});

const MATERNITY = image('hero-maternidad', 1280, 854);
const FAMILIES = image('hero-familias', 854, 1280);
const WEDDING = image('hero-bodas', 854, 1280);

const MATERNITY_SIZES = '(min-width: 921px) 52vw, 100vw';
const FAMILIES_SIZES = '(min-width: 921px) 48vw, 100vw';

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export default function Hero() {
  const { t } = useLang();
  const isMobile = useMediaQuery('(max-width: 920px)');

  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="hero-media" aria-hidden="true">
        {isMobile ? (
          <div className="hero-panel hero-panel--mobile">
            <img
              src={WEDDING.src}
              srcSet={WEDDING.srcset}
              sizes="100vw"
              width={WEDDING.width}
              height={WEDDING.height}
              alt=""
              fetchPriority="high"
            />
          </div>
        ) : (
          <>
            <div className="hero-panel hero-panel--maternity">
              <img
                src={MATERNITY.src}
                srcSet={MATERNITY.srcset}
                sizes={MATERNITY_SIZES}
                width={MATERNITY.width}
                height={MATERNITY.height}
                alt=""
                fetchPriority="high"
              />
            </div>
            <div className="hero-panel hero-panel--families">
              <img
                src={FAMILIES.src}
                srcSet={FAMILIES.srcset}
                sizes={FAMILIES_SIZES}
                width={FAMILIES.width}
                height={FAMILIES.height}
                alt=""
                fetchPriority="high"
              />
            </div>
          </>
        )}
      </div>

      <div className="hero-scrim" aria-hidden="true" />

      <div className="container hero-shell">
        <div className="hero-content">
          <p className="eyebrow hero-eyebrow">{t.hero.eyebrow}</p>
          <h1
            className="hero-title"
            id="hero-title"
            aria-label={`${t.hero.titleItalic} ${t.hero.titleMain}`}
          >
            <span className="hero-intro" aria-hidden="true">
              {t.hero.titleItalic}
            </span>
            <span className="hero-title-line1" aria-hidden="true">
              {t.hero.titleLine1}
            </span>
            <span className="hero-title-line2" aria-hidden="true">
              {t.hero.titleLine2}
            </span>
          </h1>
          <p className="hero-sub">{t.hero.sub}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/reservar">
              {t.bookCta}
            </a>
            <a className="btn btn-ghost" href="#galeria">
              {t.hero.viewGallery}
            </a>
          </div>
        </div>
      </div>

      <div className="container hero-meta" aria-hidden="true">
        <span>Porterville, CA</span>
        <span className="hero-meta-dot" />
        <span>{t.hero.travel}</span>
      </div>
    </section>
  );
}
