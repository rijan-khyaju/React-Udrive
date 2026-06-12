import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/firebaseConfig.js';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [fetchError, setFetchError] = useState('');
  const [page, setPage] = useState('profile');
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true });
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    async function loadBookings() {
      if (!user?.email) return;

      try {
        const bookingsRef = collection(db, 'bookings');
        const bookingsQuery = query(bookingsRef, where('email', '==', user.email));
        const snapshot = await getDocs(bookingsQuery);
        setBookings(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        setFetchError('Unable to load booking history.');
        console.error('[ProfilePage] loadBookings:', error);
      }
    }

    loadBookings();
  }, [user]);

  if (loading || !user) {
    return null;
  }

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <>
      <Navbar page={page} setPage={setPage} />
      <main style={{ marginTop: 72 }}>
        <section style={{ background: 'var(--dark)', padding: '64px 0 56px' }}>
          <div className="container">
            <span className="section-label">Account</span>
            <h1 className="section-title" style={{ color: 'var(--white)', marginTop: 8 }}>
              Your <span>Profile</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.65)', marginTop: 14, maxWidth: 560, fontSize: 16 }}>
              Manage your account details and review your lesson booking history.
            </p>
          </div>
        </section>

        <section className="profile-page">
          <div className="container profile-grid">
            <div className="profile-card">
              <h2 className="booking-form-title">Account Details</h2>
              <div className="profile-details">
                <div>
                  <div className="profile-label">Name</div>
                  <div className="profile-value">{user.displayName || '—'}</div>
                </div>
                <div>
                  <div className="profile-label">Email</div>
                  <div className="profile-value">{user.email}</div>
                </div>
                <div>
                  <div className="profile-label">Phone</div>
                  <div className="profile-value">{user.phone || '—'}</div>
                </div>
              </div>
              <button className="form-submit" style={{ marginTop: 24 }} onClick={handleLogout}>
                Logout
              </button>
            </div>

            <div className="profile-card">
              <h2 className="booking-form-title">Booking History</h2>
              {fetchError && <p className="error-message">{fetchError}</p>}
              {bookings.length === 0 ? (
                <p style={{ color: 'var(--gray)', lineHeight: 1.75 }}>
                  No bookings found yet. Book a lesson to see it appear here.
                </p>
              ) : (
                <div className="history-list">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="history-item">
                      <div className="history-row">
                        <span>Course</span>
                        <strong>{booking.course || 'N/A'}</strong>
                      </div>
                      <div className="history-row">
                        <span>Status</span>
                        <strong>{booking.booking_status || 'Pending'}</strong>
                      </div>
                      <div className="history-row">
                        <span>Requested Date</span>
                        <strong>{booking.booking_date || 'Not set'}</strong>
                      </div>
                      <div className="history-row">
                        <span>Time</span>
                        <strong>{booking.time || 'Not set'}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
