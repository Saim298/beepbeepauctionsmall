import React from 'react';

/**
 * UI labels → MongoDB roles: Buyer → buyer, Dealer → dealer, Seller → vendor
 */
const OPTIONS = [
  { role: 'buyer', label: 'Buyer' },
  { role: 'dealer', label: 'Dealer' },
  { role: 'vendor', label: 'Seller' }
];

export default function AccountTypeToggle({ value, onChange }) {
  return (
    <div>
      <p style={{ margin: '0 0 0.5rem', fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, color: 'rgba(255,255,255,0.45)' }}>
        Account type
      </p>
      <div className="lux-chip-row" role="group" aria-label="Account type">
        {OPTIONS.map((o) => {
          const active = value === o.role;
          return (
            <button
              key={o.role}
              type="button"
              className={`lux-chip${active ? ' lux-chip-active' : ''}`}
              onClick={() => onChange(o.role)}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
