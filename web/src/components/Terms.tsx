import { useLang } from '../i18n';
import Reveal from './Reveal';

export default function Terms() {
  const { t } = useLang();

  return (
    <section className="section terms-page" id="terminos">
      <div className="container terms-container">
        <Reveal>
          <h1 className="section-title">{t.terms.title}</h1>
          <p className="terms-intro">{t.terms.intro}</p>
        </Reveal>

        <Reveal delay={100}>
          <div className="terms-body">
            <h2>{t.terms.s1Title}</h2>
            <p>{t.terms.s1}</p>

            <h2>{t.terms.s2Title}</h2>
            <p>{t.terms.s2}</p>

            <h2>{t.terms.s3Title}</h2>
            <p>{t.terms.s3}</p>

            <h2>{t.terms.s4Title}</h2>
            <p>{t.terms.s4}</p>

            <h2>{t.terms.s5Title}</h2>
            <p>{t.terms.s5}</p>

            <h2>{t.terms.s6Title}</h2>
            <p>{t.terms.s6}</p>

            <h2>{t.terms.s7Title}</h2>
            <p>{t.terms.s7}</p>

            <h2>{t.terms.s8Title}</h2>
            <p>{t.terms.s8}</p>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <a className="btn btn-outline terms-back" href="/reservar">
            {t.terms.back}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
