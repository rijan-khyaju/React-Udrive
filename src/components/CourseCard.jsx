import { useState } from 'react';

export default function CourseCard({ course, onBook }) {
  const [showPopup, setShowPopup] = useState(false);
  const isUnavailable = course.status === 'Paused' || course.status === 'Inactive';

  const handleCardClick = () => {
    if (isUnavailable) {
      setShowPopup(true);
    } else {
      onBook && onBook(course);
    }
  };

  return (
    <>
      <div
        className="course-card"
        onClick={handleCardClick}
        style={{
          position: 'relative',
          opacity: isUnavailable ? 0.75 : 1,
          cursor: isUnavailable ? 'not-allowed' : 'pointer',
          transition: 'transform 0.15s, box-shadow 0.15s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '';
        }}
      >
        <img src={course.img} alt={course.title} className="course-card-img" loading="lazy" />

        {isUnavailable && (
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: course.status === 'Paused' ? '#f59e0b' : '#ef4444',
            color: 'white', fontSize: 11, fontWeight: 700,
            padding: '3px 10px', borderRadius: 2, letterSpacing: '0.06em',
            textTransform: 'uppercase'
          }}>
            {course.status}
          </div>
        )}

        <div className="course-card-body">
          <span className="course-card-tag">{course.tag}</span>
          <h3 className="course-card-title">{course.title}</h3>
          <p className="course-card-desc">{course.desc}</p>
          <div className="course-card-meta">
            <div className="course-meta-item"><span>📅</span> {course.duration}</div>
            <div className="course-meta-item"><span>🎓</span> {course.lessons}</div>
          </div>
          <div className="course-card-footer">
            <div>
              <div className="course-price">{course.price}</div>
              <div className="course-price-label">per person</div>
            </div>
            <button
              className="course-btn"
              onClick={e => { e.stopPropagation(); handleCardClick(); }}
              style={{
                background: isUnavailable ? '#9ca3af' : '',
                cursor: isUnavailable ? 'not-allowed' : 'pointer'
              }}
            >
              {isUnavailable ? 'Unavailable' : 'Enroll Now'}
            </button>
          </div>
        </div>
      </div>

      {showPopup && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
          }}
          onClick={() => setShowPopup(false)}
        >
          <div
            style={{
              background: 'white', borderRadius: 8, padding: '40px 32px',
              maxWidth: 420, textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
            <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 22, marginBottom: 12 }}>
              Course Temporarily Unavailable
            </h3>
            <p style={{ color: '#6b7280', fontSize: 15, lineHeight: 1.6 }}>
              <strong>{course.title}</strong> is currently paused due to unforeseen circumstances.
              We're working hard to resume this course soon. Stay tuned!
            </p>
            <button
              onClick={() => setShowPopup(false)}
              style={{
                marginTop: 24, padding: '10px 28px', background: 'var(--yellow)',
                border: 'none', borderRadius: 4, fontWeight: 700,
                fontFamily: 'var(--font-body)', cursor: 'pointer', fontSize: 14
              }}
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
}