import React from 'react'
import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts'

const GoalRadial = ({ value = 75, label = 'Goal', color = 'var(--primary-500)' }) => {
  const data = [{ name: label, value }]
  return (
    <div className="goal-radial">
      <RadialBarChart
        width={130}
        height={130}
        cx={65}
        cy={65}
        innerRadius={44}
        outerRadius={60}
        barSize={12}
        data={data}
        startAngle={90}
        endAngle={-270}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
        <RadialBar dataKey="value" cornerRadius={16} fill={color} background={{ fill: 'var(--glass-200)' }} />
        <text x={65} y={60} textAnchor="middle" className="radial-value" fill="var(--text)" style={{ fontWeight: 800, fontSize: 18 }}>
          {value}%
        </text>
        <text x={65} y={82} textAnchor="middle" className="radial-label" fill="var(--muted)" style={{ fontSize: 11 }}>
          {label}
        </text>
      </RadialBarChart>
    </div>
  )
}

export default GoalRadial


