import { useEffect, useState } from 'react';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig.js';
import { useAuth } from '../auth/AuthContext';
import { getHeroContent, updateHeroContent, getSectionContent, updateSectionContent } from '../../services/siteContentService.js';
import { testimonials as defaultTestimonials } from '../../data';

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
  const [saveStatus, setSaveStatus] = useState({ profile: '', password: '', notifications: '', theme: '', hero: '', about: '', whyUs: '', cta: '', testimonials: '', features: '' });
  const [heroContent, setHeroContent] = useState({
    badgeText: '',
    titleLine1: '',
    titleAccent: '',
    titleLine2: '',
    subtitle: '',
  });
  const [aboutContent, setAboutContent] = useState({
    sectionLabel: 'Who We Are',
    titleMain: 'A Perfect Driving School With',
    titleAccent: 'Expert Instructors',
    paragraph1: "ApexDrive was founded with one goal: to make Nepal's roads safer by training confident, responsible drivers. With 15+ years of experience, we've become the valley's most trusted driving school.",
    paragraph2: "Our government-certified instructors take a patient, structured approach — no rushing, no pressure. Just clear teaching in well-maintained dual-control vehicles.",
    buttonText: 'Book a Free Trial',
  });
  const [whyUsContent, setWhyUsContent] = useState({
    sectionLabel: 'Why Choose ApexDrive',
    titleMain: 'Why Students',
    titleAccent: 'Trust Us',
  });
  const [ctaContent, setCtaContent] = useState({
    titleLine1: 'Ready to Get Your',
    titleLine2: 'Driving License?',
    subtitle: 'Join 8,500+ students who trusted ApexDrive. First lesson is free.',
    button1Text: 'Book Free Trial',
    button2Text: 'View Courses',
  });
  const [testimonialsContent, setTestimonialsContent] = useState({
    sectionLabel: 'Student Stories',
    titleMain: 'What Our',
    titleAccent: 'Students Say',
  });
  const [testimonialsList, setTestimonialsList] = useState({ items: defaultTestimonials });
  const [aboutFeatures, setAboutFeatures] = useState({
    items: [
      { icon: '✅', text: 'Govt-Certified Instructors' },
      { icon: '🚗', text: 'Dual-Control Cars' },
      { icon: '📅', text: 'Flexible Timings' },
      { icon: '📋', text: '97% Pass Rate' },
      { icon: '🏫', text: 'Classroom Theory' },
      { icon: '📱', text: 'Online Progress Tracking' },
    ],
  });
  const [homepageTicker, setHomepageTicker] = useState({ items: ['Basic Driving', 'Defensive Driving', 'License Prep', 'Night Driving', 'Refresher Course', 'Fleet Training'] });
  const [homepageStats, setHomepageStats] = useState({ items: [
    { target: 8500, suffix: '+', decimals: 0, label: 'Students Trained' },
    { target: 97, suffix: '%', decimals: 0, label: 'Pass Rate' },
    { target: 15, suffix: '+', decimals: 0, label: 'Years Experience' },
    { target: 4.9, suffix: '★', decimals: 1, label: 'Average Rating' },
  ] });

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

  useEffect(() => {
    async function loadHeroContent() {
      try {
        const hero = await getHeroContent();
        if (hero) {
          setHeroContent({
            badgeText: hero.badgeText ?? '',
            titleLine1: hero.titleLine1 ?? '',
            titleAccent: hero.titleAccent ?? '',
            titleLine2: hero.titleLine2 ?? '',
            subtitle: hero.subtitle ?? '',
          });
        }
      } catch (error) {
        console.error('[SettingsPage] loadHeroContent error:', error);
      }
    }

    async function loadAboutContent() {
      try {
        const about = await getSectionContent('homepageAbout');
        if (about) {
          setAboutContent({
            sectionLabel: about.sectionLabel ?? 'Who We Are',
            titleMain: about.titleMain ?? 'A Perfect Driving School With',
            titleAccent: about.titleAccent ?? 'Expert Instructors',
            paragraph1: about.paragraph1 ?? "ApexDrive was founded with one goal: to make Nepal's roads safer by training confident, responsible drivers. With 15+ years of experience, we've become the valley's most trusted driving school.",
            paragraph2: about.paragraph2 ?? "Our government-certified instructors take a patient, structured approach — no rushing, no pressure. Just clear teaching in well-maintained dual-control vehicles.",
            buttonText: about.buttonText ?? 'Book a Free Trial',
          });
        }
      } catch (error) {
        console.error('[SettingsPage] loadAboutContent error:', error);
      }
    }

    async function loadWhyUsContent() {
      try {
        const whyUs = await getSectionContent('homepageWhyUs');
        if (whyUs) {
            setWhyUsContent({
            sectionLabel: whyUs.sectionLabel ?? 'Why Choose ApexDrive',
            titleMain: whyUs.titleMain ?? 'Why Students',
            titleAccent: whyUs.titleAccent ?? 'Trust Us',
          });
        }
      } catch (error) {
        console.error('[SettingsPage] loadWhyUsContent error:', error);
      }
    }

    async function loadCtaContent() {
      try {
        const cta = await getSectionContent('homepageCTA');
        if (cta) {
          setCtaContent({
            titleLine1: cta.titleLine1 ?? 'Ready to Get Your',
            titleLine2: cta.titleLine2 ?? 'Driving License?',
            subtitle: cta.subtitle ?? 'Join 8,500+ students who trusted ApexDrive. First lesson is free.',
            button1Text: cta.button1Text ?? 'Book Free Trial',
            button2Text: cta.button2Text ?? 'View Courses',
          });
        }
      } catch (error) {
        console.error('[SettingsPage] loadCtaContent error:', error);
      }
    }

    async function loadTestimonialsContent() {
      try {
        const t = await getSectionContent('homepageTestimonials');
        if (t) {
          setTestimonialsContent({
            sectionLabel: t.sectionLabel ?? 'Student Stories',
            titleMain: t.titleMain ?? 'What Our',
            titleAccent: t.titleAccent ?? 'Students Say',
          });
        }
      } catch (error) {
        console.error('[SettingsPage] loadTestimonialsContent error:', error);
      }
    }

    async function loadAboutFeaturesContent() {
      try {
        const f = await getSectionContent('homepageAboutFeatures');
        if (f && Array.isArray(f.items)) {
          setAboutFeatures({ items: f.items });
        }
      } catch (error) {
        console.error('[SettingsPage] loadAboutFeaturesContent error:', error);
      }
    }

    async function loadHomepageTicker() {
      try {
        const t = await getSectionContent('homepageTicker');
        if (t && Array.isArray(t.items)) {
          setHomepageTicker({ items: t.items });
        }
      } catch (error) {
        console.error('[SettingsPage] loadHomepageTicker error:', error);
      }
    }

    async function loadHomepageStats() {
      try {
        const s = await getSectionContent('homepageStats');
        if (s && Array.isArray(s.items)) {
          setHomepageStats({ items: s.items });
        }
      } catch (error) {
        console.error('[SettingsPage] loadHomepageStats error:', error);
      }
    }

    async function loadTestimonialsListContent() {
      try {
        const l = await getSectionContent('homepageTestimonialsList');
        if (l && Array.isArray(l.items)) {
          setTestimonialsList({ items: l.items });
        }
      } catch (error) {
        console.error('[SettingsPage] loadTestimonialsListContent error:', error);
      }
    }

    loadHeroContent();
    loadAboutContent();
    loadWhyUsContent();
    loadCtaContent();
    loadTestimonialsContent();
    loadAboutFeaturesContent();
    loadTestimonialsListContent();
    loadHomepageTicker();
    loadHomepageStats();
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

  const handleSaveHeroContent = async () => {
    try {
      await updateHeroContent(heroContent);
      setSaveStatus((current) => ({ ...current, hero: 'Hero content saved successfully!' }));
    } catch (error) {
      setSaveStatus((current) => ({ ...current, hero: 'Error saving hero content.' }));
    }
    setTimeout(() => setSaveStatus((current) => ({ ...current, hero: '' })), 3000);
  };

  const handleSaveAboutContent = async () => {
    try {
      await updateSectionContent('homepageAbout', aboutContent);
      setSaveStatus((current) => ({ ...current, about: 'About content saved successfully!' }));
    } catch (error) {
      setSaveStatus((current) => ({ ...current, about: 'Error saving about content.' }));
    }
    setTimeout(() => setSaveStatus((current) => ({ ...current, about: '' })), 3000);
  };

  const handleSaveWhyUsContent = async () => {
    try {
      await updateSectionContent('homepageWhyUs', whyUsContent);
      setSaveStatus((current) => ({ ...current, whyUs: 'Why Us content saved successfully!' }));
    } catch (error) {
      setSaveStatus((current) => ({ ...current, whyUs: 'Error saving Why Us content.' }));
    }
    setTimeout(() => setSaveStatus((current) => ({ ...current, whyUs: '' })), 3000);
  };

  const handleSaveCtaContent = async () => {
    try {
      await updateSectionContent('homepageCTA', ctaContent);
      setSaveStatus((current) => ({ ...current, cta: 'CTA content saved successfully!' }));
    } catch (error) {
      setSaveStatus((current) => ({ ...current, cta: 'Error saving CTA content.' }));
    }
    setTimeout(() => setSaveStatus((current) => ({ ...current, cta: '' })), 3000);
  };

  const handleSaveTestimonialsContent = async () => {
    try {
      await updateSectionContent('homepageTestimonials', testimonialsContent);
      setSaveStatus((current) => ({ ...current, testimonials: 'Testimonials header saved successfully!' }));
    } catch (error) {
      setSaveStatus((current) => ({ ...current, testimonials: 'Error saving testimonials header.' }));
    }
    setTimeout(() => setSaveStatus((current) => ({ ...current, testimonials: '' })), 3000);
  };

  const handleSaveAboutFeaturesContent = async () => {
    try {
      await updateSectionContent('homepageAboutFeatures', aboutFeatures);
      setSaveStatus((current) => ({ ...current, features: 'About features saved successfully!' }));
    } catch (error) {
      setSaveStatus((current) => ({ ...current, features: 'Error saving about features.' }));
    }
    setTimeout(() => setSaveStatus((current) => ({ ...current, features: '' })), 3000);
  };

  const saveSection = (section) => {
    setSaveStatus((current) => ({ ...current, [section]: 'Saved successfully' }));
    setTimeout(() => setSaveStatus((current) => ({ ...current, [section]: '' })), 2000);
  };

  const handleSaveTestimonialsListContent = async () => {
    try {
      await updateSectionContent('homepageTestimonialsList', testimonialsList);
      setSaveStatus((current) => ({ ...current, testimonials: 'Testimonials saved successfully!' }));
    } catch (error) {
      setSaveStatus((current) => ({ ...current, testimonials: 'Error saving testimonials.' }));
    }
    setTimeout(() => setSaveStatus((current) => ({ ...current, testimonials: '' })), 3000);
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

      <div className="admin-grid admin-grid-2 report-sections">
        <div className="admin-card settings-card">
          <div className="admin-card-header">
            <h3>Homepage Hero Content</h3>
            <span>Manage homepage hero messaging</span>
          </div>
          <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
            <div className="settings-form-row">
              <label htmlFor="hero-badge">Badge Text</label>
              <input
                id="hero-badge"
                type="text"
                value={heroContent.badgeText}
                onChange={(e) => setHeroContent({ ...heroContent, badgeText: e.target.value })}
              />
            </div>
            <div className="settings-form-row">
              <label htmlFor="hero-title-line1">Title Line 1</label>
              <input
                id="hero-title-line1"
                type="text"
                value={heroContent.titleLine1}
                onChange={(e) => setHeroContent({ ...heroContent, titleLine1: e.target.value })}
              />
            </div>
            <div className="settings-form-row">
              <label htmlFor="hero-title-accent">Title Accent Word</label>
              <input
                id="hero-title-accent"
                type="text"
                value={heroContent.titleAccent}
                onChange={(e) => setHeroContent({ ...heroContent, titleAccent: e.target.value })}
              />
            </div>
            <div className="settings-form-row">
              <label htmlFor="hero-title-line2">Title Line 2</label>
              <input
                id="hero-title-line2"
                type="text"
                value={heroContent.titleLine2}
                onChange={(e) => setHeroContent({ ...heroContent, titleLine2: e.target.value })}
              />
            </div>
            <div className="settings-form-row">
              <label htmlFor="hero-subtitle">Subtitle</label>
              <textarea
                id="hero-subtitle"
                value={heroContent.subtitle}
                onChange={(e) => setHeroContent({ ...heroContent, subtitle: e.target.value })}
                rows={4}
              />
            </div>
            <div className="settings-actions">
              <button className="btn-primary" type="button" onClick={handleSaveHeroContent}>
                Save Hero Content
              </button>
              {saveStatus.hero && <span className="save-message">{saveStatus.hero}</span>}
            </div>
          </form>
        </div>

        <div className="admin-card settings-card">
          <div className="admin-card-header">
            <h3>Homepage About Content</h3>
            <span>Manage homepage About section text</span>
          </div>
          <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
            <div className="settings-form-row">
              <label htmlFor="about-section-label">Section Label</label>
              <input
                id="about-section-label"
                type="text"
                value={aboutContent.sectionLabel}
                onChange={(e) => setAboutContent({ ...aboutContent, sectionLabel: e.target.value })}
              />
            </div>
            <div className="settings-form-row">
              <label htmlFor="about-title-main">Title Main</label>
              <input
                id="about-title-main"
                type="text"
                value={aboutContent.titleMain}
                onChange={(e) => setAboutContent({ ...aboutContent, titleMain: e.target.value })}
              />
            </div>
            <div className="settings-form-row">
              <label htmlFor="about-title-accent">Title Accent</label>
              <input
                id="about-title-accent"
                type="text"
                value={aboutContent.titleAccent}
                onChange={(e) => setAboutContent({ ...aboutContent, titleAccent: e.target.value })}
              />
            </div>
            <div className="settings-form-row">
              <label htmlFor="about-paragraph1">Paragraph 1</label>
              <textarea
                id="about-paragraph1"
                value={aboutContent.paragraph1}
                onChange={(e) => setAboutContent({ ...aboutContent, paragraph1: e.target.value })}
                rows={3}
              />
            </div>
            <div className="settings-form-row">
              <label htmlFor="about-paragraph2">Paragraph 2</label>
              <textarea
                id="about-paragraph2"
                value={aboutContent.paragraph2}
                onChange={(e) => setAboutContent({ ...aboutContent, paragraph2: e.target.value })}
                rows={3}
              />
            </div>
            <div className="settings-form-row">
              <label htmlFor="about-button-text">Button Text</label>
              <input
                id="about-button-text"
                type="text"
                value={aboutContent.buttonText}
                onChange={(e) => setAboutContent({ ...aboutContent, buttonText: e.target.value })}
              />
            </div>
            <div className="settings-actions">
              <button className="btn-primary" type="button" onClick={handleSaveAboutContent}>
                Save About Content
              </button>
              {saveStatus.about && <span className="save-message">{saveStatus.about}</span>}
            </div>
          </form>
        </div>
        <div className="admin-card settings-card">
          <div className="admin-card-header">
            <h3>Homepage About Features</h3>
            <span>Manage the About section feature items</span>
          </div>
          <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
            {aboutFeatures.items.map((it, idx) => (
              <div className="settings-form-row" key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ flex: '0 0 64px' }}>
                  <label>Icon</label>
                  <input type="text" value={it.icon} onChange={(e) => {
                    const copy = { ...aboutFeatures };
                    copy.items = copy.items.map((x, i) => i === idx ? { ...x, icon: e.target.value } : x);
                    setAboutFeatures(copy);
                  }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Text</label>
                  <input type="text" value={it.text} onChange={(e) => {
                    const copy = { ...aboutFeatures };
                    copy.items = copy.items.map((x, i) => i === idx ? { ...x, text: e.target.value } : x);
                    setAboutFeatures(copy);
                  }} />
                </div>
                <div style={{ flex: '0 0 96px' }}>
                  <label>&nbsp;</label>
                  <button className="btn-primary" type="button" onClick={() => {
                    const copy = { ...aboutFeatures };
                    copy.items = copy.items.filter((_, i) => i !== idx);
                    setAboutFeatures(copy);
                  }}>Remove</button>
                </div>
              </div>
            ))}
            <div className="settings-form-row">
              <button className="btn-primary" type="button" onClick={() => {
                setAboutFeatures((prev) => ({ items: [...prev.items, { icon: '', text: '' }] }));
              }}>Add Item</button>
            </div>
            <div className="settings-actions">
              <button className="btn-primary" type="button" onClick={handleSaveAboutFeaturesContent}>
                Save Features
              </button>
              {saveStatus.features && <span className="save-message">{saveStatus.features}</span>}
            </div>
          </form>
        </div>

            <div className="admin-card settings-card">
              <div className="admin-card-header">
                <h3>Homepage Ticker</h3>
                <span>Manage the scrolling ticker items</span>
              </div>
              <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
                {homepageTicker.items.map((it, idx) => (
                  <div className="settings-form-row" key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <label>Text</label>
                      <input type="text" value={it} onChange={(e) => {
                        const copy = { ...homepageTicker };
                        copy.items = copy.items.map((x, i) => i === idx ? e.target.value : x);
                        setHomepageTicker(copy);
                      }} />
                    </div>
                    <div style={{ flex: '0 0 96px' }}>
                      <label>&nbsp;</label>
                      <button className="btn-primary" type="button" onClick={() => {
                        const copy = { ...homepageTicker };
                        copy.items = copy.items.filter((_, i) => i !== idx);
                        setHomepageTicker(copy);
                      }}>Remove</button>
                    </div>
                  </div>
                ))}
                <div className="settings-form-row">
                  <button className="btn-primary" type="button" onClick={() => {
                    setHomepageTicker((prev) => ({ items: [...prev.items, ''] }));
                  }}>Add Item</button>
                </div>
                <div className="settings-actions">
                  <button className="btn-primary" type="button" onClick={async () => {
                    try {
                      await updateSectionContent('homepageTicker', homepageTicker);
                      setSaveStatus((c) => ({ ...c, features: 'Ticker saved successfully!' }));
                    } catch (err) {
                      setSaveStatus((c) => ({ ...c, features: 'Error saving ticker.' }));
                    }
                    setTimeout(() => setSaveStatus((c) => ({ ...c, features: '' })), 3000);
                  }}>
                    Save Ticker
                  </button>
                  {saveStatus.features && <span className="save-message">{saveStatus.features}</span>}
                </div>
              </form>
            </div>

            <div className="admin-card settings-card">
              <div className="admin-card-header">
                <h3>Homepage Hero Stats</h3>
                <span>Manage the hero stat numbers</span>
              </div>
              <div style={{ padding: 16, background: '#fff9db', borderRadius: 12, marginBottom: 16, border: '1px solid #f5e7a7' }}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Hero Statistics</div>
                <div style={{ color: '#555', fontSize: 14 }}>These numbers appear in the homepage hero section</div>
              </div>
              <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
                <div style={{ display: 'grid', gap: 16 }}>
                  {homepageStats.items.map((it, idx) => {
                    const isRating = it.label === 'Average Rating';
                    return (
                      <div
                        key={idx}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '48px 220px minmax(0, 1fr) 110px',
                          alignItems: 'start',
                          gap: 12,
                          background: isRating ? '#fffbeb' : '#f8f8f8',
                          borderRadius: 8,
                          padding: 16,
                          boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
                          borderLeft: `4px solid ${isRating ? '#9ca3a6' : '#f0c000'}`,
                        }}
                      >
                        <div style={{ color: '#6b7280', fontSize: 18, display: 'grid', placeItems: 'center' }}>⠿</div>
                        <div style={{ display: 'grid', gap: 8 }}>
                          <div style={{ fontSize: 22, fontWeight: 700, color: '#b45309', minWidth: 0 }}>{it.target}{it.suffix}</div>
                          <div style={{ fontSize: 13, color: '#6b7280', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={it.label || 'Label'}>{it.label || 'Label'}</div>
                        </div>
                        <div style={{ display: 'grid', gap: 12, width: '100%', minWidth: 0 }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', width: '100%', minWidth: 0, flexWrap: 'wrap' }}>
                            <div style={{ display: 'grid', gap: 6, minWidth: 0, width: 65 }}>
                              <label style={{ fontSize: 12, color: '#555', fontWeight: 600 }}>Target</label>
                              <input
                                type="number"
                                min={0}
                                max={it.suffix === '★' ? 5 : undefined}
                                step={it.suffix === '★' ? 0.1 : undefined}
                                value={it.target}
                                disabled={isRating}
                                readOnly={isRating}
                                onChange={(e) => {
                                  const copy = { ...homepageStats };
                                  copy.items = copy.items.map((x, i) => i === idx ? { ...x, target: Number(e.target.value) } : x);
                                  setHomepageStats(copy);
                                }}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', background: isRating ? '#f5f3e5' : '#fff' }}
                              />
                            </div>
                            <div style={{ display: 'grid', gap: 6, minWidth: 0, width: 55 }}>
                              <label style={{ fontSize: 12, color: '#555', fontWeight: 600 }}>Suffix</label>
                              <input
                                type="text"
                                value={it.suffix}
                                onChange={(e) => {
                                  const copy = { ...homepageStats };
                                  copy.items = copy.items.map((x, i) => i === idx ? { ...x, suffix: e.target.value } : x);
                                  setHomepageStats(copy);
                                }}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', background: '#fff' }}
                              />
                            </div>
                            <div style={{ display: 'grid', gap: 6, minWidth: 0, width: 55 }}>
                              <label style={{ fontSize: 12, color: '#555', fontWeight: 600 }}>Decimals</label>
                              <input
                                type="number"
                                min={0}
                                max={1}
                                value={it.decimals}
                                disabled={isRating}
                                readOnly={isRating}
                                onChange={(e) => {
                                  const v = Math.max(0, Math.min(1, Number(e.target.value) || 0));
                                  const copy = { ...homepageStats };
                                  copy.items = copy.items.map((x, i) => i === idx ? { ...x, decimals: v } : x);
                                  setHomepageStats(copy);
                                }}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', background: isRating ? '#f5f3e5' : '#fff' }}
                              />
                            </div>
                            <div style={{ display: 'grid', gap: 6, minWidth: 120, flex: 1 }}>
                              <label style={{ fontSize: 12, color: '#555', fontWeight: 600 }}>Label</label>
                              <input
                                type="text"
                                title={it.label}
                                value={it.label}
                                onChange={(e) => {
                                  const copy = { ...homepageStats };
                                  copy.items = copy.items.map((x, i) => i === idx ? { ...x, label: e.target.value } : x);
                                  setHomepageStats(copy);
                                }}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', minWidth: 0 }}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                if (!window.confirm('Are you sure you want to remove this stat?')) {
                                  return;
                                }
                                const copy = { ...homepageStats };
                                copy.items = copy.items.filter((_, i) => i !== idx);
                                setHomepageStats(copy);
                              }}
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 10,
                                border: 'none',
                                background: '#dc2626',
                                color: '#fff',
                                display: 'grid',
                                placeItems: 'center',
                                fontSize: 16,
                                cursor: 'pointer',
                                padding: 0,
                                minWidth: 0,
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = '#b91c1c'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = '#dc2626'; }}
                            >
                              🗑
                            </button>
                          </div>
                          {isRating && (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff8d2', color: '#854d0e', fontSize: 12, padding: '6px 10px', borderRadius: 999, width: 'fit-content' }}>
                              ⚡ Auto-calculated from approved reviews
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: 18, display: 'grid', gap: 12 }}>
                  <button
                    className="btn-primary"
                    type="button"
                    onClick={() => {
                      setHomepageStats((prev) => ({ items: [...prev.items, { target: 0, suffix: '', decimals: 0, label: '' }] }));
                    }}
                    style={{
                      width: '100%',
                      border: '2px dashed #f0c000',
                      background: 'transparent',
                      color: '#000',
                      padding: '14px',
                      borderRadius: 10,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    + Add Stat
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <button
                      className="btn-primary"
                      type="button"
                      onClick={async () => {
                        try {
                          await updateSectionContent('homepageStats', homepageStats);
                          setSaveStatus((c) => ({ ...c, features: 'Stats saved successfully!' }));
                        } catch (err) {
                          setSaveStatus((c) => ({ ...c, features: 'Error saving stats.' }));
                        }
                        setTimeout(() => setSaveStatus((c) => ({ ...c, features: '' })), 3000);
                      }}
                      style={{
                        padding: '14px 24px',
                        borderRadius: 10,
                        background: '#f0c000',
                        color: '#000',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Save Stats
                    </button>
                    {saveStatus.features && <span className="save-message">{saveStatus.features}</span>}
                  </div>
                </div>
              </form>
            </div>

        {/* Homepage Testimonials card removed — moved to ReviewsPage */}
        <div className="admin-card settings-card">
          <div className="admin-card-header">
            <h3>Homepage Why Us Content</h3>
            <span>Manage homepage Why Us section text</span>
          </div>
          <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
            <div className="settings-form-row">
              <label htmlFor="whyus-section-label">Section Label</label>
              <input
                id="whyus-section-label"
                type="text"
                value={whyUsContent.sectionLabel}
                onChange={(e) => setWhyUsContent({ ...whyUsContent, sectionLabel: e.target.value })}
              />
            </div>
            <div className="settings-form-row">
              <label htmlFor="whyus-title-main">Title Main</label>
              <input
                id="whyus-title-main"
                type="text"
                value={whyUsContent.titleMain}
                onChange={(e) => setWhyUsContent({ ...whyUsContent, titleMain: e.target.value })}
              />
            </div>
            <div className="settings-form-row">
              <label htmlFor="whyus-title-accent">Title Accent</label>
              <input
                id="whyus-title-accent"
                type="text"
                value={whyUsContent.titleAccent}
                onChange={(e) => setWhyUsContent({ ...whyUsContent, titleAccent: e.target.value })}
              />
            </div>
            <div className="settings-actions">
              <button className="btn-primary" type="button" onClick={handleSaveWhyUsContent}>
                Save Why Us Content
              </button>
              {saveStatus.whyUs && <span className="save-message">{saveStatus.whyUs}</span>}
            </div>
          </form>
        </div>
        <div className="admin-card settings-card">
          <div className="admin-card-header">
            <h3>Homepage CTA Banner Content</h3>
            <span>Manage homepage CTA banner text</span>
          </div>
          <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
            <div className="settings-form-row">
              <label htmlFor="cta-title-line1">Title Line 1</label>
              <input
                id="cta-title-line1"
                type="text"
                value={ctaContent.titleLine1}
                onChange={(e) => setCtaContent({ ...ctaContent, titleLine1: e.target.value })}
              />
            </div>
            <div className="settings-form-row">
              <label htmlFor="cta-title-line2">Title Line 2</label>
              <input
                id="cta-title-line2"
                type="text"
                value={ctaContent.titleLine2}
                onChange={(e) => setCtaContent({ ...ctaContent, titleLine2: e.target.value })}
              />
            </div>
            <div className="settings-form-row">
              <label htmlFor="cta-subtitle">Subtitle</label>
              <input
                id="cta-subtitle"
                type="text"
                value={ctaContent.subtitle}
                onChange={(e) => setCtaContent({ ...ctaContent, subtitle: e.target.value })}
              />
            </div>
            <div className="settings-form-row">
              <label htmlFor="cta-button1-text">Button 1 Text</label>
              <input
                id="cta-button1-text"
                type="text"
                value={ctaContent.button1Text}
                onChange={(e) => setCtaContent({ ...ctaContent, button1Text: e.target.value })}
              />
            </div>
            <div className="settings-form-row">
              <label htmlFor="cta-button2-text">Button 2 Text</label>
              <input
                id="cta-button2-text"
                type="text"
                value={ctaContent.button2Text}
                onChange={(e) => setCtaContent({ ...ctaContent, button2Text: e.target.value })}
              />
            </div>
            <div className="settings-actions">
              <button className="btn-primary" type="button" onClick={handleSaveCtaContent}>
                Save CTA Content
              </button>
              {saveStatus.cta && <span className="save-message">{saveStatus.cta}</span>}
            </div>
          </form>
        </div>
      </div>

        <div className="admin-card settings-card">
          <div className="admin-card-header">
            <h3>Homepage Testimonials Header</h3>
            <span>Manage homepage Testimonials section header</span>
          </div>
          <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
            <div className="settings-form-row">
              <label htmlFor="testimonials-section-label">Section Label</label>
              <input
                id="testimonials-section-label"
                type="text"
                value={testimonialsContent.sectionLabel}
                onChange={(e) => setTestimonialsContent({ ...testimonialsContent, sectionLabel: e.target.value })}
              />
            </div>
            <div className="settings-form-row">
              <label htmlFor="testimonials-title-main">Title Main</label>
              <input
                id="testimonials-title-main"
                type="text"
                value={testimonialsContent.titleMain}
                onChange={(e) => setTestimonialsContent({ ...testimonialsContent, titleMain: e.target.value })}
              />
            </div>
            <div className="settings-form-row">
              <label htmlFor="testimonials-title-accent">Title Accent</label>
              <input
                id="testimonials-title-accent"
                type="text"
                value={testimonialsContent.titleAccent}
                onChange={(e) => setTestimonialsContent({ ...testimonialsContent, titleAccent: e.target.value })}
              />
            </div>
            <div className="settings-actions">
              <button className="btn-primary" type="button" onClick={handleSaveTestimonialsContent}>
                Save Testimonials Header
              </button>
              {saveStatus.testimonials && <span className="save-message">{saveStatus.testimonials}</span>}
            </div>
          </form>
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