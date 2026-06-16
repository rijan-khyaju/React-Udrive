import { useEffect, useRef, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/firebaseConfig.js';
import CourseCard from '../components/CourseCard';
import usePublicCourses from '../hooks/usePublicCourses';
import { getAverageRating } from '../services/reviewService.js';
import { getHeroContent, getSectionContent } from '../services/siteContentService.js';
import { testimonials, whyUs } from '../data';

function useCountUpList(targets = [], durations = [], active = false) {
  const [values, setValues] = useState(() => targets.map(() => 0));
  useEffect(() => {
    if (!active) return;
    const durArray = targets.map((_, i) => (Array.isArray(durations) && durations[i] ? durations[i] : 1400));
    let start = null;
    let raf = null;
    const step = (ts) => {
      if (!start) start = ts;
      const next = targets.map((t, i) => {
        const d = durArray[i] || 1400;
        const p = Math.min((ts - start) / d, 1);
        return t * p;
      });
      setValues(next);
      const allDone = targets.every((t, i) => (ts - start) >= (durArray[i] || 1400));
      if (!allDone) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [JSON.stringify(targets), JSON.stringify(durations), active]);
  return values;
}

function Stats({ items = [], active }) {
  // items: [{ target, suffix, decimals, label }]
  const targets = items.map((it) => Number(it.target) || 0);
  const durations = items.map((it, i) => {
    // keep previous durations for first four to match original feel
    const defaults = [1800, 1400, 1200, 1600];
    return defaults[i] ?? 1400;
  });
  const values = useCountUpList(targets, durations, active);
  return (
    <div className="hero-stats">
      {items.map((it, i) => {
        const raw = values[i] ?? 0;
        const decimals = Number(it.decimals) || 0;
        const display = decimals > 0 ? raw.toFixed(decimals) : Math.floor(raw).toString();
        return (
          <div key={i}>
            <div className="hero-stat-num">{display}{it.suffix}</div>
            <div className="hero-stat-label">{it.label}</div>
          </div>
        );
      })}
    </div>
  );
}

const tickerItems = ['Basic Driving','Defensive Driving','License Prep','Night Driving','Refresher Course','Fleet Training','Basic Driving','Defensive Driving','License Prep','Night Driving','Refresher Course','Fleet Training'];

const defaultStats = [
  { target: 8500, suffix: '+', decimals: 0, label: 'Students Trained' },
  { target: 97, suffix: '%', decimals: 0, label: 'Pass Rate' },
  { target: 15, suffix: '+', decimals: 0, label: 'Years Experience' },
  { target: 4.9, suffix: '★', decimals: 1, label: 'Average Rating' },
];

export default function HomePage({ setPage }) {
  const [statsActive, setStatsActive] = useState(false);
  const heroRef = useRef(null);
  const { courses, loading, error } = usePublicCourses();
  const [instructors, setInstructors] = useState([]);
  const [instructorsLoading, setInstructorsLoading] = useState(true);
  const [instructorsError, setInstructorsError] = useState(null);
  const [heroContent, setHeroContent] = useState(null);
  const [aboutContent, setAboutContent] = useState(null);
  const [whyUsContent, setWhyUsContent] = useState(null);
  const [ctaContent, setCtaContent] = useState(null);
  const [testimonialsContent, setTestimonialsContent] = useState(null);
  const [testimonialsListData, setTestimonialsListData] = useState(null);
  const [aboutFeaturesData, setAboutFeaturesData] = useState(null);
  const [homepageTickerData, setHomepageTickerData] = useState(null);
  const [homepageStatsData, setHomepageStatsData] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setStatsActive(true), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function loadHeroContent() {
      try {
        const content = await getHeroContent();
        if (content) {
          setHeroContent(content);
        }
      } catch (error) {
        console.error('[HomePage] loadHeroContent error:', error);
      }
    }

    async function loadAboutContent() {
      try {
        const content = await getSectionContent('homepageAbout');
        if (content) {
          setAboutContent(content);
        }
      } catch (error) {
        console.error('[HomePage] loadAboutContent error:', error);
      }
    }

    async function loadWhyUsContent() {
      try {
        const content = await getSectionContent('homepageWhyUs');
        if (content) {
          setWhyUsContent(content);
        }
      } catch (error) {
        console.error('[HomePage] loadWhyUsContent error:', error);
      }
    }

    async function loadCtaContent() {
      try {
        const content = await getSectionContent('homepageCTA');
        if (content) {
          setCtaContent(content);
        }
      } catch (error) {
        console.error('[HomePage] loadCtaContent error:', error);
      }
    }

    async function loadTestimonialsContent() {
      try {
        const content = await getSectionContent('homepageTestimonials');
        if (content) {
          setTestimonialsContent(content);
        }
      } catch (error) {
        console.error('[HomePage] loadTestimonialsContent error:', error);
      }
    }

    async function loadTestimonialsListContent() {
      try {
        const content = await getSectionContent('homepageTestimonialsList');
        if (content && Array.isArray(content.items)) {
          setTestimonialsListData(content);
        }
      } catch (error) {
        console.error('[HomePage] loadTestimonialsListContent error:', error);
      }
    }

    async function loadAboutFeaturesContent() {
      try {
        const content = await getSectionContent('homepageAboutFeatures');
        if (content && Array.isArray(content.items)) {
          setAboutFeaturesData(content);
        }
      } catch (error) {
        console.error('[HomePage] loadAboutFeaturesContent error:', error);
      }
    }

    async function loadHomepageTickerContent() {
      try {
        const content = await getSectionContent('homepageTicker');
        if (content && Array.isArray(content.items)) {
          setHomepageTickerData(content);
        }
      } catch (error) {
        console.error('[HomePage] loadHomepageTickerContent error:', error);
      }
    }

    async function loadHomepageStatsContent() {
      try {
        const content = await getSectionContent('homepageStats');
        const averageRating = await getAverageRating();
        if (content && Array.isArray(content.items)) {
          const statsWithAverage = content.items.map((item) => (
            item.label === 'Average Rating' ? { ...item, target: averageRating } : item
          ));
          setHomepageStatsData({ items: statsWithAverage });
        }
      } catch (error) {
        console.error('[HomePage] loadHomepageStatsContent error:', error);
      }
    }

    loadHeroContent();
    loadAboutContent();
    loadWhyUsContent();
    loadCtaContent();
    loadTestimonialsContent();
    loadTestimonialsListContent();
    loadAboutFeaturesContent();
    loadHomepageTickerContent();
    loadHomepageStatsContent();
  }, []);

  useEffect(() => {
    async function fetchInstructors() {
      if (!isFirebaseConfigured) {
        setInstructorsError(new Error('Firestore is not configured'));
        setInstructorsLoading(false);
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
          };
        });
        setInstructors(normalized);
      } catch (err) {
        setInstructorsError(err);
      } finally {
        setInstructorsLoading(false);
      }
    }

    fetchInstructors();
  }, []);

  return (
    <main>
      {/* HERO */}
      <section className="hero" ref={heroRef}>
        <div className="hero-bg-img" />
        <div className="hero-bg" />
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              {heroContent?.badgeText ?? "🏆 Nepal's #1 Rated Driving School"}
            </div>
            <h1 className="hero-title">
              {heroContent?.titleLine1 ?? 'Learn To Drive'}
              <span className="accent">{heroContent?.titleAccent ?? 'Confidently'}</span>
              {heroContent?.titleLine2 ?? ' & Safely'}
            </h1>
            <p className="hero-sub">
              {heroContent?.subtitle ?? 'Expert-led driving courses designed for beginners to advanced drivers. Flexible scheduling, certified instructors, and a 97% first-attempt pass rate.'}
            </p>
            <div className="hero-actions">
              <button className="btn btn-yellow" onClick={() => setPage('courses')}>Browse Courses →</button>
              <button className="btn btn-outline" onClick={() => setPage('booking')}>▶ Book Free Trial</button>
            </div>
            <Stats items={(homepageStatsData?.items ?? defaultStats)} active={statsActive} />
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-inner">
          {(homepageTickerData?.items ? [...homepageTickerData.items, ...homepageTickerData.items] : tickerItems).map((item, i) => (
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
              <span className="section-label">
                {aboutContent?.sectionLabel ?? 'Who We Are'}
              </span>
              <h2 className="section-title">
                {aboutContent?.titleMain ?? 'A Perfect Driving School With'} <span>{aboutContent?.titleAccent ?? 'Expert Instructors'}</span>
              </h2>
              <p style={{ marginTop: 20 }}>
                {aboutContent?.paragraph1 ?? "ApexDrive was founded with one goal: to make Nepal's roads safer by training confident, responsible drivers. With 15+ years of experience, we've become the valley's most trusted driving school."}
              </p>
              <p>
                {aboutContent?.paragraph2 ?? "Our government-certified instructors take a patient, structured approach — no rushing, no pressure. Just clear teaching in well-maintained dual-control vehicles."}
              </p>
              <div className="about-features">
                {(aboutFeaturesData?.items ?? [
                  { icon: '✅', text: 'Govt-Certified Instructors' },
                  { icon: '🚗', text: 'Dual-Control Cars' },
                  { icon: '📅', text: 'Flexible Timings' },
                  { icon: '📋', text: '97% Pass Rate' },
                  { icon: '🏫', text: 'Classroom Theory' },
                  { icon: '📱', text: 'Online Progress Tracking' },
                ]).map((f, i) => (
                  <div key={i} className="about-feature">
                    <div className="about-feature-icon">{f.icon}</div>
                    <div className="about-feature-text">{f.text}</div>
                  </div>
                ))}
              </div>
              <button className="btn btn-yellow" onClick={() => setPage('booking')}>
                {aboutContent?.buttonText ?? 'Book a Free Trial'}
              </button>
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
            {loading ? (
              <p style={{ color: 'var(--gray)', textAlign: 'center', width: '100%' }}>Loading courses...</p>
            ) : error ? (
              <p style={{ color: 'var(--gray)', textAlign: 'center', width: '100%' }}>Unable to load courses.</p>
            ) : courses.slice(0, 3).map((c) => (
              <CourseCard key={c.id} course={c} onBook={() => setPage('booking')} />
            ))}
          </div>
        </div>
      </section>

      {/* INSTRUCTORS */}
      <section className="instructors">
        <div className="container">
          <div className="courses-header">
            <div>
              <span className="section-label">Meet Our Instructors</span>
              <h2 className="section-title">Our <span>Instructors</span></h2>
            </div>
            <button className="btn btn-dark" onClick={() => setPage('booking')}>Book a Trial →</button>
          </div>
          <div className="instructors-grid">
            {instructorsLoading ? (
              <p style={{ color: 'var(--gray)', textAlign: 'center', width: '100%' }}>Loading instructors...</p>
            ) : instructorsError ? (
              <p style={{ color: 'var(--gray)', textAlign: 'center', width: '100%' }}>Unable to load instructors.</p>
            ) : instructors.length === 0 ? (
              <p style={{ color: 'var(--gray)', textAlign: 'center', width: '100%' }}>No instructors available at the moment.</p>
            ) : (
              instructors.map((instructor) => (
                <div key={instructor.id} className="instructor-card">
                  <span className="instructor-card-tag">Expert Instructor</span>
                  <h3 className="instructor-card-name">{instructor.name}</h3>
                  <p className="instructor-card-text">{instructor.experience}</p>
                  <div className="instructor-card-meta">
                    Assigned Course: <strong>{instructor.assignedCourse || 'N/A'}</strong>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="why">
        <div className="container">
          <div className="why-header">
            <span className="section-label">{whyUsContent?.sectionLabel ?? 'Why Choose ApexDrive'}</span>
            <h2 className="section-title" style={{ color: 'var(--white)' }}>
              {whyUsContent?.titleMain ?? 'Why Students'} <span>{whyUsContent?.titleAccent ?? 'Trust Us'}</span>
            </h2>
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
            <span className="section-label">{testimonialsContent?.sectionLabel ?? "Student Stories"}</span>
            <h2 className="section-title">
              {testimonialsContent?.titleMain ?? "What Our"} <span>{testimonialsContent?.titleAccent ?? "Students Say"}</span>
            </h2>
          </div>
          <div className="testimonials-grid">
            {(testimonialsListData?.items ?? testimonials).map(t => (
              <div key={t.id} className="testimonial-card">
                <div className="testimonial-stars">{'★'.repeat(t.stars ?? 5)}</div>
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
              <h2 className="cta-banner-title">
                {ctaContent?.titleLine1 ?? 'Ready to Get Your'}
                <br />
                {ctaContent?.titleLine2 ?? 'Driving License?'}
              </h2>
              <p className="cta-banner-sub">
                  {ctaContent?.subtitle ?? 'Join 8,500+ students who trusted ApexDrive. First lesson is free.'}
                </p>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="btn btn-dark" onClick={() => setPage('booking')}>
                {ctaContent?.button1Text ?? 'Book Free Trial'}
              </button>
              <button className="btn btn-outline" style={{ borderColor: 'var(--black)', color: 'var(--black)' }} onClick={() => setPage('courses')}>
                {ctaContent?.button2Text ?? 'View Courses'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
