import { useState, useEffect } from 'react';

export default function Navbar({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Home', id: 'home' },
    { label: 'Courses', id: 'courses' },
    { label: 'Book a Lesson', id: 'booking' },
    { label: 'Instructors', id: 'instructors' },
    { label: 'Dashboard', id: 'dashboard' },
  ];

  const go = (id) => { setPage(id); setMenuOpen(false); window.scrollTo(0, 0); };

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-inner">
            <div className="nav-logo" onClick={() => go('home')}>
              <div className="nav-logo-icon">U</div>
              <div className="nav-logo-text">U<span>Drive</span></div>
            </div>
            <div className="nav-links">
              {links.map(l => (
                <span
                  key={l.id}
                  className={`nav-link ${page === l.id ? 'active' : ''}`}
                  onClick={() => go(l.id)}
                >
                  {l.label}
                </span>
              ))}
            </div>
            <button className="nav-cta" onClick={() => go('booking')}>Book Now</button>
            <div className="nav-mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
              <span style={menuOpen ? { transform: 'rotate(45deg) translate(5px,5px)' } : {}} />
              <span style={menuOpen ? { opacity: 0 } : {}} />
              <span style={menuOpen ? { transform: 'rotate(-45deg) translate(5px,-5px)' } : {}} />
            </div>
          </div>
        </div>
      </nav>
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {links.map(l => (
          <span
            key={l.id}
            className={`mobile-nav-link ${page === l.id ? 'active' : ''}`}
            onClick={() => go(l.id)}
          >
            {l.label}
          </span>
        ))}
        <button className="nav-cta" style={{ marginTop: 12, padding: '13px 22px' }} onClick={() => go('booking')}>
          Book Now
        </button>
      </div>
    </>
  );
}
