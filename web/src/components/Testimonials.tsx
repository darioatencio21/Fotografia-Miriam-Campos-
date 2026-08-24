import type { Testimonial } from '../types';
import { useLang } from '../i18n';
import Reveal from './Reveal';
import ReviewForm from './ReviewForm';

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const { lang, t } = useLang();
  if (testimonials.length === 0) return null;

  const starsLabel = (count: number) => t.testimonials.starsAria.replace('{n}', String(count));

  return (
    <section className="section testimonials" id="testimonios">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">{t.testimonials.eyebrow}</p>
          <h2 className="section-title">
            {t.testimonials.titlePre} <em>{t.testimonials.titleEm}</em>
          </h2>
        </Reveal>
        <div className="testimonial-list">
          {testimonials.map((item, i) => (
            <Reveal key={item.id} delay={i * 100}>
              <blockquote className="testimonial">
                <span className="stars" aria-label={starsLabel(item.rating)}>
                  {'★'.repeat(item.rating)}
                </span>
                <p className="testimonial-quote">
                  “{lang === 'en' ? item.quote_en || item.quote : item.quote}”
                </p>
                <footer>
                  <span className="testimonial-author">{item.author}</span>
                  <span className="testimonial-type">
                    {lang === 'en' ? item.session_type_en : item.session_type}
                  </span>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
        <ReviewForm />
      </div>
    </section>
  );
}
