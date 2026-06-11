import StatCard from '../components/StatCard';

const reportStats = [
  { icon: '🧑‍🎓', label: 'Total Students', value: '8,240', delta: '+12.4%' },
  { icon: '💰', label: 'Total Revenue', value: '$148.2K', delta: '+8.7%' },
  { icon: '📅', label: 'Total Bookings', value: '1,872', delta: '+4.5%' },
  { icon: '📚', label: 'Active Courses', value: '24', delta: '+2' },
];

const popularCourses = [
  { title: 'License Prep', students: 420, completion: '92%' },
  { title: 'Defensive Driving', students: 310, completion: '89%' },
  { title: 'Night Driving', students: 190, completion: '84%' },
  { title: 'Basic Driving', students: 480, completion: '95%' },
];

export default function ReportsPage() {
  return (
    <section className="admin-page admin-reports">
      <div className="reports-header">
        <div>
          <p className="dashboard-welcome">Reports Dashboard</p>
          <p className="dashboard-copy">Track registration trends, bookings cadence, revenue growth, and the most popular courses.</p>
        </div>
      </div>

      <div className="report-stats-grid">
        {reportStats.map((stat) => (
          <StatCard key={stat.label} icon={stat.icon} label={stat.label} value={stat.value} delta={stat.delta} />
        ))}
      </div>

      <div className="admin-grid admin-grid-2 report-sections">
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Student Registration Overview</h3>
            <span>Last 30 days</span>
          </div>
          <div className="report-summary-grid">
            <div className="report-summary-card">
              <strong>1,120</strong>
              <p>New registrations</p>
            </div>
            <div className="report-summary-card">
              <strong>78%</strong>
              <p>Course enrollment rate</p>
            </div>
          </div>
          <div className="report-chart-placeholder">
            <span>Student registration chart placeholder</span>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Monthly Bookings Overview</h3>
            <span>6 month trend</span>
          </div>
          <div className="report-chart-placeholder report-chart-large">
            <span>Monthly bookings chart placeholder</span>
          </div>
        </div>
      </div>

      <div className="admin-grid admin-grid-2 report-sections">
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Revenue Overview</h3>
            <span>Fiscal quarter</span>
          </div>
          <div className="report-chart-placeholder report-chart-large">
            <span>Revenue chart placeholder</span>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Popular Courses</h3>
            <span>Top performing classes</span>
          </div>
          <div className="course-list">
            {popularCourses.map((course) => (
              <div key={course.title} className="course-list-item">
                <div>
                  <h4>{course.title}</h4>
                  <p>{course.students} students enrolled</p>
                </div>
                <span>{course.completion}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
