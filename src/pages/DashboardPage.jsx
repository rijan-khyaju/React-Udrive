import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/firebaseConfig.js';

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
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentBookings() {
      if (!isFirebaseConfigured) {
        setBookingsLoading(false);
        return;
      }

      try {
        const bookingsCollection = collection(db, 'bookings');
        const bookingsQuery = query(bookingsCollection, orderBy('createdAt', 'desc'), limit(5));
        const snapshot = await getDocs(bookingsQuery);
        const normalized = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            student: data.student ?? data.name ?? '',
            course: data.course ?? '',
            booking_date: data.booking_date ?? data.date ?? '',
            time: data.time ?? data.preferredTime ?? '',
            booking_status: data.booking_status ?? 'Pending',
            createdAt: data.createdAt,
          };
        });
        setBookings(normalized);
      } catch (error) {
        console.error('[DashboardPage] fetchRecentBookings error:', error);
      } finally {
        setBookingsLoading(false);
      }
    }

    fetchRecentBookings();
  }, []);

  const lessons = [
    { day: '14', month: 'Jun', type: 'Basic Driving — Session 3', instructor: 'Instructor: Ram Bahadur', status: 'confirmed' },
    { day: '16', month: 'Jun', type: 'Theory Class — Traffic Rules', instructor: 'Instructor: Sita Devi', status: 'confirmed' },
    { day: '19', month: 'Jun', type: 'Basic Driving — Session 4', instructor: 'Instructor: Ram Bahadur', status: 'pending' },
    { day: '21', month: 'Jun', type: 'Mock Test Drive', instructor: 'Instructor: Hari Prasad', status: 'pending' },
  ];

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

        {/* Recent Bookings */}
        <div className="dash-card" style={{ marginTop: 24 }}>
          <div className="dash-card-header">
            <div className="dash-card-title">Recent Bookings</div>
          </div>
          <div className="dash-card-body">
            {bookingsLoading ? (
              <p style={{ color: 'var(--gray)', fontSize: 14 }}>Loading bookings...</p>
            ) : bookings.length === 0 ? (
              <p style={{ color: 'var(--gray)', fontSize: 14 }}>No bookings yet.</p>
            ) : (
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--gray-light)' }}>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--gray)' }}>Student Name</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--gray)' }}>Course</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--gray)' }}>Date</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--gray)' }}>Time</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--gray)' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        <td style={{ padding: '12px', fontSize: 13, color: 'var(--dark)' }}>{booking.student}</td>
                        <td style={{ padding: '12px', fontSize: 13, color: 'var(--dark)' }}>{booking.course}</td>
                        <td style={{ padding: '12px', fontSize: 13, color: 'var(--dark)' }}>{booking.booking_date}</td>
                        <td style={{ padding: '12px', fontSize: 13, color: 'var(--dark)' }}>{booking.time}</td>
                        <td style={{ padding: '12px', fontSize: 13 }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '4px 8px',
                            borderRadius: 3,
                            fontSize: 11,
                            fontWeight: 700,
                            backgroundColor: booking.booking_status === 'Pending' ? 'rgba(255, 193, 7, 0.1)' : booking.booking_status === 'Approved' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                            color: booking.booking_status === 'Pending' ? 'var(--yellow-dark)' : booking.booking_status === 'Approved' ? '#4CAF50' : '#F44336'
                          }}>
                            {booking.booking_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
