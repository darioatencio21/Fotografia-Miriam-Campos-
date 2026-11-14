import { useLang } from '../i18n';
import type { Stat } from '../types';
import Reveal from './Reveal';

function CameraIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.05" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M13 23.5h8l2.6-4.5h16.8l2.6 4.5h8a3.5 3.5 0 0 1 3.5 3.5v20a3.5 3.5 0 0 1-3.5 3.5H13a3.5 3.5 0 0 1-3.5-3.5V27a3.5 3.5 0 0 1 3.5-3.5Z" />
      <path d="M22 19.2c.6-2 2.4-3.2 4.4-3.2h11.2c2 0 3.8 1.2 4.4 3.2" />
      <circle cx="32" cy="37.5" r="10.4" />
      <circle cx="32" cy="37.5" r="6.6" />
      <circle cx="32" cy="37.5" r="2.3" />
      <path d="M32 30.9l4.2 6.6M37.6 37.5H30M32 44.1l-4.2-6.6M26.4 37.5H34" opacity=".5" />
      <path d="M47.8 28.2h3.4M49.5 26.5v3.4" />
      <path d="M13 28h4.6M13 31h3.2" opacity=".6" />
      <path d="M23 42.6c3.6 3 8.2 4.6 13 4.6" opacity=".4" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.05" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <circle cx="16.5" cy="29.5" r="4.8" />
      <path d="M7.5 47.5c.4-5.3 4.2-9.4 9-9.4 1.9 0 3.7.7 5.1 1.9" />
      <circle cx="47.5" cy="29.5" r="4.8" />
      <path d="M56.5 47.5c-.4-5.3-4.2-9.4-9-9.4-1.9 0-3.7.7-5.1 1.9" />
      <circle cx="32" cy="24.5" r="6.4" />
      <path d="M20.8 49.5c.3-6.6 5-11.6 11.2-11.6s10.9 5 11.2 11.6" />
      <path d="M26 45.2c3.8 1.8 8.2 1.8 12 0M24.8 48.4c4.6 2 9.8 2 14.4 0" opacity=".4" />
    </svg>
  );
}

function MedalIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.05" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M23 8.5 32 24l9-15.5" />
      <path d="M23 8.5l4.6 1.2L30 13M41 8.5l-4.6 1.2L34 13" opacity=".7" />
      <circle cx="32" cy="39.5" r="13.2" />
      <circle cx="32" cy="39.5" r="9.4" opacity=".55" />
      <path d="M32 31.2l2.4 5 5.5.8-4 3.9.9 5.5-4.8-2.6-4.8 2.6.9-5.5-4-3.9 5.5-.8Z" />
      <path d="M32 23.5v3M32 52.5v3M19.5 39.5h3M41.5 39.5h3" opacity=".5" />
      <path d="M26.8 39.5c1.5 3.2 3.1 5.2 5.2 6.4" opacity=".4" />
    </svg>
  );
}

function VineStar() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true" focusable="false">
      <path d="M12 0l2.1 9.9L24 12l-9.9 2.1L12 24l-2.1-9.9L0 12l9.9-2.1Z" />
    </svg>
  );
}

function Sparkle({ x, y, scale = 1, delay = 0 }: { x: number; y: number; scale?: number; delay?: number }) {
  return (
    <path
      className="flower-sparkle"
      transform={`translate(${x} ${y}) scale(${scale})`}
      d="M0-6C.6-2.2 2.2-.6 6 0 2.2.6.6 2.2 0 6-.6 2.2-2.2.6-6 0-2.2-.6-.6-2.2 0-6Z"
      fill="currentColor"
      stroke="none"
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    />
  );
}

function BotanicalFlower() {
  return (
    <svg
      className="stats-flower"
      viewBox="0 0 90 140"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M58 50C57 72 52 100 44 136" />
      <path d="M56 74C46 73 37 66 32 55 43 56 52 63 56 74Z" />
      <path d="M54 75C46 70 40 63 36 55" opacity=".55" />
      <path d="M52 96C62 94 70 87 73 76 63 78 55 85 52 96Z" />
      <path d="M52 97C60 90 66 84 70 77" opacity=".55" />
      <path d="M48 116C39 114 32 108 28 99 37 100 45 106 48 116Z" />
      <path d="M48 117C41 111 36 106 31 100" opacity=".55" />
      <g transform="translate(57 47)">
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <path key={angle} transform={`rotate(${angle})`} d="M0 0C-5-5-5-12 0-17 5-12 5-5 0 0Z" />
        ))}
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <path
            key={`vein-${angle}`}
            transform={`rotate(${angle})`}
            d="M0-3C-2-7-2-11 0-14 2-11 2-7 0-3Z"
            opacity=".45"
          />
        ))}
        <circle cx="0" cy="0" r="2.6" fill="currentColor" stroke="none" />
        <path d="M0-4v-1.5M0 4v1.5M-4 0h-1.5M4 0h1.5" opacity=".6" />
      </g>
      <Sparkle x={80} y={20} scale={0.8} />
      <Sparkle x={18} y={34} scale={0.55} delay={900} />
      <Sparkle x={86} y={54} scale={0.45} delay={1500} />
      <Sparkle x={24} y={62} scale={0.65} delay={600} />
      <Sparkle x={74} y={86} scale={0.5} delay={2100} />
      <Sparkle x={16} y={104} scale={0.4} delay={1200} />
    </svg>
  );
}

const statIcons = [CameraIcon, PeopleIcon, MedalIcon];

export default function Stats({ items }: { items: Stat[] }) {
  const { lang, t } = useLang();

  if (items.length === 0) return null;

  return (
    <section className="stats-band" aria-label={t.statsBandLabel}>
      <div className="container stats-editorial">
        <div className="stats-decor" aria-hidden="true">
          <div className="stats-vine">
            <svg viewBox="0 0 120 1000" preserveAspectRatio="none" focusable="false">
              <path
                d="M60 0C50 160 70 240 60 380 50 520 70 620 60 760 50 900 68 960 60 1000"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <span className="vine-star vine-star--1"><VineStar /></span>
            <span className="vine-star vine-star--2"><VineStar /></span>
            <span className="vine-star vine-star--3"><VineStar /></span>
          </div>
        </div>

        <div className="stats-list">
          <div className="stats-list-head">
            <p className="stats-eyebrow">{t.statsBandLabel}</p>
          </div>

          <div className="stats-rows">
            {items.map((stat, index) => {
              const Icon = statIcons[index % statIcons.length];
              return (
                <Reveal key={stat.id} className="stat-row" delay={index * 120}>
                  <div className="stat-emblem">
                    <span className="stat-emblem-icon"><Icon /></span>
                  </div>
                  <span className="stat-divider" aria-hidden="true" />
                  <div className="stat-body">
                    <span className="stat-value">{stat.value}</span>
                    <span className="stat-label">
                      {lang === 'es' ? stat.label : stat.label_en}
                    </span>
                    <p className="stat-desc">
                      {lang === 'es' ? stat.description : stat.description_en}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        <BotanicalFlower />
      </div>
    </section>
  );
}
