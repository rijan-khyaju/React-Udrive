import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/firebaseConfig.js';
import * as bookingService from '../admin/services/bookingService.js';
import * as studentService from '../admin/services/studentService.js';
import { useAuth } from '../context/AuthContext.jsx';

const details = [
  { icon: '📍', label: 'Location', val: 'Maharajgunj, Kathmandu' },
  { icon: '📞', label: 'Phone', val: '+977 01-4521890' },
  { icon: '✉️', label: 'Email', val: 'info@udrive.com.np' },
  { icon: '🕐', label: 'Hours', val: 'Sun–Fri 7am–6pm, Sat 8am–4pm' },
];

export default function BookingPage() {
  const { user, loading } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', course: '', date: '', time: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [coursesPaused, setCoursesPaused] = useState({});

  useEffect(() => {
    async function fetchCourses() {
      if (!isFirebaseConfigured) {
        return;
      }

      try {
        const coursesCollection = collection(db, 'courses');
        const snapshot = await getDocs(coursesCollection);
        const activeCourses = [];
        const pausedMap = {};

        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          const courseName = data.name || data.title || 'Untitled';
          pausedMap[courseName] = data.status === 'Paused' || data.status === 'Inactive';
          
          if (data.status !== 'Paused' && data.status !== 'Inactive') {
            activeCourses.push(courseName);
          }
        });

        setCourses(activeCourses);
        setCoursesPaused(pausedMap);
      } catch (error) {
        console.error('[BookingPage] fetchCourses error:', error);
      }
    }

    fetchCourses();
  }, []);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || user.displayName || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    // Check if course is paused
    if (coursesPaused[form.course]) {
      setSubmitError('This course is currently paused due to unforeseen circumstances. Please check back soon.');
      return;
    }

    const studentData = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      course: form.course,
      status: 'Active',
    };

    const bookingData = {
      student: form.name,
      email: form.email,
      phone: form.phone,
      course: form.course,
      booking_date: form.date,
      time: form.time,
      message: form.message,
      booking_status: 'Pending',
      payment_status: 'Pending',
    };

    try {
      await studentService.addStudent(studentData);
      await bookingService.addBooking(bookingData);
      setSubmitted(true);
    } catch (error) {
      console.error('[BookingPage] submit error:', error);
      setSubmitError('Unable to submit booking. Please try again.');
    }
  };

  if (!loading && !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main style={{ marginTop: 72 }}>
      {/* Header */}
      <section style={{ background: 'var(--dark)', padding: '64px 0 56px' }}>
        <div className="container">
          <span className="section-label">Get Started</span>
          <h1 className="section-title" style={{ color: 'var(--white)', marginTop: 8 }}>Book A <span>Lesson</span></h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 14, fontSize: 16, maxWidth: 520 }}>
            Your first trial lesson is completely free. Fill in the form and our team will confirm your slot within 2 hours.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="booking">
        <div className="container">
          <div className="booking-grid">
            {/* Left info */}
            <div>
              <span className="section-label">Contact & Info</span>
              <h2 className="booking-info-title">We're Easy To Reach</h2>
              <p className="booking-info-text">
                Our team is available 6 days a week. Walk-ins are welcome, but booking ahead guarantees your preferred time slot and instructor.
              </p>
              <div className="booking-details">
                {details.map((d, i) => (
                  <div key={i} className="booking-detail-item">
                    <div className="booking-detail-icon">{d.icon}</div>
                    <div>
                      <div className="booking-detail-label">{d.label}</div>
                      <div className="booking-detail-val">{d.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="booking-form">
              {submitted ? (
                <div className="form-success">
                  <div className="form-success-icon">🎉</div>
                  <h3>Booking Received!</h3>
                  <p>Thanks, {form.name.split(' ')[0]}! We'll confirm your lesson slot within 2 hours via call or email.</p>
                </div>
              ) : (
                <>
                  <div className="booking-form-title">Book Your Lesson</div>
                  <form onSubmit={submit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Full Name *</label>
                        <input name="name" value={form.name} onChange={handle} placeholder="Your full name" required />
                      </div>
                      <div className="form-group">
  <label>Phone *</label>
  <input
    name="phone"
    value={form.phone}
    onChange={handle}
    placeholder="98XXXXXXXX"
    pattern="^(97|98)\d{8}$"
    title="Enter a valid 10-digit Nepali mobile number starting with 97 or 98"
    maxLength={10}
    required
  />
</div>
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
  name="email"
  type="email"
  value={form.email}
  onChange={handle}
  placeholder="your@email.com"
  pattern="^[a-zA-Z0-9._%+\-]+@(gmail\.com|yahoo\.com|yahoo\.co\.in|outlook\.com|hotmail\.com|icloud\.com|protonmail\.com|live\.com|rediffmail\.com|edu\.np|gov\.np)$"
  title="Please use a genuine email provider (Gmail, Yahoo, Outlook, iCloud, etc.)"
/>
                    </div>
                    <div className="form-group">
                      <label>Course *</label>
                      <select name="course" value={form.course} onChange={handle} required>
                        <option value="">Select a course</option>
                        {courses.length > 0 ? (
                          courses.map((courseName) => (
                            <option key={courseName} value={courseName}>{courseName}</option>
                          ))
                        ) : (
                          <option value="" disabled>Loading courses...</option>
                        )}
                      </select>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Preferred Date</label>
                        <input
  name="date"
  type="date"
  value={form.date}
  onChange={handle}
  min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
  max="2026-12-31"
/>
                      </div>
                      <div className="form-group">
                        <label>Preferred Time</label>
                        <select name="time" value={form.time} onChange={handle}>
                          <option value="">Select time</option>
                          <option>7:00 AM – 9:00 AM</option>
                          <option>9:00 AM – 11:00 AM</option>
                          <option>11:00 AM – 1:00 PM</option>
                          <option>2:00 PM – 4:00 PM</option>
                          <option>4:00 PM – 6:00 PM</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Message</label>
                      <textarea name="message" value={form.message} onChange={handle} placeholder="Any specific requirements or questions?" />
                    </div>
                    {submitError && <p className="error-message">{submitError}</p>}
                    <button type="submit" className="form-submit">Confirm Booking →</button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
