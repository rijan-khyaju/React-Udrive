import { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import * as studentService from '../services/studentService';
import * as bookingService from '../services/bookingService';
import * as courseService from '../services/courseService';

export default function ReportsPage() {
  const [stats, setStats] = useState({
    totalStudents: '-',
    totalRevenue: '-',
    totalBookings: '-',
    activeCourses: '-',
  });
  const [popularCourses, setPopularCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [students, bookings, courses] = await Promise.all([
          studentService.getStudents(),
          bookingService.getBookings(),
          courseService.getCourses(),
        ]);

        // Revenue — sum of paid bookings using stored booking fee only
        const revenue = bookings.reduce((sum, b) => {
          if (b.payment_status === 'Paid') {
            const fee = b.fee != null && Number(b.fee) > 0
              ? Number(b.fee)
              : 0;
            return sum + fee;
          }
          return sum;
        }, 0);

        // Active courses
        const activeCourses = courses.filter(
          (c) => c.status === 'Active'
        );

        // Popular courses — sort by student count
        const courseStudentMap = {};
        students.forEach((s) => {
          if (s.course) {
            courseStudentMap[s.course] = (courseStudentMap[s.course] || 0) + 1;
          }
        });

        const popular = courses
          .map((c) => ({
            title: c.name || c.title,
            students: c.students || courseStudentMap[c.name || c.title] || 0,
          }))
          .sort((a, b) => b.students - a.students)
          .slice(0, 5);

        setStats({
          totalStudents: students.length,
          totalRevenue: `Rs. ${revenue.toLocaleString()}`,
          totalBookings: bookings.length,
          activeCourses: activeCourses.length,
        });

        setPopularCourses(popular);
      } catch (error) {
        console.error('[ReportsPage] fetchData error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const reportStats = [
    { icon: '🧑‍🎓', label: 'Total Students', value: String(stats.totalStudents), delta: '' },
    { icon: '💰', label: 'Total Revenue', value: stats.totalRevenue, delta: '' },
    { icon: '📅', label: 'Total Bookings', value: String(stats.totalBookings), delta: '' },
    { icon: '📚', label: 'Active Courses', value: String(stats.activeCourses), delta: '' },
  ];

  return (
    <section className="admin-page admin-reports">
      <div className="reports-header">
        <div>
          <p className="dashboard-welcome">Reports Dashboard</p>
          <p className="dashboard-copy">
            Track registration trends, bookings cadence, revenue growth, and the most popular courses.
          </p>
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
            <span>All time</span>
          </div>
          <div className="report-summary-grid">
            <div className="report-summary-card">
              <strong>{loading ? '...' : stats.totalStudents}</strong>
              <p>Total students</p>
            </div>
            <div className="report-summary-card">
              <strong>{loading ? '...' : stats.activeCourses}</strong>
              <p>Active courses</p>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Bookings Overview</h3>
            <span>All time</span>
          </div>
          <div className="report-summary-grid">
            <div className="report-summary-card">
              <strong>{loading ? '...' : stats.totalBookings}</strong>
              <p>Total bookings</p>
            </div>
            <div className="report-summary-card">
              <strong>{loading ? '...' : stats.totalRevenue}</strong>
              <p>Total revenue</p>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-grid admin-grid-2 report-sections">
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Popular Courses</h3>
            <span>By student count</span>
          </div>
          <div className="course-list">
            {loading ? (
              <p>Loading...</p>
            ) : popularCourses.length === 0 ? (
              <p style={{ color: '#888', padding: '16px 0' }}>No course data yet.</p>
            ) : (
              popularCourses.map((course) => (
                <div key={course.title} className="course-list-item">
                  <div>
                    <h4>{course.title}</h4>
                    <p>{course.students} students enrolled</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Revenue Breakdown</h3>
            <span>Paid bookings only</span>
          </div>
          <div className="report-summary-grid">
            <div className="report-summary-card">
              <strong>{loading ? '...' : stats.totalRevenue}</strong>
              <p>From approved bookings</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}