import { useLang } from '../i18n';
import type { Stat } from '../types';
import Reveal from './Reveal';

export default function Stats({ items }: { items: Stat[] }) {
  const { lang, t } = useLang();

  if (items.length === 0) return null;
  return (
    <section className="stats-band" aria-label={t.statsBandLabel}>
      <div className="container stats-grid">
        {items.map((s, i) => (
          <Reveal key={s.id} className="stat" delay={i * 100}>
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{lang === 'es' ? s.label : s.label_en}</span>
            <p className="stat-desc">{lang === 'es' ? s.description : s.description_en}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
