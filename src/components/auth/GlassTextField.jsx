import React from 'react';

export default function GlassTextField({
  id,
  label,
  type = 'text',
  autoComplete,
  value,
  onChange,
  error,
  classNameWrap = ''
}) {
  const hasVal = Boolean(value && String(value).length > 0);
  return (
    <div className={`lux-field ${classNameWrap}`}>
      <div className={`lux-field-input-wrap ${hasVal ? 'lux-has-value' : ''}`}>
        <label className="lux-field-label" htmlFor={id}>
          {label}
        </label>
        <input
          id={id}
          type={type}
          className={`lux-field-input${type === 'password' ? '' : ''}`}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {error ? <p className="lux-field-error">{error}</p> : null}
    </div>
  );
}
