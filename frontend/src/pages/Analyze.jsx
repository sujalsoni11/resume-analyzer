import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, ArrowRight, FileText, Trash2, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import DropZone from '../components/resume/DropZone.jsx'
import { resumeAPI, analysisAPI } from '../services/api.js'
import { formatDate, formatFileSize } from '../utils/helpers.js'
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx'

const JOB_ROLES = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Scientist',
  'Machine Learning Engineer',
  'DevOps Engineer',
  'Cloud Architect',
  'Product Manager',
  'UX Designer',
  'Data Analyst',
  'Cybersecurity Engineer',
  'Mobile Developer (iOS)',
  'Mobile Developer (Android)',
  'React Native Developer',
  'QA Engineer',
  'Site Reliability Engineer',
  'Database Administrator',
  'Business Analyst',
  'Scrum Master',
  'Technical Writer',
  'AI/ML Researcher',
  'Blockchain Developer',
  'Game Developer',
  'Embedded Systems Engineer',
]

const STEPS = [
  { num: 1, label: 'UPLOAD RESUME' },
  { num: 2, label: 'SELECT JOB ROLE' },
  { num: 3, label: 'ANALYZE' },
]

export default function Analyze() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1, 2, 3 (loading)
  const [file, setFile] = useState(null)
  const [uploadedResume, setUploadedResume] = useState(null) // after upload
  const [jobRole, setJobRole] = useState('')
  const [roleSearch, setRoleSearch] = useState('')
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [pastResumes, setPastResumes] = useState([])
  const [selectedPastResume, setSelectedPastResume] = useState(null)
  const [uploadingFile, setUploadingFile] = useState(false)

  useEffect(() => {
    // Load past resumes
    resumeAPI.getAll()
      .then(res => setPastResumes(res.data?.resumes || res.data || []))
      .catch(() => {})
  }, [])

  const filteredRoles = JOB_ROLES.filter(r =>
    r.toLowerCase().includes(roleSearch.toLowerCase())
  )

  const handleFileAccepted = (f) => {
    setFile(f)
    setSelectedPastResume(null)
  }

  const handleRemoveFile = () => {
    setFile(null)
    setUploadedResume(null)
  }

  const handleSelectPastResume = (resume) => {
    setSelectedPastResume(resume)
    setFile(null)
    setUploadedResume(resume)
  }

  const handleSelectRole = (role) => {
    setJobRole(role)
    setRoleDropdownOpen(false)
    setRoleSearch('')
  }

  const canProceedToStep2 = file || selectedPastResume
  const canAnalyze = (file || selectedPastResume) && jobRole

  const handleAnalyze = async () => {
    if (!canAnalyze) {
      toast.error('Please upload a resume and select a job role.')
      return
    }

    setAnalyzing(true)
    try {
      let resumeId = selectedPastResume?._id

      // Upload file if new file selected
      if (file && !uploadedResume) {
        setUploadingFile(true)
        const formData = new FormData()
        formData.append('resume', file)
        const uploadRes = await resumeAPI.upload(formData)
        resumeId = uploadRes.data?.resume?._id || uploadRes.data?.resume?.id || uploadRes.data?._id || uploadRes.data?.id
        setUploadingFile(false)
      }

      if (!resumeId) {
        toast.error('Resume upload failed. Please try again.')
        setAnalyzing(false)
        return
      }

      const res = await analysisAPI.create({ resumeId, jobRole })
      const analysisId = res.data?.analysis?._id || res.data?._id
      toast.success('Analysis complete!')
      navigate(`/results/${analysisId}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed. Please try again.')
      setAnalyzing(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* ── Header ──────────────────────────────────────── */}
      <div>
        <h1
          className="font-display font-black text-dark-teal dark:text-cream uppercase"
          style={{ fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 0.9 }}
        >
          ANALYZE YOUR
          <br />
          <span style={{ WebkitTextStroke: '3px #0D3333', color: 'transparent' }}>
            RESUME.
          </span>
        </h1>
        <p className="text-dark-teal/60 dark:text-cream/60 text-sm mt-4">
          Get your ATS score, skill gap analysis, and career roadmap in under 30 seconds.
        </p>
      </div>

      {/* ── Step indicators ──────────────────────────────── */}
      <div className="flex items-center gap-0">
        {STEPS.map(({ num, label }, i) => (
          <React.Fragment key={num}>
            <div className="flex items-center gap-2">
              <div
                className={[
                  'w-8 h-8 flex items-center justify-center font-display font-black text-sm transition-all',
                  num <= (canProceedToStep2 ? (jobRole ? 3 : 2) : 1)
                    ? 'bg-lime text-dark-teal'
                    : 'border-2 border-dark-teal/30 text-dark-teal/40 dark:border-cream/30 dark:text-cream/40',
                ].join(' ')}
              >
                {num}
              </div>
              <span className="hidden sm:block text-xs font-bold uppercase tracking-widest text-dark-teal/50 dark:text-cream/50">
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-px bg-dark-teal/20 dark:bg-cream/20 mx-3" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ── Step 1: Upload ───────────────────────────────── */}
      <div className="border-2 border-dark-teal dark:border-cream/20 p-6 bg-white dark:bg-dark-teal">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-8 flex items-center justify-center font-display font-black text-sm bg-lime text-dark-teal">
            1
          </span>
          <h2 className="font-display font-black text-dark-teal dark:text-cream text-2xl uppercase">
            UPLOAD YOUR RESUME
          </h2>
        </div>

        <DropZone
          onFileAccepted={handleFileAccepted}
          file={file}
          onRemove={handleRemoveFile}
        />

        {/* Past Resumes */}
        {pastResumes.length > 0 && !file && (
          <div className="mt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px flex-1 bg-dark-teal/10 dark:bg-cream/10" />
              <span className="text-xs font-bold uppercase tracking-widest text-dark-teal/40 dark:text-cream/40">
                OR USE PREVIOUS RESUME
              </span>
              <div className="h-px flex-1 bg-dark-teal/10 dark:bg-cream/10" />
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {pastResumes.map((r) => (
                <button
                  key={r._id}
                  onClick={() => handleSelectPastResume(r)}
                  className={[
                    'w-full flex items-center gap-3 p-3 border-2 text-left transition-all',
                    selectedPastResume?._id === r._id
                      ? 'border-lime bg-lime/5'
                      : 'border-dark-teal/20 dark:border-cream/10 hover:border-dark-teal/40 dark:hover:border-cream/20',
                  ].join(' ')}
                >
                  <FileText className="w-4 h-4 text-dark-teal/60 dark:text-cream/60 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark-teal dark:text-cream truncate">
                      {r.originalName || r.filename}
                    </p>
                    <p className="text-xs text-dark-teal/50 dark:text-cream/50 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {formatDate(r.createdAt)} · {formatFileSize(r.size)}
                    </p>
                  </div>
                  {selectedPastResume?._id === r._id && (
                    <span className="text-xs font-bold text-lime uppercase">SELECTED</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Step 2: Job Role ─────────────────────────────── */}
      <AnimatePresence>
        {canProceedToStep2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-2 border-dark-teal dark:border-cream/20 p-6 bg-white dark:bg-dark-teal"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-8 flex items-center justify-center font-display font-black text-sm bg-lime text-dark-teal">
                2
              </span>
              <h2 className="font-display font-black text-dark-teal dark:text-cream text-2xl uppercase">
                SELECT JOB ROLE
              </h2>
            </div>

            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(prev => !prev)}
                className="w-full flex items-center justify-between px-4 py-3 border-2 border-dark-teal dark:border-cream/20 bg-cream dark:bg-teal-800 text-dark-teal dark:text-cream text-sm font-medium transition-colors hover:border-lime focus:outline-none focus:border-lime"
              >
                <span className={jobRole ? '' : 'text-dark-teal/40 dark:text-cream/40'}>
                  {jobRole || 'Select your target job role...'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${roleDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {roleDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scaleY: 0.95 }}
                    animate={{ opacity: 1, y: 0, scaleY: 1 }}
                    exit={{ opacity: 0, y: 4, scaleY: 0.95 }}
                    style={{ transformOrigin: 'top' }}
                    className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-dark-teal border-2 border-dark-teal dark:border-cream/20 z-30 max-h-60 overflow-hidden"
                  >
                    {/* Search */}
                    <div className="sticky top-0 border-b border-dark-teal/10 dark:border-cream/10 bg-white dark:bg-dark-teal px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Search className="w-4 h-4 text-dark-teal/40 dark:text-cream/40 shrink-0" />
                        <input
                          type="text"
                          value={roleSearch}
                          onChange={e => setRoleSearch(e.target.value)}
                          placeholder="Search roles..."
                          className="flex-1 bg-transparent text-sm text-dark-teal dark:text-cream placeholder-dark-teal/40 dark:placeholder-cream/40 focus:outline-none"
                          autoFocus
                        />
                      </div>
                    </div>

                    <div className="overflow-y-auto max-h-48">
                      {filteredRoles.length === 0 ? (
                        <p className="text-center py-4 text-dark-teal/40 dark:text-cream/40 text-sm">
                          No roles found
                        </p>
                      ) : (
                        filteredRoles.map(role => (
                          <button
                            key={role}
                            onClick={() => handleSelectRole(role)}
                            className={[
                              'w-full text-left px-4 py-2.5 text-sm font-medium transition-colors',
                              jobRole === role
                                ? 'bg-lime text-dark-teal font-bold'
                                : 'text-dark-teal dark:text-cream hover:bg-dark-teal/5 dark:hover:bg-cream/5',
                            ].join(' ')}
                          >
                            {role}
                          </button>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Popular roles quick select */}
            {!jobRole && (
              <div className="mt-3 flex flex-wrap gap-2">
                {['Software Engineer', 'Data Scientist', 'Product Manager', 'UX Designer', 'DevOps Engineer'].map(r => (
                  <button
                    key={r}
                    onClick={() => setJobRole(r)}
                    className="text-xs font-bold uppercase tracking-wider px-3 py-1 border border-dark-teal/30 dark:border-cream/20 text-dark-teal/60 dark:text-cream/60 hover:border-lime hover:text-lime transition-colors"
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Step 3: Analyze Button ───────────────────────── */}
      <AnimatePresence>
        {canAnalyze && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full py-5 font-display font-black text-lg uppercase tracking-widest text-dark-teal flex items-center justify-center gap-3 transition-all hover:bg-lime-dark disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ background: '#C8FF00' }}
            >
              {analyzing ? (
                <>
                  <span className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.span
                        key={i}
                        className="w-2 h-2 bg-dark-teal block"
                        animate={{ scaleY: [1, 2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }}
                      />
                    ))}
                  </span>
                  {uploadingFile ? 'UPLOADING RESUME...' : 'AI IS ANALYZING YOUR RESUME...'}
                </>
              ) : (
                <>
                  ANALYZE MY RESUME
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Summary */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-dark-teal/50 dark:text-cream/50 font-medium">
              <span>
                📄 {file?.name || selectedPastResume?.originalName || 'Resume'}
              </span>
              <span>→</span>
              <span>🎯 {jobRole}</span>
              <span>→</span>
              <span>⚡ Results in ~30s</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
