import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebaseConfig.js';
import { submitReview } from '../services/reviewService.js';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [fetchError, setFetchError] = useState('');
  const [page, setPage] = useState('profile');
  const [editOpen, setEditOpen] = useState(false);
  const [editValues, setEditValues] = useState({ name: '', phone: '' });
  const [profileData, setProfileData] = useState({ name: '', phone: '' });
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewStars, setReviewStars] = useState(0);
  const [hoverStars, setHoverStars] = useState(0);
  const [reviewStatus, setReviewStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.displayName || '', phone: user.phone || '' });
      setEditValues({ name: user.displayName || '', phone: user.phone || '' });
    }
  }, [user]);

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

  const parseDateValue = (value) => {
    if (!value) return 0;
    if (typeof value === 'number') return value;
    if (value?.seconds) return value.seconds * 1000;
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const sortedBookings = [...bookings].sort((a, b) => parseDateValue(b.booking_date) - parseDateValue(a.booking_date));

  const statusCounts = sortedBookings.reduce(
    (acc, booking) => {
      const status = String(booking.booking_status || 'pending').toLowerCase();
      acc.total += 1;
      if (status === 'pending') acc.pending += 1;
      if (status === 'approved' || status === 'confirmed') acc.approved += 1;
      if (status === 'completed') acc.completed += 1;
      if (status === 'cancelled' || status === 'canceled') acc.cancelled += 1;
      return acc;
    },
    { total: 0, pending: 0, approved: 0, completed: 0, cancelled: 0 },
  );

  const getStatusBadge = (status) => {
    const key = String(status || 'pending').toLowerCase();
    const mapping = {
      pending: { label: 'Pending', bg: 'rgba(240,192,0,0.12)', color: 'var(--yellow)' },
      approved: { label: 'Approved', bg: 'rgba(34,197,94,0.12)', color: '#16a34a' },
      confirmed: { label: 'Approved', bg: 'rgba(34,197,94,0.12)', color: '#16a34a' },
      completed: { label: 'Completed', bg: 'rgba(59,130,246,0.14)', color: '#0f74d4' },
      cancelled: { label: 'Cancelled', bg: 'rgba(239,68,68,0.12)', color: '#dc2626' },
      canceled: { label: 'Cancelled', bg: 'rgba(239,68,68,0.12)', color: '#dc2626' },
    };

    return mapping[key] || mapping.pending;
  };

  const handleEditChange = (e) => setEditValues({ ...editValues, [e.target.name]: e.target.value });

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaveError('');

    const name = editValues.name.trim();
    const phone = editValues.phone.trim();

    if (!name) {
      setSaveError('Name is required.');
      return;
    }
    if (!phone) {
      setSaveError('Phone number is required.');
      return;
    }

    setSaving(true);
    try {
      if (auth.currentUser && auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, { displayName: name });
      }
      await setDoc(doc(db, 'users', user.uid), { fullName: name, phone }, { merge: true });
      setProfileData({ name, phone });
      setEditOpen(false);
    } catch (err) {
      console.error('[ProfilePage] handleProfileSave:', err);
      setSaveError('Unable to save profile updates. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewStatus('');

    if (reviewStars < 1) {
      setReviewStatus('Please select at least one star.');
      return;
    }
    if (!reviewText.trim()) {
      setReviewStatus('Please enter your review text.');
      return;
    }

    try {
      await submitReview({
        uid: user.uid,
        name: user.displayName || user.email || 'Student',
        stars: reviewStars,
        text: reviewText.trim(),
      });
      setReviewText('');
      setReviewStars(0);
      setReviewStatus('Thanks for your feedback! Your review will appear on the site once approved by our team.');
    } catch (err) {
      console.error('[ProfilePage] handleReviewSubmit:', err);
      setReviewStatus('Unable to submit review. Please try again later.');
    }
  };

  const getRatingLabel = (value) => {
    const labels = {
      1: 'Poor',
      1.5: 'Poor+',
      2: 'Fair',
      2.5: 'Fair+',
      3: 'Good',
      3.5: 'Very Good',
      4: 'Great',
      4.5: 'Excellent',
      5: 'Outstanding!',
    };
    return labels[value] || '';
  };

  const initials = profileData.name
    ? profileData.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('')
    : (user?.email?.slice(0, 2) || 'UD').toUpperCase();

  const profileName = profileData.name || user?.displayName || 'Student';
  const profilePhone = profileData.phone || user?.phone || '—';
  const profileEmail = user?.email || '—';

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
          <div className="container">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', justifyContent: 'space-between', background: 'var(--dark2)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2, padding: 28, marginBottom: 32, color: 'var(--white)' }}>
              <div style={{ display: 'flex', gap: 18, alignItems: 'center', minWidth: 0 }}>
                <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'var(--yellow)', display: 'grid', placeItems: 'center', fontSize: 32, fontWeight: 900, color: 'var(--black)' }}>
                  {initials}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div className="section-label" style={{ color: 'var(--yellow)' }}>Profile</div>
                  <h2 className="section-title" style={{ color: 'var(--white)', marginTop: 8, fontSize: 34 }}>
                    {profileName}
                  </h2>
                  <p style={{ marginTop: 10, color: 'rgba(255,255,255,0.7)', lineHeight: 1.65, maxWidth: 640 }}>{profileEmail}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="nav-cta"
                  style={{ padding: '12px 22px', fontSize: 14, fontWeight: 700 }}
                  onClick={() => setEditOpen(true)}
                >
                  Edit Profile
                </button>
                <button
                  type="button"
                  className="nav-cta"
                  style={{ padding: '12px 22px', fontSize: 14, fontWeight: 700, background: 'transparent', color: 'var(--white)', border: '1px solid rgba(255,255,255,0.18)' }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: 32 }}>
              <div style={{ background: 'var(--white)', borderRadius: 2, padding: 22, border: '1px solid var(--border)' }}>
                <div style={{ color: 'var(--gray)', textTransform: 'uppercase', fontSize: 12, letterSpacing: '0.08em', marginBottom: 10 }}>Total Bookings</div>
                <div style={{ fontSize: 34, fontWeight: 800, color: 'var(--dark)' }}>{statusCounts.total}</div>
              </div>
              <div style={{ background: 'var(--white)', borderRadius: 2, padding: 22, border: '1px solid var(--border)' }}>
                <div style={{ color: 'var(--gray)', textTransform: 'uppercase', fontSize: 12, letterSpacing: '0.08em', marginBottom: 10 }}>Pending</div>
                <div style={{ fontSize: 34, fontWeight: 800, color: 'var(--yellow)' }}>{statusCounts.pending}</div>
              </div>
              <div style={{ background: 'var(--white)', borderRadius: 2, padding: 22, border: '1px solid var(--border)' }}>
                <div style={{ color: 'var(--gray)', textTransform: 'uppercase', fontSize: 12, letterSpacing: '0.08em', marginBottom: 10 }}>Approved</div>
                <div style={{ fontSize: 34, fontWeight: 800, color: '#16a34a' }}>{statusCounts.approved}</div>
              </div>
              <div style={{ background: 'var(--white)', borderRadius: 2, padding: 22, border: '1px solid var(--border)' }}>
                <div style={{ color: 'var(--gray)', textTransform: 'uppercase', fontSize: 12, letterSpacing: '0.08em', marginBottom: 10 }}>Completed</div>
                <div style={{ fontSize: 34, fontWeight: 800, color: '#0f74d4' }}>{statusCounts.completed}</div>
              </div>
            </div>

            <div className="profile-grid">
              <div className="profile-card">
                <h2 className="booking-form-title">Account Details</h2>
                <div className="profile-details">
                  <div>
                    <div className="profile-label">Name</div>
                    <div className="profile-value">{profileName}</div>
                  </div>
                  <div>
                    <div className="profile-label">Email</div>
                    <div className="profile-value">{profileEmail}</div>
                  </div>
                  <div>
                    <div className="profile-label">Phone</div>
                    <div className="profile-value">{profilePhone}</div>
                  </div>
                </div>
              </div>

              <div className="profile-card">
                <h2 className="booking-form-title">Booking History</h2>
                {fetchError && <p className="error-message">{fetchError}</p>}
                {sortedBookings.length === 0 ? (
                  <div style={{ color: 'var(--gray)', lineHeight: 1.75 }}>
                    <p>No bookings found yet. Book a lesson to schedule your first driving session.</p>
                    <button
                      type="button"
                      className="nav-cta"
                      style={{ marginTop: 18, padding: '12px 24px' }}
                      onClick={() => navigate('/', { state: { page: 'booking' } })}
                    >
                      Book a Lesson
                    </button>
                  </div>
                ) : (
                  <div className="history-list">
                    {sortedBookings.map((booking) => {
                      const status = getStatusBadge(booking.booking_status);
                      const bookingDate = booking.booking_date ? new Date(booking.booking_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Not set';
                      return (
                        <div key={booking.id} className="history-item">
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 18, flexWrap: 'wrap' }}>
                            <div>
                              <div className="profile-label">Course</div>
                              <strong style={{ fontSize: 16 }}>{booking.course || 'N/A'}</strong>
                            </div>
                            <span style={{ background: status.bg, color: status.color, borderRadius: 999, padding: '8px 12px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>
                              {status.label}
                            </span>
                          </div>
                          <div className="history-row">
                            <span>Requested Date</span>
                            <strong>{bookingDate}</strong>
                          </div>
                          <div className="history-row">
                            <span>Time</span>
                            <strong>{booking.time || 'Not set'}</strong>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="profile-card" style={{ marginTop: 16, background: '#f8f8f8', borderRadius: 12, padding: 20, boxShadow: '0 16px 32px rgba(0, 0, 0, 0.06)' }}>
              <h2 className="booking-form-title">Leave a Review</h2>
              <form onSubmit={handleReviewSubmit} style={{ display: 'grid', gap: 20, marginTop: 12 }}>
                <div style={{ display: 'grid', gap: 16 }}>
                  <div className="profile-label" style={{ marginBottom: 8 }}>Rating</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-start' }}>
                    {[1, 2, 3, 4, 5].map((value) => {
                      const filledStars = hoverStars || reviewStars;
                      const diff = filledStars - value;
                      const isFull = diff >= 0;
                      const isHalf = diff === -0.5;
                      const leftHalfValue = value === 1 ? 1 : value - 0.5;

                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const newValue = x < rect.width / 2 ? leftHalfValue : value;
                            setReviewStars(newValue);
                          }}
                          onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const preview = x < rect.width / 2 ? leftHalfValue : value;
                            setHoverStars(preview);
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            setHoverStars(0);
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: 44,
                            lineHeight: 1,
                            width: 44,
                            height: 44,
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: 'scale(1)',
                            transition: 'transform 0.2s ease, color 0.2s ease',
                          }}
                        >
                          <span style={{ position: 'relative', display: 'inline-block', width: 36, height: 44 }}>
                            <span style={{ color: '#e0e0e0', position: 'absolute', top: 0, left: 0 }}>{'★'}</span>
                            {(isFull || isHalf) && (
                              <span
                                style={{
                                  color: '#f0c000',
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  width: isHalf ? '50%' : '100%',
                                  overflow: 'hidden',
                                }}
                              >
                                {'★'}
                              </span>
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#f0c000', color: '#000', fontWeight: 700, borderRadius: 999, padding: '8px 14px', fontSize: 14 }}>
                      {reviewStars > 0 ? getRatingLabel(reviewStars) : 'Tap a star to rate your experience'}
                    </div>
                    {reviewStars > 0 && (
                      <span style={{ color: '#111', fontWeight: 700, fontSize: 14 }}>{`${reviewStars.toFixed(reviewStars % 1 === 0 ? 0 : 1)} / 5`}</span>
                    )}
                  </div>
                  <div style={{ color: '#555', fontSize: 14 }}>
                    {reviewStars > 0 ? `You rated this ${reviewStars.toFixed(reviewStars % 1 === 0 ? 0 : 1)} out of 5` : 'Tap a star to rate your experience'}
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: 8 }}>
                  <label>Review</label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience with ApexDrive..."
                    rows={5}
                    style={{ width: '100%', minHeight: 120, borderRadius: 4, border: '1px solid var(--border)', padding: 14, fontSize: 15, resize: 'vertical' }}
                  />
                </div>
                {reviewStatus && (
                  <p style={{ color: reviewStatus.includes('Thanks') ? 'var(--green)' : 'var(--red)', margin: 0 }}>{reviewStatus}</p>
                )}
                <button
                  type="submit"
                  className="nav-cta"
                  style={{
                    width: 'fit-content',
                    padding: '12px 24px',
                    background: '#f0c000',
                    color: '#000',
                    fontWeight: 700,
                    transition: 'transform 0.2s ease, filter 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.filter = 'brightness(0.95)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.filter = 'none';
                  }}
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        </section>

        {editOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 200, display: 'grid', placeItems: 'center', padding: 24 }}>
            <div style={{ width: '100%', maxWidth: 520, background: 'var(--white)', borderRadius: 4, padding: 28, boxShadow: '0 24px 60px rgba(0,0,0,0.28)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div>
                  <div className="section-label">Edit Profile</div>
                  <h2 className="section-title" style={{ marginTop: 8, fontSize: 28 }}>Update your details</h2>
                </div>
                <button type="button" onClick={() => setEditOpen(false)} style={{ color: 'var(--dark)', fontSize: 16, fontWeight: 700 }}>Close</button>
              </div>
              <form onSubmit={handleProfileSave} style={{ display: 'grid', gap: 18 }}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    name="name"
                    value={editValues.name}
                    onChange={handleEditChange}
                    placeholder="Your full name"
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    name="phone"
                    value={editValues.phone}
                    onChange={handleEditChange}
                    placeholder="98XXXXXXXX"
                  />
                </div>
                {saveError && <p className="auth-error">{saveError}</p>}
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 10 }}>
                  <button type="submit" className="nav-cta" disabled={saving} style={{ padding: '12px 24px' }}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    className="link-button"
                    onClick={() => setEditOpen(false)}
                    disabled={saving}
                    style={{ color: 'var(--gray)', alignSelf: 'center' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
