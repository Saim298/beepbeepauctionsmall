import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/client';
import logo from '../image/logo.png';
import { MobileBottomBarAuth } from '../components/MobileBottomBar';
import LuxuryAuthShell from '../components/auth/LuxuryAuthShell';
import GlassTextField from '../components/auth/GlassTextField';
import PasswordField from '../components/auth/PasswordField';
import PasswordStrength from '../components/auth/PasswordStrength';
import { useNotify } from '../context/NotificationContext.jsx';
import '../styles/authPremium.css';
import './forgot-password.css';

const STEPS = ['email', 'otp', 'password'];

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { notify } = useNotify();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const stepIndex = STEPS.indexOf(step);

  const confirmError = useMemo(() => {
    if (!confirmPassword || !password) return '';
    if (confirmPassword !== password) return 'Passwords do not match';
    return '';
  }, [password, confirmPassword]);

  const shellMeta = useMemo(() => {
    if (step === 'email') {
      return {
        title: 'Forgot password',
        subtitle: 'Enter your account email. We will send a 6-digit verification code if an account exists.'
      };
    }
    if (step === 'otp') {
      return {
        title: 'Check your email',
        subtitle: `Enter the 6-digit code we sent to ${email}.`
      };
    }
    return {
      title: 'Set a new password',
      subtitle: 'Choose a strong password with at least 8 characters.'
    };
  }, [step, email]);

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const data = await apiRequest('/api/auth/password/forgot', {
        method: 'POST',
        body: { email: email.trim() }
      });
      notify({
        title: 'Check your inbox',
        message: data.message || 'If an account exists, we sent a verification code.',
        severity: 'success'
      });
      setStep('otp');
    } catch (err) {
      setError(err.message || 'Could not send code.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    const digits = code.replace(/\D/g, '').slice(0, 6);
    if (digits.length !== 6) {
      setError('Enter the 6-digit code from your email.');
      return;
    }
    setSubmitting(true);
    try {
      const data = await apiRequest('/api/auth/password/verify-otp', {
        method: 'POST',
        body: { email: email.trim(), code: digits }
      });
      setResetToken(data.resetToken);
      setStep('password');
    } catch (err) {
      setError(err.message || 'Invalid code.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords must match.');
      return;
    }
    setSubmitting(true);
    try {
      await apiRequest('/api/auth/password/reset', {
        method: 'POST',
        token: resetToken,
        body: { password }
      });
      notify({
        title: 'Password updated',
        message: 'Sign in with your new password.',
        severity: 'success'
      });
      navigate('/signin', { replace: true });
    } catch (err) {
      setError(err.message || 'Could not reset password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <MobileBottomBarAuth page="signin" />
      <LuxuryAuthShell
        brandLogo={logo}
        title={shellMeta.title}
        subtitle={shellMeta.subtitle}
        footerLegal={
          <Link to="/signin" className="lux-accent-link">
            Back to sign in
          </Link>
        }
      >
        <div className="fp-steps" aria-hidden>
          {STEPS.map((s, i) => (
            <span key={s} className={`fp-step${i <= stepIndex ? ' fp-step--active' : ''}`} />
          ))}
        </div>

        {step === 'email' ? (
          <form onSubmit={handleRequestCode} noValidate>
            <GlassTextField
              id="fp-email"
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={setEmail}
              required
            />
            {error ? <div className="lux-banner-error">{error}</div> : null}
            <button type="submit" className="lux-btn-primary" disabled={submitting}>
              {submitting ? 'Sending…' : 'Send verification code'}
            </button>
          </form>
        ) : null}

        {step === 'otp' ? (
          <form onSubmit={handleVerifyOtp} noValidate>
            <GlassTextField
              id="fp-code"
              label="6-digit code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(v) => setCode(String(v).replace(/\D/g, '').slice(0, 6))}
              required
            />
            {error ? <div className="lux-banner-error">{error}</div> : null}
            <button type="submit" className="lux-btn-primary" disabled={submitting}>
              {submitting ? 'Verifying…' : 'Verify code'}
            </button>
            <button
              type="button"
              className="lux-btn-ghost fp-resend"
              disabled={submitting}
              onClick={() => {
                setStep('email');
                setCode('');
                setError('');
              }}
            >
              Use a different email
            </button>
          </form>
        ) : null}

        {step === 'password' ? (
          <form onSubmit={handleResetPassword} noValidate>
            <PasswordField
              id="fp-password"
              label="New password"
              autoComplete="new-password"
              value={password}
              onChange={setPassword}
              required
            />
            <PasswordStrength password={password} />
            <PasswordField
              id="fp-confirm"
              label="Confirm password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              error={confirmError}
              required
            />
            {error ? <div className="lux-banner-error">{error}</div> : null}
            <button type="submit" className="lux-btn-primary" disabled={submitting}>
              {submitting ? 'Saving…' : 'Update password'}
            </button>
          </form>
        ) : null}
      </LuxuryAuthShell>
      <div className="lux-mobile-bottom-spacer" aria-hidden />
    </div>
  );
}
