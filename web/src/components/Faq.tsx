import { useState } from 'react';
import { useLang } from '../i18n';
import Reveal from './Reveal';

function Hummingbird() {
  return (
    <span className="faq-bird" aria-hidden="true">
      <img
        src="/images/decor/colibri-dorado.webp"
        alt=""
        width={720}
        height={686}
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}

export default function Faq() {
  const { t } = useLang();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="section faq" id="faq">
      <div className="container faq-container">
        <Reveal className="section-head faq-head">
          <Hummingbird />
          <p className="eyebrow">{t.faq.eyebrow}</p>
          <h2 className="section-title">
            {t.faq.titlePre} <em>{t.faq.titleEm}</em>
          </h2>
        </Reveal>
        <div className="faq-list">
          {t.faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 60}>
                <div className={`faq-item ${isOpen ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    className="faq-question"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span>{item.q}</span>
                    <span className="faq-icon" aria-hidden="true">
                      <svg viewBox="0 0 16 16" focusable="false">
                        <path d="M2.5 8h11" />
                        <path className="faq-icon-vertical" d="M8 2.5v11" />
                      </svg>
                    </span>
                  </button>
                  <div className="faq-answer" id={`faq-panel-${i}`} role="region">
                    <div className="faq-answer-inner">
                      <p>{item.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
