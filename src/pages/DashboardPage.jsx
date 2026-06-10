const lessons = [
  { day: '14', month: 'Jun', type: 'Basic Driving — Session 3', instructor: 'Instructor: Ram Bahadur', status: 'confirmed' },
  { day: '16', month: 'Jun', type: 'Theory Class — Traffic Rules', instructor: 'Instructor: Sita Devi', status: 'confirmed' },
  { day: '19', month: 'Jun', type: 'Basic Driving — Session 4', instructor: 'Instructor: Ram Bahadur', status: 'pending' },
  { day: '21', month: 'Jun', type: 'Mock Test Drive', instructor: 'Instructor: Hari Prasad', status: 'pending' },
];

const progress = [
  { label: 'Vehicle Controls', pct: 90 },
  { label: 'Traffic Rules & Signs', pct: 75 },
  { label: 'Parking & Reversing', pct: 60 },
  { label: 'Highway Driving', pct: 40 },
  { label: 'Overall Readiness', pct: 65 },
];

const stats = [
  { icon: '🎓', val: '6', label: 'Lessons Completed' },
  { icon: '⏱', val: '12h', label: 'Total Drive Time' },
  { icon: '📋', val: '2', label: 'Tests Passed' },
  { icon: '📅', val: '4', label: 'Upcoming Lessons' },
];

export default function DashboardPage() {
  return (
    <main className="dashboard">
      <div className="dashboard-header">
        <div className="container">
          <div className="dashboard-welcome">Welcome back, <span>Anish</span> 👋</div>
          <div className="dashboard-subtitle">Basic Driving Course — Week 2 of 4</div>
        </div>
      </div>

      <div className="container">
        {/* Stats */}
        <div className="dashboard-stats">
          {stats.map((s, i) => (
            <div key={i} className="dash-stat">
              <div className="dash-stat-icon">{s.icon}</div>
              <div className="dash-stat-val">{s.val}</div>
              <div className="dash-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="dashboard-grid">
          {/* Upcoming Lessons */}
          <div className="dash-card">
            <div className="dash-card-header">
              <div className="dash-card-title">Upcoming Lessons</div>
              <span style={{ fontSize: 12, color: 'var(--yellow-dark)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>June 2026</span>
            </div>
            <div className="dash-card-body">
              {lessons.map((l, i) => (
                <div key={i} className="lesson-item">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="lesson-date">
                      <div className="lesson-date-day">{l.day}</div>
                      <div className="lesson-date-month">{l.month}</div>
                    </div>
                    <div className="lesson-info">
                      <div className="lesson-type">{l.type}</div>
                      <div className="lesson-instructor">{l.instructor}</div>
                    </div>
                  </div>
                  <span className={`lesson-status status-${l.status}`}>{l.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div className="dash-card">
            <div className="dash-card-header">
              <div className="dash-card-title">Your Progress</div>
            </div>
            <div className="dash-card-body">
              {progress.map((p, i) => (
                <div key={i} className="progress-item">
                  <div className="progress-label">
                    <span>{p.label}</span>
                    <span style={{ color: 'var(--yellow-dark)' }}>{p.pct}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${p.pct}%` }} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 24, padding: '16px', background: 'rgba(240,192,0,0.08)', borderRadius: 2, border: '1px solid rgba(240,192,0,0.2)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--dark)', marginBottom: 4 }}>Instructor Note</div>
                <p style={{ fontSize: 13, color: 'var(--gray)', lineHeight: 1.6 }}>
                  Good progress on vehicle controls! Focus on mirror checks and smooth braking before the next session.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
