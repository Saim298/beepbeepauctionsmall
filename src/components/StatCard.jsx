import React, { useMemo } from 'react'

const StatsCard = ({ title, value, diff, trend = 'up', currency = false, data = [] }) => {
  const pathPoints = useMemo(() => {
    if (!data.length) return ''
    const width = 120
    const height = 40
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = Math.max(1, max - min)
    const step = width / (data.length - 1)
    return data
      .map((d, i) => {
        const x = i * step
        const y = height - ((d - min) / range) * height
        return `${x},${y}`
      })
      .join(' ')
  }, [data])

  const trendColor = trend === 'up' ? 'var(--success-500)' : 'var(--danger-500)'
  const trendSign = trend === 'up' ? '+' : ''

  return (
    <div className="panel glass stat-card">
      <div className="stat-header">
        <span className="muted">{title}</span>
        <span className="badge soft">{currency ? 'USD' : 'Live'}</span>
      </div>
      <div className="stat-body">
        <div className="stat-main">
          <div className="stat-value">{value}</div>
          <div className="stat-diff" style={{ color: trendColor }}>
            <svg width="12" height="12" viewBox="0 0 24 24" className={`trend ${trend}`}>
              {trend === 'up' ? (
                <path fill={trendColor} d="M3 17l6-6 4 4 7-7v6h2V5h-9v2h6l-6 6-4-4-8 8z" />
              ) : (
                <path fill={trendColor} d="M21 7l-6 6-4-4-7 7V10H2v9h9v-2H5l6-6 4 4 8-8z" />
              )}
            </svg>
            <span>{trendSign}{diff}</span>
          </div>
        </div>
        <svg className="spark" viewBox="0 0 120 40" preserveAspectRatio="none">
          <defs>
            <linearGradient id="sparkGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--primary-500)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="var(--primary-500)" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <polyline className="spark-line" points={pathPoints} fill="none" stroke="var(--primary-500)" strokeWidth="2" />
          <polyline className="spark-fill" points={`0,40 ${pathPoints} 120,40`} fill="url(#sparkGrad)" stroke="none" />
        </svg>
      </div>
    </div>
  )
}

export default StatsCard


