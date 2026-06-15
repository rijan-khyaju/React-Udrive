import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import '../styles/admin.css';

const titles = {
  '/admin/dashboard': 'Dashboard',
  '/admin/students': 'Students',
  '/admin/courses': 'Courses',
  '/admin/instructors': 'Instructors',
  '/admin/bookings': 'Bookings',
  '/admin/reviews': 'Reviews',
  '/admin/reports': 'Reports',
  '/admin/settings': 'Settings',
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = titles[location.pathname] || 'Admin';

  return (
    <div className={`admin-shell ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar open={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
      <div className="admin-content">
        <Topbar title={title} onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
