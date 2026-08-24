import { useLang } from '../i18n';
import Reveal from './Reveal';

export default function About() {
  const { t } = useLang();

  return (
    <section className="about" id="sobre-mi">
      <div className="about-grid">
        <Reveal className="about-media">
          <img src="/images/miriam-profile.jpg" alt={t.about.portraitAlt} />
        </Reveal>
        <Reveal className="about-copy" delay={120}>
          <p className="eyebrow">{t.about.eyebrow}</p>
          <h2 className="section-title">
            {t.about.titlePre}
            <em>{t.about.titleEm}</em>.
          </h2>
          <div className="about-text">
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>
          </div>
            <a className="btn about-cta" href="/reservar">
            {t.about.cta}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
