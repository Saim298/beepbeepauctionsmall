import React from 'react'

const size = 110
const stroke = 10
const center = size / 2
const radius = center - stroke
const circumference = 2 * Math.PI * radius

const RadialProgress = ({ value = 75, label = 'Progress', color = 'var(--primary-500)' }) => {
  const dash = (value / 100) * circumference
  return (
    <div className="radial">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={center} cy={center} r={radius} stroke="var(--glass-200)" strokeWidth={stroke} fill="none" />
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          transform={`rotate(-90 ${center} ${center})`}
        />
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      <div className="radial-center">
        <div className="radial-value">{value}%</div>
        <div className="radial-label">{label}</div>
      </div>
    </div>
  )
}

export default RadialProgress


