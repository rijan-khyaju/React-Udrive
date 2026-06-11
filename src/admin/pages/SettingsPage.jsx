import { useState } from 'react';

const initialNotificationSettings = {
  emailNotifications: true,
  bookingNotifications: true,
  studentNotifications: false,
};

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@udrive.com',
    phone: '+1 234 567 8900',
  });
  const [password, setPassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [notifications, setNotifications] = useState(initialNotificationSettings);
  const [theme, setTheme] = useState('light');
  const [saveStatus, setSaveStatus] = useState({ profile: '', password: '', notifications: '', theme: '' });

  const saveSection = (section) => {
    setSaveStatus((current) => ({ ...current, [section]: 'Saved successfully' }));
    setTimeout(() => {
      setSaveStatus((current) => ({ ...current, [section]: '' }));
    }, 2000);
  };

  return (
    <section className="admin-page admin-settings">
      <div className="settings-header">
        <div>
          <p className="dashboard-welcome">Admin Settings</p>
          <p className="dashboard-copy">Configure profile, security, notifications, theme preferences, and system details.</p>
        </div>
      </div>

      <div className="admin-grid admin-grid-2 report-sections">
        <div className="admin-card settings-card">
          <div className="admin-card-header">
            <h3>Admin Profile</h3>
            <span>Personal account details</span>
          </div>
          <form className="settings-form" onSubmit={(event) => event.preventDefault()}>
            <div className="settings-form-row">
              <label htmlFor="profile-name">Name</label>
              <input
                id="profile-name"
                type="text"
                value={profile.name}
                onChange={(event) => setProfile({ ...profile, name: event.target.value })}
              />
            </div>
            <div className="settings-form-row">
              <label htmlFor="profile-email">Email</label>
              <input
                id="profile-email"
                type="email"
                value={profile.email}
                onChange={(event) => setProfile({ ...profile, email: event.target.value })}
              />
            </div>
            <div className="settings-form-row">
              <label htmlFor="profile-phone">Phone</label>
              <input
                id="profile-phone"
                type="tel"
                value={profile.phone}
                onChange={(event) => setProfile({ ...profile, phone: event.target.value })}
              />
            </div>
            <div className="settings-actions">
              <button className="btn-primary" type="button" onClick={() => saveSection('profile')}>
                Save Profile
              </button>
              {saveStatus.profile && <span className="save-message">{saveStatus.profile}</span>}
            </div>
          </form>
        </div>

        <div className="admin-card settings-card">
          <div className="admin-card-header">
            <h3>Change Password</h3>
            <span>Secure your account credentials</span>
          </div>
          <form className="settings-form" onSubmit={(event) => event.preventDefault()}>
            <div className="settings-form-row">
              <label htmlFor="current-password">Current Password</label>
              <input
                id="current-password"
                type="password"
                value={password.currentPassword}
                onChange={(event) => setPassword({ ...password, currentPassword: event.target.value })}
              />
            </div>
            <div className="settings-form-row">
              <label htmlFor="new-password">New Password</label>
              <input
                id="new-password"
                type="password"
                value={password.newPassword}
                onChange={(event) => setPassword({ ...password, newPassword: event.target.value })}
              />
            </div>
            <div className="settings-form-row">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                value={password.confirmPassword}
                onChange={(event) => setPassword({ ...password, confirmPassword: event.target.value })}
              />
            </div>
            <div className="settings-actions">
              <button className="btn-primary" type="button" onClick={() => saveSection('password')}>
                Save Password
              </button>
              {saveStatus.password && <span className="save-message">{saveStatus.password}</span>}
            </div>
          </form>
        </div>
      </div>

      <div className="admin-grid admin-grid-2 report-sections">
        <div className="admin-card settings-card">
          <div className="admin-card-header">
            <h3>Notification Settings</h3>
            <span>Manage your alerts</span>
          </div>
          <form className="settings-form" onSubmit={(event) => event.preventDefault()}>
            <div className="settings-form-row settings-checkbox-row">
              <label>
                <input
                  type="checkbox"
                  checked={notifications.emailNotifications}
                  onChange={(event) =>
                    setNotifications({ ...notifications, emailNotifications: event.target.checked })
                  }
                />
                Email Notifications
              </label>
            </div>
            <div className="settings-form-row settings-checkbox-row">
              <label>
                <input
                  type="checkbox"
                  checked={notifications.bookingNotifications}
                  onChange={(event) =>
                    setNotifications({ ...notifications, bookingNotifications: event.target.checked })
                  }
                />
                Booking Notifications
              </label>
            </div>
            <div className="settings-form-row settings-checkbox-row">
              <label>
                <input
                  type="checkbox"
                  checked={notifications.studentNotifications}
                  onChange={(event) =>
                    setNotifications({ ...notifications, studentNotifications: event.target.checked })
                  }
                />
                Student Notifications
              </label>
            </div>
            <div className="settings-actions">
              <button className="btn-primary" type="button" onClick={() => saveSection('notifications')}>
                Save Notifications
              </button>
              {saveStatus.notifications && <span className="save-message">{saveStatus.notifications}</span>}
            </div>
          </form>
        </div>

        <div className="admin-card settings-card">
          <div className="admin-card-header">
            <h3>Theme Preferences</h3>
            <span>Choose UI appearance</span>
          </div>
          <form className="settings-form" onSubmit={(event) => event.preventDefault()}>
            <div className="settings-form-row settings-radio-row">
              <label>
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={theme === 'light'}
                  onChange={() => setTheme('light')}
                />
                Light Theme
              </label>
            </div>
            <div className="settings-form-row settings-radio-row">
              <label>
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={theme === 'dark'}
                  onChange={() => setTheme('dark')}
                />
                Dark Theme Placeholder
              </label>
            </div>
            <div className="settings-actions">
              <button className="btn-primary" type="button" onClick={() => saveSection('theme')}>
                Save Theme
              </button>
              {saveStatus.theme && <span className="save-message">{saveStatus.theme}</span>}
            </div>
          </form>
        </div>
      </div>

      <div className="admin-card settings-card system-info-card">
        <div className="admin-card-header">
          <h3>System Information</h3>
          <span>Platform details</span>
        </div>
        <div className="system-info-grid">
          <div className="system-info-row">
            <span>Version</span>
            <strong>v2.4.1</strong>
          </div>
          <div className="system-info-row">
            <span>Environment</span>
            <strong>Production</strong>
          </div>
          <div className="system-info-row">
            <span>Last Updated</span>
            <strong>2026-06-10</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
