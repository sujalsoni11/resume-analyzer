import React from 'react'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-cream border-2 border-dark-teal p-3 text-xs font-bold">
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="w-3 h-3 inline-block"
              style={{ background: entry.color }}
            />
            <span className="uppercase tracking-wider text-dark-teal">
              {entry.name}: {entry.value}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function SkillRadar({ data = [] }) {
  // data shape: [{ skill: 'React', found: 80, required: 90 }, ...]
  const chartData = data.length > 0 ? data : [
    { skill: 'React', found: 70, required: 90 },
    { skill: 'Node.js', found: 60, required: 80 },
    { skill: 'SQL', found: 85, required: 70 },
    { skill: 'Docker', found: 20, required: 60 },
    { skill: 'AWS', found: 40, required: 75 },
    { skill: 'TypeScript', found: 55, required: 85 },
  ]

  return (
    <div className="bg-dark-teal border-2 border-dark-teal p-6">
      <h3 className="font-display text-xl font-black text-cream uppercase tracking-tight mb-6">
        SKILLS RADAR
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={chartData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid stroke="rgba(255,255,255,0.15)" />
          <PolarAngleAxis
            dataKey="skill"
            tick={{
              fill: '#F2EFE4',
              fontSize: 11,
              fontWeight: 700,
              fontFamily: 'Inter',
              textTransform: 'uppercase',
            }}
          />
          <Radar
            name="Your Skills"
            dataKey="found"
            stroke="#C8FF00"
            fill="#C8FF00"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Radar
            name="Required"
            dataKey="required"
            stroke="rgba(255,255,255,0.5)"
            fill="rgba(255,255,255,0.1)"
            fillOpacity={0.2}
            strokeWidth={1}
            strokeDasharray="4 4"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              color: '#F2EFE4',
              fontSize: '11px',
              fontWeight: '700',
              fontFamily: 'Inter',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
