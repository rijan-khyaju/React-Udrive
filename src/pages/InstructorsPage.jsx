import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/firebaseConfig.js';

export default function InstructorsPage({ setPage }) {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchInstructors() {
      if (!isFirebaseConfigured) {
        setError(new Error('Firestore is not configured'));
        setLoading(false);
        return;
      }

      try {
        const instructorsCollection = collection(db, 'instructors');
        const snapshot = await getDocs(instructorsCollection);
        const normalized = snapshot.docs.map((doc) => {
          const raw = doc.data();
          return {
            id: doc.id,
            name: raw.name ?? '',
            experience: raw.experience ?? '',
            assignedCourse: raw.assignedCourse ?? raw.assigned_course ?? '',
            email: raw.email ?? '',
            phone: raw.phone ?? raw.contact ?? '',
            status: raw.status ?? 'Active',
          };
        });
        setInstructors(normalized);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchInstructors();
  }, []);

  return (
    <main style={{ marginTop: 72 }}>
      {/* Header */}
      <section style={{ background: 'var(--dark)', padding: '64px 0 56px' }}>
        <div className="container">
          <span className="section-label">Our Team</span>
          <h1 className="section-title" style={{ color: 'var(--white)', marginTop: 8 }}>
            Meet Our <span>Instructors</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 14, fontSize: 16, maxWidth: 520 }}>
            Our government-certified instructors bring years of experience and a commitment to making you a confident, safe driver.
          </p>
        </div>
      </section>

      {/* Instructors Grid */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          {loading ? (
            <p style={{ color: 'var(--gray)', textAlign: 'center', fontSize: 16 }}>Loading instructors...</p>
          ) : error ? (
            <p style={{ color: 'var(--gray)', textAlign: 'center', fontSize: 16 }}>Unable to load instructors.</p>
          ) : instructors.length === 0 ? (
            <p style={{ color: 'var(--gray)', textAlign: 'center', fontSize: 16 }}>No instructors available at the moment.</p>
          ) : (
            <div className="instructors-grid">
              {instructors.map((instructor) => (
                <div key={instructor.id} className="instructor-card">
                  <span className="instructor-card-tag">Expert Instructor</span>
                  <h3 className="instructor-card-name">{instructor.name}</h3>
                  <p className="instructor-card-text">{instructor.experience}</p>
                  <div className="instructor-card-meta">
                    Assigned Course: <strong>{instructor.assignedCourse || 'N/A'}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--dark)', padding: '80px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 className="section-title" style={{ color: 'var(--white)' }}>
            Ready to Learn from Our <span>Expert Instructors?</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 16, fontSize: 16, maxWidth: 520, margin: '16px auto 0' }}>
            Book your free trial lesson today and experience personalized driving instruction.
          </p>
          <button className="btn btn-yellow" onClick={() => setPage('booking')} style={{ marginTop: 24 }}>
            Book Your Free Trial →
          </button>
        </div>
      </section>
    </main>
  );
}
