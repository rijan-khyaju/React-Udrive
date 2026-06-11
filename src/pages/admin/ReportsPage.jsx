import { reportCards } from '../../data/adminData';

const charts = [
  { title: 'Student Registrations', value: 78, color: 'var(--blue)' },
  { title: 'Monthly Bookings', value: 62, color: 'var(--teal)' },
  { title: 'Revenue', value: 54, color: 'var(--purple)' },
];

export default function ReportsPage() {
  return (
    <section className="page-section">
      <div className="section-grid stats-grid">
        {reportCards.map((card) => (
          <article key={card.label} className="stat-card report-stat">
            <p className="stat-label">{card.label}</p>
            <h3>{card.value}</h3>
            <span className="stat-delta">{card.change}</span>
          </article>
        ))}
      </div>

      <div className="section-grid report-grid">
        {charts.map((chart) => (
          <div key={chart.title} className="panel-card report-card">
            <div className="panel-header">
              <h3>{chart.title}</h3>
            </div>
            <div className="chart-bar">
              <div className="chart-bar-track">
                <div className="chart-bar-fill" style={{ width: `${chart.value}%`, background: chart.color }} />
              </div>
              <span>{chart.value}%</span>
            </div>
            <div className="chart-caption">Performance trend is strong and ready for the next period.</div>
          </div>
        ))}
      </div>
    </section>
  );
}
