import type { Service } from '../types';
import { useLang } from '../i18n';
import Reveal from './Reveal';

const price = (n: number) => `$${n.toLocaleString('es-MX')}`;

export default function Services({
  services,
  limit,
}: {
  services: Service[];
  limit?: number;
}) {
  const { lang, t } = useLang();
  if (services.length === 0) return null;

  const shown = limit ? services.slice(0, limit) : services;

  return (
    <section className="section services" id="servicios">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">{t.services.eyebrow}</p>
          <h2 className="section-title">
            {t.services.titlePre} <em>{t.services.titleEm}</em>
          </h2>
        </Reveal>
        <div className="services-grid">
          {shown.map((s, i) => {
            const title = lang === 'en' ? s.title_en : s.title;
            const deliverables = s.deliverables?.[lang] ?? [];
            return (
              <Reveal key={s.id} delay={(i % 2) * 120}>
                <article className="service-card">
                  <div className="service-media">
                    <img src={s.image_url} alt={title} loading="lazy" />
                    <span className="service-price-chip">
                      {t.services.priceFrom} {price(s.price_from)}
                    </span>
                  </div>
                  <div className="service-body">
                    <p className="service-tagline serif-italic">
                      {lang === 'en' ? s.tagline_en : s.tagline}
                    </p>
                    <h3>{title}</h3>
                    <p className="service-desc">
                      {lang === 'en' ? s.description_en : s.description}
                    </p>
                    <ul className="service-meta" aria-label={t.services.eyebrow}>
                      <li>{lang === 'en' ? s.duration_en : s.duration}</li>
                      <li>{lang === 'en' ? s.location_note_en : s.location_note}</li>
                    </ul>
                    <ul className="service-includes">
                      {deliverables.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                    {(s.slug === 'maternidad' || s.slug === 'bodas') && (
                      <p className="service-scarcity">
                        <span className="service-scarcity-dot" aria-hidden="true" />
                        {t.services.scarcity}
                      </p>
                    )}
                    <a
                      className="btn btn-outline service-cta"
                      href={`/reservar?servicio=${s.slug}`}
                    >
                      {t.services.book} · {title}
                    </a>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        {limit && services.length > limit && (
          <div className="services-more">
            <a className="btn btn-primary" href="/servicios">
              {t.services.viewAll}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
