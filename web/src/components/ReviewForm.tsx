import { useState } from 'react';
import type { FormEvent } from 'react';
import { useLang } from '../i18n';
import { submitTestimonial } from '../lib/api';

const QUOTE_MAX = 300;

export default function ReviewForm() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [quote, setQuote] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [sending, setSending] = useState(false);

  const quoteLeft = QUOTE_MAX - quote.length;
  const quotePct = Math.min(100, Math.round((quote.length / QUOTE_MAX) * 100));

  if (!open) {
    return (
      <div className="review-toggle-wrap">
        <button type="button" className="btn btn-outline" onClick={() => setOpen(true)}>
          ✎ {t.review.toggleOpen}
        </button>
      </div>
    );
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs: string[] = [];
    const name = author.trim().replace(/\s+/g, ' ');
    const text = quote.trim();
    if (name.length < 2 || name.length > 30) errs.push(t.review.errAuthor);
    if (text.length < 15 || text.length > 300) errs.push(t.review.errQuote);
    if (rating < 1 || rating > 5) errs.push(t.review.errRating);
    setErrors(errs);
    if (errs.length > 0) return;

    setSending(true);
    submitTestimonial({ author: name, rating, quote: text })
      .then(() => setSent(true))
      .catch(() => setErrors([t.review.genericError]))
      .finally(() => setSending(false));
  }

  if (sent) {
    return (
      <div className="review-form review-thanks" role="status">
        <h3>✨ {t.review.thanksTitle}</h3>
        <p>{t.review.thanksText}</p>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => {
            setSent(false);
            setOpen(false);
            setAuthor('');
            setQuote('');
            setRating(5);
          }}
        >
          {t.review.anotherReview}
        </button>
      </div>
    );
  }

  return (
    <form className="review-form" onSubmit={onSubmit} noValidate>
      <p className="review-intro">{t.review.formIntro}</p>

      <label className="field">
        <span>{t.review.yourName}</span>
        <input
          type="text"
          maxLength={30}
          value={author}
          placeholder={t.review.namePlaceholder}
          onChange={(e) => setAuthor(e.target.value)}
          autoComplete="name"
        />
      </label>

      <fieldset className="field review-rating">
        <legend>{t.review.ratingLabel}</legend>
        <div role="radiogroup" aria-label={t.review.ratingLabel}>
          {[5, 4, 3, 2, 1].map((n) => (
            <label key={n} className={`star-option ${rating >= n ? 'is-on' : ''}`}>
              <input
                type="radio"
                name="rating"
                value={n}
                checked={rating === n}
                onChange={() => setRating(n)}
              />
              ★
            </label>
          ))}
        </div>
      </fieldset>

      <label className="field">
        <span>{t.review.yourQuote}</span>
        <textarea
          rows={4}
          maxLength={QUOTE_MAX}
          value={quote}
          placeholder={t.review.quotePlaceholder}
          onChange={(e) => setQuote(e.target.value)}
        />
        <span
          className={`quote-meter${quote.length > 0 ? ' is-active' : ''}`}
          aria-hidden="true"
        >
          <span
            className={`quote-meter-fill${quotePct > 90 ? ' is-full' : quotePct > 60 ? ' is-warm' : ''}`}
            style={{ width: `${quotePct}%` }}
          />
        </span>
        <span
          className={`field-counter${quoteLeft <= 60 ? ' is-active' : ''}${
            quoteLeft <= 20 ? ' is-warning' : ''
          }`}
          aria-hidden="true"
        >
          {quoteLeft <= 60 ? quoteLeft : ''}
        </span>
      </label>

      {errors.length > 0 && (
        <ul className="form-errors" role="alert">
          {errors.map((msg) => (
            <li key={msg}>{msg}</li>
          ))}
        </ul>
      )}

      <button className="btn btn-primary" type="submit" disabled={sending}>
        {sending ? t.review.sendingReview : t.review.submitReview}
      </button>
    </form>
  );
}
