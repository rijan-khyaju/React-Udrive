import { useEffect, useRef, useState } from 'react';
import CourseCard from '../components/CourseCard';
import { courses, testimonials, whyUs } from '../data';

function useCountUp(target, duration = 2000, active = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, active]);
  return val;
}

function Stats({ active }) {
  const s1 = useCountUp(8500, 1800, active);
  const s2 = useCountUp(97, 1400, active);
  const s3 = useCountUp(15, 1200, active);
  const s4 = useCountUp(49, 1600, active);
  return (
    <div className="hero-stats">
      {[
        { val: s1 + '+', label: 'Students Trained' },
        { val: s2 + '%', label: 'Pass Rate' },
        { val: s3 + '+', label: 'Years Experience' },
        { val: (s4 / 10).toFixed(1) + '★', label: 'Average Rating' },
      ].map((s, i) => (
        <div key={i}>
          <div className="hero-stat-num">{s.val}</div>
          <div className="hero-stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

const tickerItems = ['Basic Driving','Defensive Driving','License Prep','Night Driving','Refresher Course','Fleet Training','Basic Driving','Defensive Driving','License Prep','Night Driving','Refresher Course','Fleet Training'];

export default function HomePage({ setPage }) {
  const [statsActive, setStatsActive] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setStatsActive(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main>
      {/* HERO */}
      <section className="hero" ref={heroRef}>
        <div className="hero-bg-img" />
        <div className="hero-bg" />
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">🏆 Nepal's #1 Rated Driving School</div>
            <h1 className="hero-title">
              Learn To Drive
              <span className="accent">Confidently</span>
              & Safely
            </h1>
            <p className="hero-sub">
              Expert-led driving courses designed for beginners to advanced drivers. Flexible scheduling, certified instructors, and a 97% first-attempt pass rate.
            </p>
            <div className="hero-actions">
              <button className="btn btn-yellow" onClick={() => setPage('courses')}>Browse Courses →</button>
              <button className="btn btn-outline" onClick={() => setPage('booking')}>▶ Book Free Trial</button>
            </div>
            <Stats active={statsActive} />
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-inner">
          {tickerItems.map((item, i) => (
            <span key={i} className="ticker-item">
              {item}
              <span className="ticker-dot" />
            </span>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section className="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-img-wrap">
              <img
                className="about-img-main"
                src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=700&q=80"
                alt="Driving instructor"
              />
              <div className="about-img-badge">
                <div className="about-img-badge-num">2006</div>
                <div className="about-img-badge-text">Est. in Kathmandu</div>
              </div>
            </div>
            <div className="about-body">
              <span className="section-label">Who We Are</span>
              <h2 className="section-title">A Perfect Driving School With <span>Expert Instructors</span></h2>
              <p style={{ marginTop: 20 }}>
                UDrive was founded with one goal: to make Nepal's roads safer by training confident, responsible drivers. With 15+ years of experience, we've become the valley's most trusted driving school.
              </p>
              <p>
                Our government-certified instructors take a patient, structured approach — no rushing, no pressure. Just clear teaching in well-maintained dual-control vehicles.
              </p>
              <div className="about-features">
                {[
                  { icon: '✅', text: 'Govt-Certified Instructors' },
                  { icon: '🚗', text: 'Dual-Control Cars' },
                  { icon: '📅', text: 'Flexible Timings' },
                  { icon: '📋', text: '97% Pass Rate' },
                  { icon: '🏫', text: 'Classroom Theory' },
                  { icon: '📱', text: 'Online Progress Tracking' },
                ].map((f, i) => (
                  <div key={i} className="about-feature">
                    <div className="about-feature-icon">{f.icon}</div>
                    <div className="about-feature-text">{f.text}</div>
                  </div>
                ))}
              </div>
              <button className="btn btn-yellow" onClick={() => setPage('booking')}>Book a Free Trial</button>
            </div>
          </div>
        </div>
      </section>

      {/* COURSES PREVIEW */}
      <section className="courses">
        <div className="container">
          <div className="courses-header">
            <div>
              <span className="section-label">What We Offer</span>
              <h2 className="section-title">Our <span>Courses</span></h2>
            </div>
            <button className="btn btn-dark" onClick={() => setPage('courses')}>View All Courses →</button>
          </div>
          <div className="courses-grid">
            {courses.slice(0, 3).map(c => (
              <CourseCard key={c.id} course={c} onBook={() => setPage('booking')} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="why">
        <div className="container">
          <div className="why-header">
            <span className="section-label">Why Choose UDrive</span>
            <h2 className="section-title" style={{ color: 'var(--white)' }}>Why Students <span>Trust Us</span></h2>
          </div>
          <div className="why-grid">
            {whyUs.map((w, i) => (
              <div key={i} className="why-card">
                <div className="why-card-num">0{i + 1}</div>
                <div className="why-card-icon">{w.icon}</div>
                <div className="why-card-title">{w.title}</div>
                <p className="why-card-text">{w.text}</p>
                <div className="why-card-accent" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <div className="container">
          <div className="testimonials-header">
            <span className="section-label">Student Stories</span>
            <h2 className="section-title">What Our <span>Students Say</span></h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map(t => (
              <div key={t.id} className="testimonial-card">
                <div className="testimonial-stars">{'★'.repeat(t.stars)}</div>
                <div className="testimonial-quote">"</div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.initials}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-banner-inner">
            <div>
              <h2 className="cta-banner-title">Ready to Get Your<br />Driving License?</h2>
              <p className="cta-banner-sub">Join 8,500+ students who trusted UDrive. First lesson is free.</p>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="btn btn-dark" onClick={() => setPage('booking')}>Book Free Trial</button>
              <button className="btn btn-outline" style={{ borderColor: 'var(--black)', color: 'var(--black)' }} onClick={() => setPage('courses')}>View Courses</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
