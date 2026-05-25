import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Upload, ChevronRight, TrendingUp, FileText, BarChart2, Star, Eye } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { analysisAPI } from '../services/api.js'
import ScoreHistory from '../components/charts/ScoreHistory.jsx'
import { formatDate, getScoreBg, getScoreColor, getScoreHex, truncateText } from '../utils/helpers.js'
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx'

function StatCard({ title, value, sub, color = 'lime', icon: Icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-teal border-2 border-dark-teal p-6 relative overflow-hidden group hover:border-lime transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-9 h-9 flex items-center justify-center"
          style={{ background: '#C8FF00' }}
        >
          <Icon className="w-4 h-4 text-dark-teal" />
        </div>
        <span className="text-cream/20 text-xs font-bold uppercase tracking-widest">
          {sub}
        </span>
      </div>
      <p
        className="font-display font-black leading-none mb-2"
        style={{ fontSize: 'clamp(40px, 5vw, 56px)', color: '#C8FF00' }}
      >
        {value ?? '—'}
      </p>
      <p className="text-cream/60 text-xs font-bold uppercase tracking-widest">{title}</p>
    </motion.div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await analysisAPI.getDashboard()
        setDashboard(res.data)
      } catch {
        // Use mock data if API fails
        setDashboard({
          totalResumes: 3,
          totalAnalyses: 7,
          avgAtsScore: 74,
          bestAtsScore: 87,
          recentAnalyses: [],
          scoreHistory: [],
        })
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'GOOD MORNING' : hour < 17 ? 'GOOD AFTERNOON' : 'GOOD EVENING'
  const firstName = user?.name?.split(' ')[0]?.toUpperCase() || 'THERE'

  if (loading) return <LoadingSpinner message="Loading dashboard..." />

  const stats = [
    { title: 'Total Resumes', value: dashboard?.totalResumes ?? 0, sub: 'uploaded', icon: FileText },
    { title: 'Total Analyses', value: dashboard?.totalAnalyses ?? 0, sub: 'completed', icon: BarChart2 },
    { title: 'Avg ATS Score', value: dashboard?.avgAtsScore ?? 0, sub: '/ 100', icon: TrendingUp },
    { title: 'Best ATS Score', value: dashboard?.bestAtsScore ?? 0, sub: 'record', icon: Star },
  ]

  return (
    <div className="space-y-8">
      {/* ── Greeting ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-dark-teal/50 dark:text-cream/50 text-sm font-bold uppercase tracking-widest mb-1"
          >
            {greeting},
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display font-black text-dark-teal dark:text-cream uppercase"
            style={{ fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 0.9 }}
          >
            {firstName}.
          </motion.h1>
        </div>
        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 px-6 py-3 font-display font-black text-sm uppercase tracking-widest text-dark-teal transition-all hover:bg-lime-dark shrink-0"
          style={{ background: '#C8FF00' }}
        >
          <Upload className="w-4 h-4" />
          ANALYZE NEW RESUME
        </Link>
      </div>

      {/* ── Stats Grid ────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* ── Chart + Quick Analyze ─────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ScoreHistory data={dashboard?.scoreHistory || []} />
        </div>

        {/* Quick Analyze CTA Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative overflow-hidden border-2 border-dark-teal p-8 flex flex-col justify-between"
          style={{ background: '#C8FF00', minHeight: 220 }}
        >
          <div>
            <p className="font-display font-black text-dark-teal text-xs uppercase tracking-[0.2em] mb-3">
              QUICK ACTION
            </p>
            <h3 className="font-display font-black text-dark-teal uppercase leading-tight" style={{ fontSize: 'clamp(28px, 3vw, 40px)' }}>
              ANALYZE NEW RESUME.
            </h3>
          </div>
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 px-5 py-3 bg-dark-teal text-cream font-display font-black text-sm uppercase tracking-widest hover:bg-teal-800 transition-colors self-start mt-4"
          >
            START NOW
            <ChevronRight className="w-4 h-4" />
          </Link>
          {/* Decorative */}
          <div className="absolute -right-8 -bottom-8 w-32 h-32 border-2 border-dark-teal/20" />
        </motion.div>
      </div>

      {/* ── Recent Analyses Table ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-dark-teal border-2 border-dark-teal"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h3 className="font-display font-black text-cream text-xl uppercase tracking-tight">
            RECENT ANALYSES
          </h3>
          <Link
            to="/history"
            className="text-lime text-xs font-bold uppercase tracking-widest hover:underline flex items-center gap-1"
          >
            VIEW ALL <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {!dashboard?.recentAnalyses?.length ? (
          <div className="px-6 py-12 text-center">
            <p className="font-display text-2xl text-cream/30 uppercase mb-3">NO ANALYSES YET</p>
            <p className="text-cream/40 text-sm mb-6">Upload a resume to get your first ATS score</p>
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-6 py-3 font-display font-black text-sm uppercase tracking-widest text-dark-teal"
              style={{ background: '#C8FF00' }}
            >
              <Upload className="w-4 h-4" />
              ANALYZE NOW
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {['Resume', 'Job Role', 'ATS Score', 'Date', ''].map(h => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-bold uppercase tracking-widest text-cream/40"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dashboard.recentAnalyses.map((item, i) => (
                  <tr
                    key={item._id || i}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/10 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-cream/60" />
                        </div>
                        <span className="text-cream text-sm font-medium truncate max-w-[160px]">
                          {truncateText(item.resumeName || item.resume?.originalName || 'Resume', 30)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-cream/70 text-sm">{item.jobRole}</td>
                    <td className="px-6 py-4">
                      <span
                        className="font-display font-black text-sm px-3 py-1 border-2 inline-block"
                        style={{
                          color: getScoreHex(item.atsScore),
                          borderColor: getScoreHex(item.atsScore),
                        }}
                      >
                        {item.atsScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-cream/50 text-sm">{formatDate(item.createdAt)}</td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/results/${item._id}`}
                        className="inline-flex items-center gap-1 text-lime text-xs font-bold uppercase tracking-widest hover:underline"
                      >
                        <Eye className="w-3 h-3" />
                        VIEW
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}
