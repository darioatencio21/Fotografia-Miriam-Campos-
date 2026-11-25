import { Fragment, useEffect, useState } from 'react';
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

const SLIDES = [
  image('hero-maternidad', 1280, 854),
  image('hero-familias', 854, 1280),
  image('hero-bodas', 854, 1280),
  image('hero-engagement', 854, 1280),
  image('hero-quinceanera', 854, 1280),
  image('hero-graduaciones', 854, 1280),
];

const ROTATIONS = [
  { left: 0, right: 1, mobile: 2 },
  { left: 2, right: 3, mobile: 0 },
  { left: 4, right: 5, mobile: 1 },
  { left: 3, right: 0, mobile: 4 },
  { left: 1, right: 2, mobile: 5 },
  { left: 5, right: 4, mobile: 3 },
];

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

function HeroLayers({ activeIndex, sizes }: { activeIndex: number; sizes: string }) {
  return (
    <>
      {SLIDES.map((slide, i) => (
        <img
          key={slide.src}
          className={`hero-slide${i === activeIndex ? ' is-active' : ''}`}
          src={slide.src}
          srcSet={slide.srcset}
          sizes={sizes}
          width={slide.width}
          height={slide.height}
          alt=""
          loading={i === activeIndex ? 'eager' : 'lazy'}
          fetchPriority={i === activeIndex ? 'high' : undefined}
        />
      ))}
    </>
  );
}

export default function Hero() {
  const { t } = useLang();
  const isMobile = useMediaQuery('(max-width: 920px)');
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [hidden, setHidden] = useState(() => document.hidden);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    if (reducedMotion || hidden) return;

    const id = window.setInterval(() => {
      setFrame((cur) => (cur + 1) % ROTATIONS.length);
    }, 5200);

    return () => window.clearInterval(id);
  }, [reducedMotion, hidden]);

  const rotation = ROTATIONS[frame];

  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="hero-media" aria-hidden="true">
        {isMobile ? (
          <div className="hero-panel hero-panel--mobile">
            <HeroLayers activeIndex={rotation.mobile} sizes="100vw" />
          </div>
        ) : (
          <>
            <div className="hero-panel hero-panel--maternity">
              <HeroLayers activeIndex={rotation.left} sizes={MATERNITY_SIZES} />
            </div>
            <div className="hero-panel hero-panel--families">
              <HeroLayers activeIndex={rotation.right} sizes={FAMILIES_SIZES} />
            </div>
          </>
        )}
      </div>

      <div className="hero-scrim" aria-hidden="true" />

      <div className="container hero-shell">
        <div className="hero-content">
          <p className="eyebrow hero-eyebrow">{t.hero.eyebrow}</p>
          <h1 className="hero-title" id="hero-title">
            {t.hero.headline.split(' ').map((word, i, words) => (
              <Fragment key={`${t.hero.headline}-${i}`}>
                <span className="hero-title-word" style={{ animationDelay: `${i * 55}ms` }}>
                  {word}
                </span>
                {i < words.length - 1 ? ' ' : null}
              </Fragment>
            ))}
          </h1>
          <div className="hero-detail">
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
      </div>

      <div className="container hero-meta" aria-hidden="true">
        <span>Porterville, CA</span>
        <span className="hero-meta-dot" />
        <span>{t.hero.travel}</span>
      </div>
    </section>
  );
}
