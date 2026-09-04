import { useEffect, useState } from 'react';
import { useLang } from '../i18n';

interface SlideImage {
  src: string;
  srcset: string;
  alt_en: string;
  alt_es: string;
}

const slide = (base: string, alt_en: string, alt_es: string): SlideImage => ({
  src: `/images/hero/${base}.webp`,
  srcset: `/images/hero/${base}-640.webp 640w, /images/hero/${base}.webp 854w`,
  alt_en,
  alt_es,
});

const SLIDES = [
  {
    left: slide('hero-maternidad', 'Maternity session at golden hour', 'Sesión de maternidad en hora dorada'),
    right: slide('hero-familias', 'Family photography outdoors', 'Fotografía familiar al aire libre'),
  },
  {
    left: slide('hero-bodas', 'Wedding photography', 'Fotografía de bodas'),
    right: slide('hero-quinceanera', 'Quinceañera portrait session', 'Sesión de quinceañera'),
  },
  {
    left: slide('hero-graduaciones', 'Graduation photos', 'Fotos de graduación'),
    right: slide('hero-engagement', 'Engagement session', 'Sesión de compromiso'),
  },
];

const INTERVAL = 5000;
const SIZES = '(min-width: 768px) 50vw, 100vw';

export default function Hero() {
  const { lang, t } = useLang();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, INTERVAL);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="hero" id="inicio">
      {SLIDES.map((slide, i) => (
        <div key={i} className={`hero-slide${i === active ? ' active' : ''}`}>
          <img
            className="hero-slide-left"
            src={slide.left.src}
            srcSet={slide.left.srcset}
            sizes={SIZES}
            alt={lang === 'en' ? slide.left.alt_en : slide.left.alt_es}
            aria-hidden="true"
            fetchPriority={i === 0 ? 'high' : 'auto'}
          />
          <img
            className="hero-slide-right"
            src={slide.right.src}
            srcSet={slide.right.srcset}
            sizes={SIZES}
            alt={lang === 'en' ? slide.right.alt_en : slide.right.alt_es}
            aria-hidden="true"
            fetchPriority={i === 0 ? 'high' : 'auto'}
          />
        </div>
      ))}
      <div className="hero-glow" aria-hidden="true" />
      <div className="container hero-content">
        <p className="eyebrow hero-eyebrow">{t.hero.eyebrow}</p>
        <h1 className="hero-title">
          <span className="serif-italic">{t.hero.titleItalic}</span>
          <span className="hero-title-main">{t.hero.titleMain}</span>
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
      <div className="hero-meta container" aria-hidden="true">
        <span>Porterville, CA</span>
        <span className="hero-meta-dot" />
        <span>{t.hero.travel}</span>
      </div>
    </section>
  );
}
