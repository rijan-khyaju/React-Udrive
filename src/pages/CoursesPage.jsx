import { useState } from 'react';
import CourseCard from '../components/CourseCard';
import usePublicCourses from '../hooks/usePublicCourses';

const tags = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Refresher', 'Night Driving', 'Corporate'];

export default function CoursesPage({ setPage }) {
  const { courses, loading, error, refreshCourses } = usePublicCourses();
  const [active, setActive] = useState('All');

  const filtered = active === 'All' ? courses : courses.filter((c) => c.tag === active);

  return (
    <main style={{ marginTop: 72 }}>
      {/* Page Header */}
      <section style={{ background: 'var(--dark)', padding: '64px 0 56px' }}>
        <div className="container">
          <span className="section-label">What We Offer</span>
          <h1 className="section-title" style={{ color: 'var(--white)', marginTop: 8 }}>Our <span>Courses</span></h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 14, fontSize: 16, maxWidth: 560 }}>
            Whether you're a complete beginner or looking to sharpen your skills, we have a course built for you.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)', padding: '0 0' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 4, overflowX: 'auto', padding: '16px 0' }}>
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => setActive(tag)}
                style={{
                  padding: '8px 18px',
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  borderRadius: 2,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  border: '1.5px solid',
                  transition: 'all 0.15s',
                  background: active === tag ? 'var(--yellow)' : 'transparent',
                  borderColor: active === tag ? 'var(--yellow)' : 'var(--border)',
                  color: active === tag ? 'var(--black)' : 'var(--gray)',
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <section style={{ padding: '56px 0 96px', background: 'var(--gray-light)' }}>
        <div className="container">
          {loading ? (
            <p style={{ color: 'var(--gray)', textAlign: 'center', padding: '48px 0' }}>Loading courses...</p>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <p style={{ color: 'var(--gray)' }}>Unable to load courses.</p>
              <button className="btn btn-dark" onClick={refreshCourses}>Retry</button>
            </div>
          ) : filtered.length === 0 ? (
            <p style={{ color: 'var(--gray)', textAlign: 'center', padding: '48px 0' }}>No courses found.</p>
          ) : (
            <div className="courses-grid">
              {filtered.map((c) => (
                <CourseCard key={c.id} course={c} onBook={() => setPage('booking')} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-banner-inner">
            <div>
              <h2 className="cta-banner-title">Not Sure Which Course?</h2>
              <p className="cta-banner-sub">Talk to our team — we'll find the right fit for your experience and goals.</p>
            </div>
            <button className="btn btn-dark" onClick={() => setPage('booking')}>Get Free Advice</button>
          </div>
        </div>
      </section>
    </main>
  );
}
