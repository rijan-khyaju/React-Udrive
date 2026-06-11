import { systemInfo, settingsProfile } from '../../data/adminData';

export default function SettingsPage() {
  return (
    <section className="page-section settings-page">
      <div className="section-grid settings-grid">
        <div className="panel-card">
          <div className="panel-header">
            <h3>Admin Profile</h3>
          </div>
          <div className="settings-group">
            <label>
              Full Name
              <input defaultValue={settingsProfile.name} />
            </label>
            <label>
              Email Address
              <input defaultValue={settingsProfile.email} />
            </label>
            <label>
              Phone Number
              <input defaultValue={settingsProfile.phone} />
            </label>
            <label>
              Location
              <input defaultValue={settingsProfile.location} />
            </label>
            <button className="btn btn-primary">Save Profile</button>
          </div>
        </div>

        <div className="panel-card">
          <div className="panel-header">
            <h3>Change Password</h3>
          </div>
          <div className="settings-group">
            <label>
              Current Password
              <input type="password" placeholder="Current password" />
            </label>
            <label>
              New Password
              <input type="password" placeholder="New password" />
            </label>
            <label>
              Confirm Password
              <input type="password" placeholder="Confirm password" />
            </label>
            <button className="btn btn-secondary">Update Password</button>
          </div>
        </div>

        <div className="panel-card">
          <div className="panel-header">
            <h3>Notification Settings</h3>
          </div>
          <div className="settings-group settings-switches">
            {[
              'Email alerts',
              'Booking reminders',
              'Monthly summary',
              'System updates',
            ].map((label) => (
              <div key={label} className="settings-switch">
                <span>{label}</span>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider" />
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="panel-card">
          <div className="panel-header">
            <h3>System Information</h3>
          </div>
          <div className="settings-group">
            {Object.entries(systemInfo).map(([label, value]) => (
              <div key={label} className="info-row">
                <span>{label.replace(/([A-Z])/g, ' $1')}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel-card theme-card">
        <div className="panel-header">
          <h3>Theme Preferences</h3>
        </div>
        <div className="theme-grid">
          {['Soft Blue', 'White', 'Dark Mode'].map((theme) => (
            <button key={theme} className="theme-tile">{theme}</button>
          ))}
        </div>
      </div>
    </section>
  );
}
