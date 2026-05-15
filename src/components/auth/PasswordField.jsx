import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function PasswordField({ id, label, autoComplete, value, onChange, error, required }) {
  const [show, setShow] = useState(false);
  const hasVal = Boolean(value && String(value).length > 0);
  const type = show ? 'text' : 'password';

  return (
    <div className="lux-field">
      <div className={`lux-field-input-wrap ${hasVal ? 'lux-has-value' : ''}`} style={{ position: 'relative' }}>
        <label className="lux-field-label" htmlFor={id}>
          {label}
        </label>
        <input
          id={id}
          type={type}
          className="lux-field-input lux-has-toggle"
          autoComplete={autoComplete}
          value={value}
          required={required}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          className="lux-password-toggle"
          onClick={() => setShow((v) => !v)}
          tabIndex={-1}
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <FiEyeOff size={20} /> : <FiEye size={20} />}
        </button>
      </div>
      {error ? <p className="lux-field-error">{error}</p> : null}
    </div>
  );
}
