import { NavLink } from 'react-router-dom';

const items = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: '📊' },
  { label: 'Students', to: '/admin/students', icon: '🧑‍🎓' },
  { label: 'Courses', to: '/admin/courses', icon: '📚' },
  { label: 'Instructors', to: '/admin/instructors', icon: '👨‍🏫' },
  { label: 'Bookings', to: '/admin/bookings', icon: '📅' },
  { label: 'Reviews', to: '/admin/reviews', icon: '⭐' },
  { label: 'Reports', to: '/admin/reports', icon: '📈' },
  { label: 'Settings', to: '/admin/settings', icon: '⚙️' },
];

export default function Sidebar({ open, closeSidebar }) {
  return (
    <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
      <div className="admin-brand">
        <div className="brand-mark">U</div>
        <div>
          <div className="brand-name">UDrive</div>
          <div className="brand-subtitle">Admin Panel</div>
        </div>
      </div>

      <nav className="admin-nav">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <span className="admin-nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
