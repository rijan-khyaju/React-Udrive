import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: '📊' },
  { label: 'Students', to: '/students', icon: '🧑‍🎓' },
  { label: 'Courses', to: '/courses', icon: '📚' },
  { label: 'Instructors', to: '/instructors', icon: '👨‍🏫' },
  { label: 'Bookings', to: '/bookings', icon: '📅' },
  { label: 'Reports', to: '/reports', icon: '📈' },
  { label: 'Settings', to: '/settings', icon: '⚙️' },
  { label: 'Logout', to: '/dashboard', icon: '🚪', action: 'logout' },
];

export default function Sidebar({ open, setOpen }) {
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-icon">A</div>
        <div>
          <div className="brand-title">ApexDrive</div>
          <div className="brand-subtitle">Admin Panel</div>
        </div>
      </div>

      <div className="sidebar-divider" />
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setOpen(false)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-text">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-text">Ready for the next drive?</div>
      </div>
    </aside>
  );
}
