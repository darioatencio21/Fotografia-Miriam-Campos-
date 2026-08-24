export default function Horizon() {
  return (
    <div className="horizon" aria-hidden="true">
      <span className="horizon-line" />
      <svg className="horizon-sun" width="64" height="30" viewBox="0 0 64 30">
        <path d="M6 29a26 26 0 0 1 52 0" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="0" y1="29" x2="16" y2="29" stroke="currentColor" strokeWidth="2" />
        <line x1="22" y1="29" x2="42" y2="29" stroke="currentColor" strokeWidth="2" />
        <line x1="48" y1="29" x2="64" y2="29" stroke="currentColor" strokeWidth="2" />
      </svg>
      <span className="horizon-line" />
    </div>
  );
}
