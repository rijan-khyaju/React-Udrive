import { useEffect, useState } from 'react';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig.js';
import { useAuth } from '../auth/AuthContext';

const initialNotificationSettings = {
  emailNotifications: true,
  bookingNotifications: true,
  studentNotifications: false,
};

export default function SettingsPage() {
  const { user, signOut, setUser } = useAuth();
  const auth = getAuth();

  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [notifications, setNotifications] = useState(initialNotificationSettings);
  const [theme, setTheme] = useState('light');
  const [saveStatus, setSaveStatus] = useState({ profile: '', password: '', notifications: '', theme: '' });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.displayName || '',
        email: user.email || '',
        phone: '',
      });
    }
  }, [user]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('adminTheme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const handleSaveProfile = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      // Update Firebase Auth displayName
      await import('firebase/auth').then(({ updateProfile }) =>
        updateProfile(currentUser, { displayName: profile.name })
      );

      // Update Firestore
      await updateDoc(doc(db, 'users', currentUser.uid), {
        fullName: profile.name,
        phone: profile.phone,
      });

      // Reload so currentUser.displayName reflects the new name
      await currentUser.reload();

      // Update AuthContext user so dashboard reflects new name immediately
      setUser((prev) => ({ ...prev, displayName: profile.name }));

      setSaveStatus((c) => ({ ...c, profile: 'Profile saved successfully!' }));
    } catch (error) {
      setSaveStatus((c) => ({ ...c, profile: 'Error saving profile.' }));
    }
    setTimeout(() => setSaveStatus((c) => ({ ...c, profile: '' })), 3000);
  };

  const handlePasswordChange = async () => {
    if (password.newPassword !== password.confirmPassword) {
      setSaveStatus((c) => ({ ...c, password: 'Passwords do not match' }));
      setTimeout(() => setSaveStatus((c) => ({ ...c, password: '' })), 3000);
      return;
    }
    if (password.newPassword.length < 6) {
      setSaveStatus((c) => ({ ...c, password: 'Password must be at least 6 characters' }));
      setTimeout(() => setSaveStatus((c) => ({ ...c, password: '' })), 3000);
      return;
    }
    try {
      const currentUser = auth.currentUser;
      const credential = EmailAuthProvider.credential(currentUser.email, password.currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, password.newPassword);
      setPassword({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSaveStatus((c) => ({ ...c, password: 'Password changed successfully!' }));
    } catch (error) {
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setSaveStatus((c) => ({ ...c, password: 'Current password is incorrect' }));
      } else {
        setSaveStatus((c) => ({ ...c, password: 'Error: ' + error.message }));
      }
    }
    setTimeout(() => setSaveStatus((c) => ({ ...c, password: '' })), 3000);
  };

  const saveSection = (section) => {
    setSaveStatus((current) => ({ ...current, [section]: 'Saved successfully' }));
    setTimeout(() => setSaveStatus((current) => ({ ...current, [section]: '' })), 2000);
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
          <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
            <div className="settings-form-row">
              <label htmlFor="profile-name">Name</label>
              <input
                id="profile-name" type="text" value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div className="settings-form-row">
              <label htmlFor="profile-email">Email</label>
              <input
                id="profile-email" type="email" value={profile.email}
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
            </div>
            <div className="settings-form-row">
              <label htmlFor="profile-phone">Phone</label>
              <input
                id="profile-phone" type="tel" value={profile.phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setProfile({ ...profile, phone: val });
                }}
                placeholder="98XXXXXXXX"
                maxLength={10}
              />
            </div>
            <div className="settings-actions">
              <button className="btn-primary" type="button" onClick={handleSaveProfile}>
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
          <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
            <div className="settings-form-row">
              <label htmlFor="current-password">Current Password</label>
              <input
                id="current-password" type="password" value={password.currentPassword}
                onChange={(e) => setPassword({ ...password, currentPassword: e.target.value })}
              />
            </div>
            <div className="settings-form-row">
              <label htmlFor="new-password">New Password</label>
              <input
                id="new-password" type="password" value={password.newPassword}
                onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
              />
            </div>
            <div className="settings-form-row">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                id="confirm-password" type="password" value={password.confirmPassword}
                onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value })}
              />
            </div>
            <div className="settings-actions">
              <button className="btn-primary" type="button" onClick={handlePasswordChange}>
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
          <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
            <div className="settings-form-row settings-checkbox-row">
              <label>
                <input type="checkbox" checked={notifications.emailNotifications}
                  onChange={(e) => setNotifications({ ...notifications, emailNotifications: e.target.checked })}
                />
                Email Notifications
              </label>
            </div>
            <div className="settings-form-row settings-checkbox-row">
              <label>
                <input type="checkbox" checked={notifications.bookingNotifications}
                  onChange={(e) => setNotifications({ ...notifications, bookingNotifications: e.target.checked })}
                />
                Booking Notifications
              </label>
            </div>
            <div className="settings-form-row settings-checkbox-row">
              <label>
                <input type="checkbox" checked={notifications.studentNotifications}
                  onChange={(e) => setNotifications({ ...notifications, studentNotifications: e.target.checked })}
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
          <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
            <div className="settings-form-row settings-radio-row">
              <label>
                <input type="radio" name="theme" value="light"
                  checked={theme === 'light'} onChange={() => setTheme('light')}
                />
                Light Theme
              </label>
            </div>
            <div className="settings-form-row settings-radio-row">
              <label>
                <input type="radio" name="theme" value="dark"
                  checked={theme === 'dark'} onChange={() => setTheme('dark')}
                />
                Dark Theme
              </label>
            </div>
            <div className="settings-actions">
              <button className="btn-primary" type="button" onClick={() => {
                document.documentElement.setAttribute('data-theme', theme);
                localStorage.setItem('adminTheme', theme);
                saveSection('theme');
              }}>
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

      {/* Logout */}
      <div className="admin-card settings-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px' }}>
        <div>
          <strong>Sign Out</strong>
          <p style={{ color: '#888', fontSize: 13, marginTop: 4 }}>Sign out of the admin panel</p>
        </div>
        <button
          className="btn-primary"
          style={{ background: '#ef4444', border: 'none' }}
          onClick={signOut}
        >
          Logout
        </button>
      </div>
    </section>
  );
}