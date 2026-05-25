import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { formatDate } from '../../utils/helpers.js'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-cream border-2 border-dark-teal p-3">
        <p className="font-bold text-dark-teal text-xs uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="font-display text-2xl font-black text-dark-teal">
          {payload[0].value}
          <span className="text-sm font-normal font-body text-dark-teal/60"> / 100</span>
        </p>
      </div>
    )
  }
  return null
}

export default function ScoreHistory({ data = [] }) {
  const chartData = data.length > 0
    ? data.map(d => ({
        date: formatDate(d.date || d.createdAt),
        score: d.atsScore || d.score,
        role: d.jobRole,
      }))
    : [
        { date: 'Jan 1', score: 45 },
        { date: 'Jan 8', score: 52 },
        { date: 'Jan 15', score: 61 },
        { date: 'Jan 22', score: 68 },
        { date: 'Jan 29', score: 74 },
        { date: 'Feb 5', score: 82 },
        { date: 'Feb 12', score: 87 },
      ]

  return (
    <div className="bg-dark-teal border-2 border-dark-teal p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-xl font-black text-cream uppercase tracking-tight">
          ATS SCORE HISTORY
        </h3>
        <span className="text-lime text-xs font-bold uppercase tracking-widest">
          +{Math.max(0, chartData[chartData.length - 1]?.score - chartData[0]?.score)} pts
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="limeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C8FF00" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#C8FF00" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis
            dataKey="date"
            tick={{ fill: 'rgba(242,239,228,0.5)', fontSize: 10, fontWeight: 600, fontFamily: 'Inter' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: 'rgba(242,239,228,0.5)', fontSize: 10, fontWeight: 600, fontFamily: 'Inter' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#C8FF00"
            strokeWidth={2.5}
            fill="url(#limeGradient)"
            dot={{ fill: '#C8FF00', strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, fill: '#C8FF00', strokeWidth: 2, stroke: '#0D3333' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
