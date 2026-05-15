import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { apiRequest, saveAuthToken } from '../api/client';
import logo from '../image/logo.png';
import { MobileBottomBarAuth } from '../components/MobileBottomBar';
import LuxuryAuthShell from '../components/auth/LuxuryAuthShell';
import GlassTextField from '../components/auth/GlassTextField';
import PasswordField from '../components/auth/PasswordField';
import PasswordStrength from '../components/auth/PasswordStrength';
import SocialAuthButtons from '../components/auth/SocialAuthButtons';
import AccountTypeToggle from '../components/auth/AccountTypeToggle';
import '../styles/authPremium.css';

const disposableEmailDomains = [
  'guerrillamail.com',
  'mailinator.com',
  '10minutemail.com',
  'tempmail.org',
  'temp-mail.org',
  'yopmail.com',
  'throwaway.email',
  'maildrop.cc'
];

function postLoginPath(searchParams) {
  const raw = searchParams.get('redirect') || searchParams.get('returnUrl') || '';
  if (!raw || typeof raw !== 'string') return '/dashboard';
  const t = raw.trim();
  if (!t.startsWith('/') || t.startsWith('//')) return '/dashboard';
  return t;
}

const Signup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const apiBase = import.meta.env.VITE_API_URL || 'https://beep-auctions-backend.onrender.com';

  const createOAuthUrl = (provider) => {
    const clientUrl = window.location.origin;
    const state = btoa(JSON.stringify({ clientUrl }));
    return `${apiBase}/api/auth/${provider}?state=${encodeURIComponent(state)}`;
  };

  const confirmError = useMemo(() => {
    if (!confirmPassword || !password) return '';
    if (confirmPassword !== password) return 'Passwords do not match';
    return '';
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!acceptedTerms) {
      setError('Please accept the Terms & Conditions and Privacy Policy.');
      return;
    }
    if (confirmPassword !== password) {
      setError('Passwords must match.');
      return;
    }
    const emailDomain = email.toLowerCase().split('@')[1];
    if (emailDomain && disposableEmailDomains.includes(emailDomain)) {
      setError('Please use a permanent email address.');
      return;
    }
    setSubmitting(true);
    try {
      const body = { name, email, password, role };
      if (phone.trim()) body.phone = phone.trim();
      const data = await apiRequest('/api/auth/signup', {
        method: 'POST',
        body
      });
      saveAuthToken(data.token);
      navigate(postLoginPath(searchParams));
    } catch (err) {
      if (err.message.includes('Disposable') || err.message.includes('disposable')) {
        setError('Please use a permanent email address.');
      } else {
        setError(err.message || 'Sign up failed');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <MobileBottomBarAuth page="signup" />
      <LuxuryAuthShell
        brandLogo={logo}
        title="Create Your Auction Account"
        subtitle="Join premium live vehicle auctions worldwide."
        footerLegal={
          <>
            Protected listings, verified bids, concierge support.
            <br />
            <Link
              to={searchParams.get('redirect') ? `/signin?redirect=${encodeURIComponent(searchParams.get('redirect'))}` : '/signin'}
              className="lux-accent-link"
              style={{ marginTop: '0.75rem', display: 'inline-block' }}
            >
              Already registered? Sign in
            </Link>
          </>
        }
      >
        <form onSubmit={handleSubmit} noValidate>
          <GlassTextField id="su-name" label="Full name" autoComplete="name" value={name} onChange={setName} required />
          <GlassTextField id="su-email" label="Email" type="email" autoComplete="email" value={email} onChange={setEmail} required />
          <GlassTextField id="su-phone" label="Phone number (optional)" type="tel" autoComplete="tel" value={phone} onChange={setPhone} />
          <PasswordField id="su-password" label="Password" autoComplete="new-password" value={password} onChange={setPassword} required />
          <PasswordStrength password={password} />
          <PasswordField id="su-confirm" label="Confirm password" autoComplete="new-password" value={confirmPassword} onChange={setConfirmPassword} error={confirmError} required />
          <AccountTypeToggle value={role} onChange={setRole} />

          <label className="lux-check">
            <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} required />
            I agree to the{' '}
            <a href="/terms-conditions.html" className="lux-accent-link">
              Terms &amp; Conditions
            </a>{' '}
            and{' '}
            <Link to="/privacy" className="lux-accent-link">
              Privacy Policy
            </Link>
            .
          </label>

          {error ? <div className="lux-banner-error">{error}</div> : null}

          <button type="submit" className="lux-btn-primary" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <SocialAuthButtons googleHref={createOAuthUrl('google')} facebookHref={createOAuthUrl('facebook')} variant="signup" />
      </LuxuryAuthShell>
      <div className="lux-mobile-bottom-spacer" aria-hidden />
    </div>
  );
};

export default Signup;
