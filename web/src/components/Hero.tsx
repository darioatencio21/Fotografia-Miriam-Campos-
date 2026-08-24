import { useLang } from '../i18n';

export default function Hero() {
  const { t } = useLang();

  return (
    <section className="hero" id="inicio">
      <img className="hero-bg" src="/images/hero.svg" alt="" aria-hidden="true" />
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
        <span>Central Valley, CA</span>
        <span className="hero-meta-dot" />
        <span>{t.hero.travel}</span>
      </div>
    </section>
  );
}
