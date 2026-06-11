import { dashboardStats, recentBookings, recentStudents, activityFeed } from '../../data/adminData';

export default function DashboardPage() {
  return (
    <section className="dashboard-page">
      <div className="section-grid stats-grid">
        {dashboardStats.map((stat) => (
          <article key={stat.label} className="stat-card">
            <div className="stat-card-icon">{stat.icon}</div>
            <div>
              <p className="stat-label">{stat.label}</p>
              <h3>{stat.value}</h3>
            </div>
            <span className="stat-delta">{stat.delta}</span>
          </article>
        ))}
      </div>

      <div className="section-grid dashboard-grid">
        <div className="panel-card panel-large">
          <div className="panel-header">
            <h3>Recent Bookings</h3>
            <span className="panel-label">Latest 7 days</span>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Date</th>
                  <th>Payment</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.id}</td>
                    <td>{booking.student}</td>
                    <td>{booking.course}</td>
                    <td>{booking.date}</td>
                    <td>{booking.payment}</td>
                    <td><span className={`status-chip status-${booking.status.toLowerCase()}`}>{booking.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel-card panel-stack">
          <div className="panel-header">
            <h3>Recent Students</h3>
          </div>
          <div className="panel-list">
            {recentStudents.map((student) => (
              <div key={student.name} className="list-item">
                <div>
                  <p className="list-title">{student.name}</p>
                  <span className="list-subtitle">{student.course}</span>
                </div>
                <span className={`status-chip status-${student.status.toLowerCase()}`}>{student.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel-card panel-compact">
          <div className="panel-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="action-grid">
            <button className="btn btn-secondary">Create student</button>
            <button className="btn btn-secondary">Add course</button>
            <button className="btn btn-secondary">Assign instructor</button>
            <button className="btn btn-secondary">Review bookings</button>
          </div>
        </div>

        <div className="panel-card panel-compact">
          <div className="panel-header">
            <h3>Activity Feed</h3>
          </div>
          <div className="activity-list">
            {activityFeed.map((item) => (
              <div key={item.title} className="activity-item">
                <div>
                  <p className="activity-title">{item.title}</p>
                  <span className="activity-subtitle">{item.subtitle}</span>
                </div>
                <span className="activity-time">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
