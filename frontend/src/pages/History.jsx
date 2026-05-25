import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye, Bookmark, BookmarkCheck, Trash2, Filter, Search,
  X, FileText, ChevronDown, Calendar
} from 'lucide-react'
import toast from 'react-hot-toast'
import { analysisAPI } from '../services/api.js'
import { formatDate, getScoreHex, getScoreRating, truncateText } from '../utils/helpers.js'
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx'

const JOB_ROLES = [
  'All Roles', 'Software Engineer', 'Frontend Developer', 'Backend Developer',
  'Data Scientist', 'Machine Learning Engineer', 'DevOps Engineer', 'Product Manager',
  'UX Designer', 'Data Analyst', 'Cloud Architect',
]

function AnalysisCard({ item, onDelete, onBookmark }) {
  const color = getScoreHex(item.atsScore)
  const rating = getScoreRating(item.atsScore)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm('Delete this analysis?')) return
    setDeleting(true)
    try {
      await analysisAPI.delete(item._id)
      onDelete(item._id)
      toast.success('Analysis deleted.')
    } catch {
      toast.error('Failed to delete analysis.')
      setDeleting(false)
    }
  }

  const handleBookmark = async () => {
    try {
      await analysisAPI.toggleBookmark(item._id)
      onBookmark(item._id, !item.isBookmarked)
      toast.success(item.isBookmarked ? 'Removed from bookmarks' : 'Bookmarked!')
    } catch {
      toast.error('Failed to update bookmark.')
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="bg-dark-teal border-2 border-dark-teal hover:border-lime transition-colors p-5 group"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-black text-cream text-xl uppercase leading-tight mb-1">
            {item.jobRole}
          </h3>
          <div className="flex items-center gap-2 text-cream/50 text-xs">
            <FileText className="w-3.5 h-3.5" />
            <span className="truncate max-w-[200px]">
              {truncateText(item.resume?.originalName || item.resumeName || 'Resume.pdf', 35)}
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="font-display font-black text-4xl leading-none" style={{ color }}>
            {item.atsScore}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color }}>
            {rating}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 text-cream/40 text-xs mb-4">
        <Calendar className="w-3 h-3" />
        {formatDate(item.createdAt)}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/10">
        <div className="flex items-center gap-2">
          <Link
            to={`/results/${item._id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-dark-teal transition-all hover:bg-lime-dark"
            style={{ background: '#C8FF00' }}
          >
            <Eye className="w-3.5 h-3.5" />
            VIEW
          </Link>
          <button
            onClick={handleBookmark}
            className="p-1.5 text-cream/40 hover:text-lime transition-colors"
            title={item.isBookmarked ? 'Remove bookmark' : 'Bookmark'}
          >
            {item.isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 text-lime" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-1.5 text-cream/20 hover:text-red-400 transition-colors disabled:opacity-50"
          title="Delete analysis"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

export default function History({ bookmarksOnly = false }) {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All Roles')
  const [scoreMin, setScoreMin] = useState(0)
  const [scoreMax, setScoreMax] = useState(100)
  const [showFilters, setShowFilters] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = bookmarksOnly
        ? await analysisAPI.getBookmarks()
        : await analysisAPI.getAll()
      setAnalyses(res.data?.analyses || res.data || [])
    } catch {
      setAnalyses([])
    } finally {
      setLoading(false)
    }
  }, [bookmarksOnly])

  useEffect(() => { fetchData() }, [fetchData])

  const handleDelete = (deletedId) => {
    setAnalyses(prev => prev.filter(a => a._id !== deletedId))
  }

  const handleBookmark = (id, newState) => {
    setAnalyses(prev => prev.map(a =>
      a._id === id ? { ...a, isBookmarked: newState } : a
    ))
  }

  const filtered = analyses.filter(a => {
    const matchSearch = !search ||
      a.jobRole?.toLowerCase().includes(search.toLowerCase()) ||
      a.resume?.originalName?.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'All Roles' || a.jobRole === roleFilter
    const matchScore = a.atsScore >= scoreMin && a.atsScore <= scoreMax
    return matchSearch && matchRole && matchScore
  })

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────── */}
      <div>
        <h1
          className="font-display font-black text-dark-teal dark:text-cream uppercase"
          style={{ fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 0.9 }}
        >
          {bookmarksOnly ? (
            <>SAVED<br /><span style={{ WebkitTextStroke: '3px #0D3333', color: 'transparent' }}>ANALYSES.</span></>
          ) : (
            <>ANALYSIS<br /><span style={{ WebkitTextStroke: '3px #0D3333', color: 'transparent' }}>HISTORY.</span></>
          )}
        </h1>
        <p className="text-dark-teal/50 dark:text-cream/50 text-sm mt-2">
          {filtered.length} {filtered.length === 1 ? 'result' : 'results'} found
        </p>
      </div>

      {/* ── Search + Filter Bar ──────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-teal/40 dark:text-cream/40" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by role or filename..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-dark-teal border-2 border-dark-teal dark:border-cream/20 text-dark-teal dark:text-cream placeholder-dark-teal/30 dark:placeholder-cream/30 text-sm focus:outline-none focus:border-lime transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-teal/40 hover:text-dark-teal dark:text-cream/40 dark:hover:text-cream"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(prev => !prev)}
          className={[
            'flex items-center gap-2 px-4 py-2.5 border-2 text-sm font-bold uppercase tracking-widest transition-all',
            showFilters
              ? 'border-lime text-lime'
              : 'border-dark-teal dark:border-cream/20 text-dark-teal dark:text-cream hover:border-lime hover:text-lime',
          ].join(' ')}
        >
          <Filter className="w-4 h-4" />
          FILTERS
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-dark-teal border-2 border-dark-teal dark:border-cream/20 p-5"
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Role filter */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-dark-teal/60 dark:text-cream/60 mb-2">
                  Job Role
                </label>
                <select
                  value={roleFilter}
                  onChange={e => setRoleFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-cream dark:bg-teal-800 border-2 border-dark-teal/30 dark:border-cream/20 text-dark-teal dark:text-cream text-sm focus:outline-none focus:border-lime"
                >
                  {JOB_ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>

              {/* Score range */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-dark-teal/60 dark:text-cream/60 mb-2">
                  Min Score: <span className="text-lime">{scoreMin}</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={scoreMin}
                  onChange={e => setScoreMin(Number(e.target.value))}
                  className="w-full accent-lime"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-dark-teal/60 dark:text-cream/60 mb-2">
                  Max Score: <span className="text-lime">{scoreMax}</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={scoreMax}
                  onChange={e => setScoreMax(Number(e.target.value))}
                  className="w-full accent-lime"
                />
              </div>
            </div>

            <button
              onClick={() => { setRoleFilter('All Roles'); setScoreMin(0); setScoreMax(100); setSearch('') }}
              className="mt-4 text-xs font-bold uppercase tracking-widest text-dark-teal/50 dark:text-cream/50 hover:text-lime transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" /> CLEAR FILTERS
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Results Grid ─────────────────────────────────── */}
      {loading ? (
        <LoadingSpinner message="Loading analyses..." />
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-dark-teal/20 dark:border-cream/10">
          <p className="font-display text-3xl text-dark-teal/30 dark:text-cream/30 uppercase mb-3">
            {bookmarksOnly ? 'NO SAVED ANALYSES' : 'NO ANALYSES YET'}
          </p>
          <p className="text-dark-teal/40 dark:text-cream/40 text-sm mb-6">
            {bookmarksOnly
              ? 'Bookmark analyses to save them here'
              : analyses.length > 0
              ? 'Try adjusting your filters'
              : 'Upload your resume to get started'}
          </p>
          {!bookmarksOnly && analyses.length === 0 && (
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-6 py-3 font-display font-black text-sm uppercase tracking-widest text-dark-teal"
              style={{ background: '#C8FF00' }}
            >
              ANALYZE NOW
            </Link>
          )}
        </div>
      ) : (
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence>
            {filtered.map(item => (
              <AnalysisCard
                key={item._id}
                item={item}
                onDelete={handleDelete}
                onBookmark={handleBookmark}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
