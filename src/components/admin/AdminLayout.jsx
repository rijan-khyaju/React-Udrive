import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/students': 'Students',
  '/courses': 'Courses',
  '/instructors': 'Instructors',
  '/bookings': 'Bookings',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Dashboard';

  return (
    <div className={`admin-shell ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="admin-main">
        <Topbar title={title} onMenu={() => setSidebarOpen(true)} />
        <div className="page-content" onClick={() => sidebarOpen && setSidebarOpen(false)}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
