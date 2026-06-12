import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthPage({ initialTab = 'login' }) {
  const [tab, setTab] = useState(initialTab);
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (tab === 'signup') {
        await signUp({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          password: form.password,
          phone: form.phone.trim(),
        });
      } else {
        await signIn(form.email.trim(), form.password);
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'Unable to authenticate. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={{ marginTop: 72 }}>
      <section style={{ background: 'var(--dark)', padding: '64px 0 56px', borderBottom: '3px solid var(--yellow)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
            <div style={{ width: '42px', height: '42px', background: 'var(--yellow)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 900, color: 'var(--black)' }}>U</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 900, color: 'var(--white)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>U<span style={{ color: 'var(--yellow)' }}>Drive</span></div>
          </div>
          <h1 className="section-title" style={{ color: 'var(--white)', marginTop: 0 }}>
            {tab === 'signup' ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', marginTop: 14, maxWidth: 560, fontSize: 16 }}>
            {tab === 'signup'
              ? 'Sign up with your email to book lessons and track your driving progress.'
              : 'Log in to access your profile, booking history, and continue your lessons.'}
          </p>
        </div>
      </section>

      <section className="auth-page">
        <div className="container">
          <div className="auth-card">
            <div className="auth-tabs">
              <button
                type="button"
                className={tab === 'login' ? 'auth-tab active' : 'auth-tab'}
                onClick={() => setTab('login')}
              >
                Login
              </button>
              <button
                type="button"
                className={tab === 'signup' ? 'auth-tab active' : 'auth-tab'}
                onClick={() => setTab('signup')}
              >
                Sign Up
              </button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {tab === 'signup' && (
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    name="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label>Email *</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Password *</label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter a secure password"
                  minLength={6}
                  required
                />
              </div>

              {tab === 'signup' && (
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="98XXXXXXXX"
                    pattern="^(97|98)\d{8}$"
                    required
                  />
                </div>
              )}

              {error && <p className="auth-error">{error}</p>}

              <button type="submit" className="form-submit" disabled={submitting}>
                {submitting ? 'Processing…' : tab === 'signup' ? 'Create Account' : 'Log In'}
              </button>
            </form>

            <div className="auth-footer">
              {tab === 'login' ? (
                <p>
                  New here?{' '}
                  <button type="button" className="link-button" onClick={() => setTab('signup')}>
                    Create an account
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button type="button" className="link-button" onClick={() => setTab('login')}>
                    Log in
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
