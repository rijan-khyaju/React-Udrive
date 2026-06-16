import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const links = [
    { label: 'Home', id: 'home' },
    { label: 'Courses', id: 'courses' },
    { label: 'Book a Lesson', id: 'booking' },
    { label: 'Instructors', id: 'instructors' },
    { label: 'Dashboard', id: 'dashboard' },
  ];

  const go = (id) => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
    if (location.pathname !== '/') {
      navigate('/', { state: { page: id } });
    } else {
      setPage(id);
    }
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container">
          <div className="navbar-inner">
            <div className="nav-logo" onClick={() => go('home')}>
              <div className="nav-logo-icon">A</div>
              <div className="nav-logo-text">Apex<span>Drive</span></div>
            </div>
            <div className="nav-links">
              {links.map((l) => (
                <span
                  key={l.id}
                  className={`nav-link ${page === l.id ? 'active' : ''}`}
                  onClick={() => go(l.id)}
                >
                  {l.label}
                </span>
              ))}
            </div>
            <div className="nav-actions">
              {!user ? (
                <button className="nav-login" onClick={() => navigate('/login')}>
                  Login
                </button>
              ) : (
                <div className="user-menu" ref={userMenuRef}>
                  <button
                    type="button"
                    className="user-name"
                    onClick={() => setUserMenuOpen((open) => !open)}
                  >
                    {user.displayName?.split(' ')[0] || 'Account'}
                  </button>
                  {userMenuOpen && (
                    <div className="user-dropdown">
                      <button
                        type="button"
                        onClick={() => {
                          navigate('/profile');
                          setUserMenuOpen(false);
                        }}
                      >
                        Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          navigate('/login');
                          setUserMenuOpen(false);
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
              <button className="nav-cta" onClick={() => go('booking')}>Book Now</button>
            </div>
            <div className="nav-mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
              <span style={menuOpen ? { transform: 'rotate(45deg) translate(5px,5px)' } : {}} />
              <span style={menuOpen ? { opacity: 0 } : {}} />
              <span style={menuOpen ? { transform: 'rotate(-45deg) translate(5px,-5px)' } : {}} />
            </div>
          </div>
        </div>
      </nav>
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {links.map((l) => (
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
