export default function Footer({ setPage }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="nav-logo" style={{ cursor: 'pointer' }} onClick={() => setPage('home')}>
              <div className="nav-logo-icon">U</div>
              <div className="nav-logo-text">U<span>Drive</span></div>
            </div>
            <p className="footer-brand-text">
              Nepal's most trusted driving school since 2006. We've trained over 8,500 confident drivers across Kathmandu Valley.
            </p>
            <div className="footer-socials">
              {['📘','📷','💼','🐦'].map((icon, i) => (
                <div key={i} className="footer-social">{icon}</div>
              ))}
            </div>
          </div>
          <div>
            <span className="footer-col-title">Quick Links</span>
            <div className="footer-links">
              {[['Home','home'],['Courses','courses'],['Book a Lesson','booking'],['Dashboard','dashboard']].map(([label, id]) => (
                <span key={id} className="footer-link" onClick={() => setPage(id)}>{label}</span>
              ))}
            </div>
          </div>
          <div>
            <span className="footer-col-title">Our Courses</span>
            <div className="footer-links">
              {['Basic Driving','Defensive Driving','License Prep','Night Driving','Fleet Training','Refresher Course'].map(c => (
                <span key={c} className="footer-link" onClick={() => setPage('courses')}>{c}</span>
              ))}
            </div>
          </div>
          <div>
            <span className="footer-col-title">Contact Us</span>
            <div className="footer-contact-item">
              <span className="footer-contact-icon">📍</span>
              <span className="footer-contact-text">Maharajgunj, Kathmandu<br />Near Ring Road Chowk</span>
            </div>
            <div className="footer-contact-item">
              <span className="footer-contact-icon">📞</span>
              <span className="footer-contact-text">+977 01-4521890<br />+977 9841-234567</span>
            </div>
            <div className="footer-contact-item">
              <span className="footer-contact-icon">✉️</span>
              <span className="footer-contact-text">info@udrive.com.np</span>
            </div>
            <div className="footer-contact-item">
              <span className="footer-contact-icon">🕐</span>
              <span className="footer-contact-text">Sun – Fri: 7am – 6pm<br />Sat: 8am – 4pm</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">© 2025 <span>UDrive</span> Driving School. All rights reserved.</p>
          <p className="footer-copy">Made with ❤️ in Kathmandu</p>
        </div>
      </div>
    </footer>
  );
}
