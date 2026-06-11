import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Topbar({ title, onMenuToggle }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  async function handleLogout() {
    await signOut();
    navigate('/admin/login', { replace: true });
  }

  return (
    <header className="admin-topbar">
      <div className="topbar-left">
        <button className="topbar-menu-btn" onClick={onMenuToggle} aria-label="Toggle sidebar">☰</button>
        <div>
          <h1 className="topbar-title">{title}</h1>
          <p className="topbar-subtitle">Manage the driving school operations in one place.</p>
        </div>
      </div>

      <div className="topbar-actions">
        <label className="topbar-search">
          <input type="search" placeholder="Search admin" />
          <span>🔍</span>
        </label>

        <button className="topbar-icon">🔔</button>
        <button
          className="topbar-avatar"
          onClick={() => setOpen((prev) => !prev)}
          aria-haspopup="true"
          aria-expanded={open}
        >
          <span>AD</span>
          <span>▾</span>
        </button>
        {open && (
          <div className="avatar-menu">
            <button>Profile</button>
            <button>Settings</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
}
