import { useState } from 'react';

export default function Topbar({ title, onMenu }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="icon-btn topbar-menu" onClick={onMenu} aria-label="Open menu">
          ☰
        </button>
        <div>
          <div className="page-title">{title}</div>
          <div className="page-subtitle">Manage UDrive operations with speed and clarity.</div>
        </div>
      </div>

      <div className="topbar-right">
        <div className="topbar-search">
          <input type="search" placeholder="Search UDrive" aria-label="Search" />
          <span className="search-icon">🔍</span>
        </div>
        <button className="icon-btn topbar-notification" aria-label="Notifications">🔔</button>
        <div className="topbar-avatar" onClick={() => setDropdownOpen((prev) => !prev)}>
          <div className="avatar-badge">A</div>
          <div className="avatar-info">
            <span>Admin</span>
            <small>Super Admin</small>
          </div>
          <span className="dropdown-caret">▾</span>
        </div>

        {dropdownOpen && (
          <div className="avatar-dropdown">
            <button className="dropdown-item">Profile</button>
            <button className="dropdown-item">Settings</button>
            <button className="dropdown-item">Logout</button>
          </div>
        )}
      </div>
    </header>
  );
}
