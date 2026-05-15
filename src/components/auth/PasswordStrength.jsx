import React, { useMemo } from 'react';
import { FiCheck } from 'react-icons/fi';

function analyze(password = '') {
  const len = password.length >= 8;
  const upper = /[A-Z]/.test(password);
  const lower = /[a-z]/.test(password);
  const digit = /\d/.test(password);
  const sym = /[^A-Za-z0-9]/.test(password);
  const rules = [
    { key: 'len', ok: len, label: '8+ characters' },
    { key: 'upper', ok: upper, label: 'Uppercase letter' },
    { key: 'lower', ok: lower, label: 'Lowercase letter' },
    { key: 'digit', ok: digit, label: 'Number' },
    { key: 'sym', ok: sym, label: 'Special character' }
  ];
  const score = rules.filter((r) => r.ok).length;
  let labelText = 'Keep typing…';
  if (!password) labelText = 'Password strength';
  else if (score <= 2) labelText = 'Weak';
  else if (score <= 4) labelText = 'Better';
  else labelText = 'Strong';
  const segments = score === 0 ? 0 : Math.min(4, Math.ceil((score / 5) * 4));
  return { rules, score, labelText, segments };
}

export default function PasswordStrength({ password }) {
  const r = useMemo(() => analyze(password), [password]);
  if (!password) return null;
  return (
    <div className="lux-strength">
      <div className="lux-strength-bar" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`lux-strength-seg${i < r.segments ? ' lux-fill' : ''}`} />
        ))}
      </div>
      <span className="lux-strength-label">{r.labelText}</span>
      <ul className="lux-strength-rules">
        {r.rules.map((rule) => (
          <li key={rule.key} className={rule.ok ? 'lux-rule-ok' : ''}>
            {rule.ok ? <FiCheck size={12} /> : <span style={{ opacity: 0.4 }}>·</span>} {rule.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
