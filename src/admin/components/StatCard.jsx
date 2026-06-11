export default function StatCard({ icon, label, value, delta, onClick }) {
  const handleKeyDown = (event) => {
    if (!onClick) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <article
      className={`stat-card${onClick ? ' stat-card-clickable' : ''}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="stat-card-head">
        <span className="stat-card-icon">{icon}</span>
        <span className="stat-card-delta">{delta}</span>
      </div>
      <h2>{value}</h2>
      <p>{label}</p>
    </article>
  );
}
