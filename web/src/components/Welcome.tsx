import { useLang } from '../i18n';
import Reveal from './Reveal';

export default function Welcome() {
  const { t } = useLang();

  return (
    <section className="section welcome" id="bienvenida">
      <div className="container welcome-inner">
        <Reveal>
          <p className="eyebrow">{t.welcome.eyebrow}</p>
        </Reveal>
        <Reveal delay={90}>
          <h2 className="welcome-title">
            {t.welcome.titlePre}
            <em>{t.welcome.titleEm}</em>
          </h2>
        </Reveal>
        <Reveal delay={180}>
          <p className="welcome-text">{t.welcome.text}</p>
        </Reveal>
      </div>
    </section>
  );
}
