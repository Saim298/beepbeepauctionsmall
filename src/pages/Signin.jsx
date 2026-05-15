import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { apiRequest, saveAuthToken } from '../api/client';
import logo from '../image/logo.png';
import { MobileBottomBarAuth } from '../components/MobileBottomBar';
import LuxuryAuthShell from '../components/auth/LuxuryAuthShell';
import GlassTextField from '../components/auth/GlassTextField';
import PasswordField from '../components/auth/PasswordField';
import SocialAuthButtons from '../components/auth/SocialAuthButtons';
import '../styles/authPremium.css';
import { useNotify } from '../context/NotificationContext.jsx';

/** Internal path only — prevents open redirects after sign-in. */
function postLoginPath(searchParams) {
  const raw = searchParams.get('redirect') || searchParams.get('returnUrl') || '';
  if (!raw || typeof raw !== 'string') return '/dashboard';
  const t = raw.trim();
  if (!t.startsWith('/') || t.startsWith('//')) return '/dashboard';
  return t;
}

const Signin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { notify } = useNotify();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [mfaToken, setMfaToken] = useState('');
  const [serverMfaToken, setServerMfaToken] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const apiBase = import.meta.env.VITE_API_URL || 'https://beep-auctions-backend.onrender.com';

  const createOAuthUrl = (provider) => {
    const clientUrl = window.location.origin;
    const state = btoa(JSON.stringify({ clientUrl }));
    return `${apiBase}/api/auth/${provider}?state=${encodeURIComponent(state)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const data = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      });
      if (data.mfaRequired) {
        setServerMfaToken(data.mfaToken);
      } else {
        saveAuthToken(data.token, { persistent: remember });
        notify({ title: 'Signed in', message: 'Welcome back.', severity: 'success' });
        navigate(postLoginPath(searchParams));
      }
    } catch (err) {
      const msg = err.message || 'Unable to sign in';
      setError(msg);
      notify({ title: 'Sign in failed', message: msg, severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyMfa = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const data = await apiRequest('/api/auth/mfa/verify-login', {
        method: 'POST',
        token: serverMfaToken,
        body: { token: mfaToken }
      });
      saveAuthToken(data.token, { persistent: remember });
      notify({ title: 'Signed in', message: 'Welcome back.', severity: 'success' });
      navigate(postLoginPath(searchParams));
    } catch (err) {
      const msg = err.message || 'Verification failed';
      setError(msg);
      notify({ title: 'MFA failed', message: msg, severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <MobileBottomBarAuth page="signin" />
      <LuxuryAuthShell
        brandLogo={logo}
        title="Welcome Back"
        subtitle="Access live luxury vehicle auctions in real time."
        footerLegal={
          <>
            By continuing you agree to our{' '}
            <a href="/terms-conditions.html" className="lux-accent-link">
              Terms of Service
            </a>{' '}
            and{' '}
            <Link to="/privacy" className="lux-accent-link">
              Privacy Policy
            </Link>
            .
          </>
        }
      >
        {!serverMfaToken ? (
          <form onSubmit={handleSubmit} noValidate>
            <GlassTextField
              id="auth-email"
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={setEmail}
              required
            />
            <PasswordField id="auth-password" label="Password" autoComplete="current-password" value={password} onChange={setPassword} required />
            <label className="lux-check">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Remember me on this device
            </label>
            <button type="submit" className="lux-btn-primary" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
            <div className="lux-auth-meta">
              <span style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)' }}>
                New here?{' '}
                <Link
                  to={searchParams.get('redirect') ? `/signup?redirect=${encodeURIComponent(searchParams.get('redirect'))}` : '/signup'}
                  className="lux-accent-link"
                >
                  Create account
                </Link>
              </span>
              <Link to="/forgot-password" className="lux-auth-link">
                Forgot password?
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyMfa}>
            <div className="lux-mfa-block">
              <h4>Two-factor authentication</h4>
              <p style={{ margin: '0 0 0.85rem', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.55)' }}>
                Enter the 6-digit code from your authenticator app.
              </p>
              <GlassTextField
                id="mfa-code"
                label="Authenticator code"
                type="text"
                autoComplete="one-time-code"
                value={mfaToken}
                onChange={setMfaToken}
              />
              <button type="submit" className="lux-btn-primary" disabled={submitting}>
                {submitting ? 'Verifying…' : 'Verify & continue'}
              </button>
              <button
                type="button"
                className="lux-auth-link"
                style={{ marginTop: '1rem', width: '100%', textAlign: 'center', background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={() => {
                  setServerMfaToken('');
                  setMfaToken('');
                  setError('');
                }}
              >
                ← Back to sign in
              </button>
            </div>
          </form>
        )}
        {error ? <div className="lux-banner-error">{error}</div> : null}

        {!serverMfaToken && <SocialAuthButtons googleHref={createOAuthUrl('google')} facebookHref={createOAuthUrl('facebook')} variant="signin" />}
      </LuxuryAuthShell>
      <div className="lux-mobile-bottom-spacer" aria-hidden />
    </div>
  );
};

export default Signin;
