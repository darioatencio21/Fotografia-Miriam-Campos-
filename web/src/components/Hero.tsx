import { useEffect, useState } from 'react';
import { useLang } from '../i18n';

const SLIDES = [
  {
    left: { src: '/images/hero/hero-maternidad.jpg', alt_en: 'Maternity session at golden hour', alt_es: 'Sesión de maternidad en hora dorada' },
    right: { src: '/images/hero/hero-familias.jpg', alt_en: 'Family photography outdoors', alt_es: 'Fotografía familiar al aire libre' },
  },
  {
    left: { src: '/images/hero/hero-bodas.jpg', alt_en: 'Wedding photography', alt_es: 'Fotografía de bodas' },
    right: { src: '/images/hero/hero-quinceanera.jpg', alt_en: 'Quinceañera portrait session', alt_es: 'Sesión de quinceañera' },
  },
  {
    left: { src: '/images/hero/hero-graduaciones.jpg', alt_en: 'Graduation photos', alt_es: 'Fotos de graduación' },
    right: { src: '/images/hero/hero-engagement.jpg', alt_en: 'Engagement session', alt_es: 'Sesión de compromiso' },
  },
];

const INTERVAL = 5000;

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
            alt={lang === 'en' ? slide.left.alt_en : slide.left.alt_es}
            aria-hidden="true"
          />
          <img
            className="hero-slide-right"
            src={slide.right.src}
            alt={lang === 'en' ? slide.right.alt_en : slide.right.alt_es}
            aria-hidden="true"
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
