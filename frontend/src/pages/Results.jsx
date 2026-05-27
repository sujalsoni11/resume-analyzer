import React, { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Download, Bookmark, BookmarkCheck, ArrowLeft, FileText,
  ChevronRight, Copy, CheckCheck, Lightbulb, Target, Brain,
  MessageSquare, Map, BarChart2, AlertTriangle, Building2, ExternalLink
} from 'lucide-react'
import toast from 'react-hot-toast'
import { analysisAPI } from '../services/api.js'
import { formatDateTime, getScoreHex, getScoreRating, getPriorityStyle, getDifficultyStyle, truncateText } from '../utils/helpers.js'
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx'
import SkillRadar from '../components/charts/SkillRadar.jsx'
import Badge from '../components/ui/Badge.jsx'

/* ─── Circular Score Display ─────────────────────────────── */
function ScoreCircle({ score }) {
  const color = getScoreHex(score)
  const rating = getScoreRating(score)
  const circumference = 2 * Math.PI * 52

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
          <motion.circle
            cx="60" cy="60" r="52"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="square"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
            transition={{ duration: 1.4, ease: 'easeOut', delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display font-black text-5xl leading-none" style={{ color }}>
            {score}
          </span>
          <span className="text-cream/50 text-xs font-bold mt-1">/ 100</span>
        </div>
      </div>
      <span
        className="font-display font-black text-xs px-4 py-1.5 border-2 uppercase tracking-widest"
        style={{ color, borderColor: color }}
      >
        {rating}
      </span>
    </div>
  )
}

/* ─── Section Progress Bar ───────────────────────────────── */
function SectionBar({ label, value, color }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-cream/70 font-medium">{label}</span>
        <span className="font-bold" style={{ color: getScoreHex(value) }}>{value}%</span>
      </div>
      <div className="h-1.5 bg-white/10">
        <motion.div
          className="h-full"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          style={{ background: getScoreHex(value) }}
        />
      </div>
    </div>
  )
}

/* ─── Tabs ───────────────────────────────────────────────── */
const TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart2 },
  { id: 'suggestions', label: 'Suggestions', icon: Lightbulb },
  { id: 'skills', label: 'Skills', icon: Target },
  { id: 'interview', label: 'Interview', icon: MessageSquare },
  { id: 'coverletter', label: 'Cover Letter', icon: FileText },
  { id: 'roadmap', label: 'Roadmap', icon: Map },
  { id: 'companies', label: 'Companies', icon: Building2 },
]

/* ─── Tier Badge Styles ──────────────────────────────────── */
const TIER_STYLES = {
  'Top Tier': { bg: 'bg-yellow-400/15', text: 'text-yellow-300', border: 'border-yellow-400/30' },
  'Mid Tier': { bg: 'bg-blue-400/15',   text: 'text-blue-300',   border: 'border-blue-400/30'   },
  'Startup':  { bg: 'bg-emerald-400/15',text: 'text-emerald-300',border: 'border-emerald-400/30'},
}

/* ─── Company Card ───────────────────────────────────────── */
function CompanyCard({ company, index }) {
  const [logoErr, setLogoErr] = React.useState(false)
  const tier = TIER_STYLES[company.tier] || TIER_STYLES['Startup']
  const scoreColor = company.matchScore >= 75 ? '#C8FF00' : company.matchScore >= 50 ? '#FCD34D' : '#F87171'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="group bg-dark-teal border-2 border-dark-teal p-5 flex flex-col gap-4 hover:border-lime/40 transition-all duration-300"
      style={{ boxShadow: 'none' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 24px rgba(200,255,0,0.08)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      {/* ── Logo + Name ── */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
          {!logoErr ? (
            <img
              src={`https://logo.clearbit.com/${company.domain}`}
              alt={company.name}
              className="w-8 h-8 object-contain"
              onError={() => setLogoErr(true)}
            />
          ) : (
            <Building2 className="w-5 h-5 text-cream/40" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-black text-cream text-sm uppercase leading-tight truncate">{company.name}</p>
          <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest border ${tier.bg} ${tier.text} ${tier.border}`}>
            {company.tier}
          </span>
        </div>
        <div className="text-right shrink-0">
          <p className="font-display font-black text-2xl leading-none" style={{ color: scoreColor }}>{company.matchScore}</p>
          <p className="text-cream/40 text-[10px] uppercase tracking-wider mt-0.5">Match</p>
        </div>
      </div>

      {/* ── Match Bar ── */}
      <div className="h-1 bg-white/10 w-full">
        <motion.div
          className="h-full"
          initial={{ width: 0 }}
          animate={{ width: `${company.matchScore}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.06 + 0.2 }}
          style={{ background: scoreColor }}
        />
      </div>

      {/* ── Reason ── */}
      <p className="text-cream/60 text-xs leading-relaxed">{company.reason}</p>

      {/* ── Roles ── */}
      <div className="flex flex-wrap gap-1.5">
        {(company.roles || []).map(role => (
          <span key={role} className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide border border-white/10 text-cream/50">
            {role}
          </span>
        ))}
      </div>

      {/* ── Apply Button ── */}
      <a
        href={company.applyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 py-2.5 font-display font-black text-xs uppercase tracking-widest text-dark-teal transition-all hover:bg-lime-dark mt-auto"
        style={{ background: '#C8FF00' }}
      >
        Apply Now <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </motion.div>
  )
}

/* ─── Mock fallback data ─────────────────────────────────── */
const MOCK = {
  jobRole: 'Software Engineer',
  atsScore: 78,
  resume: { originalName: 'My_Resume.pdf' },
  createdAt: new Date().toISOString(),
  isBookmarked: false,
  companySuggestions: [
    { name: 'Stripe', domain: 'stripe.com', matchScore: 88, tier: 'Top Tier', reason: 'Your React and Node.js skills align perfectly with Stripe\'s frontend-heavy stack. Their engineering blog highlights similar tech choices.', roles: ['Frontend Engineer', 'Software Engineer'], applyUrl: 'https://stripe.com/jobs/search?q=software+engineer' },
    { name: 'Atlassian', domain: 'atlassian.com', matchScore: 82, tier: 'Mid Tier', reason: 'Atlassian\'s products heavily use React and TypeScript, matching your core stack. They value strong collaborative culture which your experience reflects.', roles: ['Software Engineer', 'Frontend Developer'], applyUrl: 'https://www.atlassian.com/company/careers/all-jobs' },
    { name: 'Shopify', domain: 'shopify.com', matchScore: 79, tier: 'Mid Tier', reason: 'Shopify values full-stack developers and your Node.js/REST API background is directly relevant to their commerce platform.', roles: ['Frontend Developer', 'Full-Stack Engineer'], applyUrl: 'https://www.shopify.com/careers/search' },
    { name: 'Linear', domain: 'linear.app', matchScore: 75, tier: 'Startup', reason: 'A high-growth startup known for exceptional engineering culture, your React expertise makes you a strong candidate for their small, impactful team.', roles: ['Software Engineer'], applyUrl: 'https://linear.app/careers' },
    { name: 'Vercel', domain: 'vercel.com', matchScore: 72, tier: 'Mid Tier', reason: 'Your frontend experience and familiarity with modern web tooling align with Vercel\'s infrastructure and DX-focused engineering teams.', roles: ['Software Engineer', 'Frontend Engineer'], applyUrl: 'https://vercel.com/careers' },
    { name: 'Notion', domain: 'notion.so', matchScore: 68, tier: 'Mid Tier', reason: 'Notion\'s editor and collaboration features are React-heavy — your background is a natural fit for their product engineering team.', roles: ['Software Engineer'], applyUrl: 'https://www.notion.so/careers' },
  ],
  sectionScores: {
    experience: 85,
    education: 80,
    projects: 72,
    summary: 68,
    formatting: 90,
  },
  skillsFound: ['React', 'Node.js', 'JavaScript', 'TypeScript', 'Git', 'REST APIs', 'SQL'],
  skillsMissing: ['GraphQL', 'Docker', 'Kubernetes', 'AWS'],
  jobMatchScore: 81,
  grammarScore: 92,
  suggestions: [
    { section: 'Summary', issue: 'Professional summary is too generic', suggestion: 'Add measurable achievements and specific technologies used. Lead with your years of experience and top skills.', priority: 'high' },
    { section: 'Experience', issue: 'Bullet points lack quantifiable results', suggestion: 'Add metrics like "Reduced load time by 40%" or "Increased user retention by 25%"', priority: 'high' },
    { section: 'Skills', issue: 'Missing cloud/DevOps skills', suggestion: 'Add Docker, Kubernetes, or AWS experience if applicable. These are frequently required in job postings.', priority: 'medium' },
    { section: 'Projects', issue: 'No links to live projects or GitHub', suggestion: 'Add GitHub repository links and live demo URLs to increase credibility', priority: 'medium' },
    { section: 'Education', issue: 'Relevant coursework not mentioned', suggestion: 'List relevant CS courses (Algorithms, OS, Distributed Systems) to boost ATS keyword matches', priority: 'low' },
    { section: 'Formatting', issue: 'Inconsistent date formatting', suggestion: 'Use a consistent date format throughout (e.g., "Jan 2023 – Dec 2023")', priority: 'low' },
  ],
  skillsData: [
    { skill: 'React', found: 90, required: 90 },
    { skill: 'Node.js', found: 75, required: 80 },
    { skill: 'SQL', found: 70, required: 65 },
    { skill: 'Docker', found: 10, required: 70 },
    { skill: 'AWS', found: 20, required: 75 },
    { skill: 'TypeScript', found: 80, required: 85 },
  ],
  keywords: { present: ['React', 'JavaScript', 'API', 'Agile', 'Git', 'Testing'], missing: ['CI/CD', 'Microservices', 'Kafka', 'Redis'] },
  interviewQuestions: [
    { question: 'Describe a challenging technical problem you solved and your approach.', category: 'Technical', difficulty: 'hard' },
    { question: 'How do you manage state in large React applications?', category: 'Technical', difficulty: 'medium' },
    { question: 'Walk me through your most impactful project from end to end.', category: 'Behavioral', difficulty: 'medium' },
    { question: 'How do you prioritize tasks when working on multiple projects?', category: 'Behavioral', difficulty: 'easy' },
    { question: 'Explain the difference between REST and GraphQL.', category: 'Technical', difficulty: 'medium' },
    { question: 'Tell me about a time you disagreed with a teammate. How did you resolve it?', category: 'Behavioral', difficulty: 'medium' },
    { question: 'How would you design a URL shortening service?', category: 'Technical', difficulty: 'hard' },
    { question: 'What is your debugging process when facing a production issue?', category: 'Situational', difficulty: 'hard' },
    { question: 'How do you stay current with new frontend technologies?', category: 'Behavioral', difficulty: 'easy' },
    { question: 'You have a feature deadline tomorrow but found a critical bug today. What do you do?', category: 'Situational', difficulty: 'hard' },
  ],
  coverLetter: `Dear Hiring Manager,

I am excited to apply for the Software Engineer position. With 3+ years of experience building scalable web applications using React, Node.js, and TypeScript, I am confident in my ability to contribute meaningfully to your team from day one.

In my current role, I led the migration of a legacy monolith to a microservices architecture, reducing deployment time by 60% and improving system reliability to 99.9% uptime. I have a strong background in building RESTful APIs, optimizing database queries, and delivering pixel-perfect, performant UIs.

I am particularly drawn to your company's focus on engineering excellence and innovation. I believe my passion for clean code, test-driven development, and continuous improvement aligns perfectly with your engineering culture.

I would love the opportunity to discuss how my skills and experience can contribute to your team's success. Thank you for considering my application.

Best regards,
[Your Name]`,
  roadmap: [
    { month: 'Month 1', goal: 'Skill Foundation', actions: ['Complete Docker & Kubernetes fundamentals course', 'Set up a local Kubernetes cluster', 'Containerize an existing project'] },
    { month: 'Month 2', goal: 'Cloud Proficiency', actions: ['Obtain AWS Cloud Practitioner certification', 'Deploy projects to AWS EC2 and S3', 'Learn CloudFormation basics'] },
    { month: 'Month 3', goal: 'Portfolio Enhancement', actions: ['Build a full-stack project with Docker + AWS', 'Add CI/CD pipeline with GitHub Actions', 'Write technical blog posts about your learnings'] },
    { month: 'Month 4', goal: 'Job Market Preparation', actions: ['Update resume with new skills and projects', 'Apply to 5-10 targeted roles per week', 'Start networking on LinkedIn and GitHub'] },
    { month: 'Month 5', goal: 'Interview Practice', actions: ['Complete 50 LeetCode problems (medium/hard)', 'Do 3 mock interviews weekly', 'Practice system design problems'] },
    { month: 'Month 6', goal: 'Offer Negotiation', actions: ['Research salary ranges for target roles', 'Prepare negotiation strategy', 'Collect strong references from past managers'] },
  ],
}

export default function Results() {
  const { id } = useParams()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [bookmarked, setBookmarked] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await analysisAPI.getOne(id)
        const data = res.data?.analysis || res.data
        setAnalysis(data)
        setBookmarked(data?.isBookmarked || false)
      } catch {
        setAnalysis(MOCK)
        setBookmarked(false)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalysis()
  }, [id])

  const handleBookmark = async () => {
    try {
      await analysisAPI.toggleBookmark(id)
      setBookmarked(prev => !prev)
      toast.success(bookmarked ? 'Removed from bookmarks' : 'Added to bookmarks!')
    } catch {
      toast.error('Failed to update bookmark')
    }
  }

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(analysis?.coverLetter || '')
    setCopied(true)
    toast.success('Cover letter copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = async () => {
    try {
      const res = await analysisAPI.downloadReport(id)
      const url = URL.createObjectURL(res.data)
      const a = document.createElement('a')
      a.href = url
      a.download = `analysis-report-${id}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error('Download not available yet')
    }
  }

  if (loading) return <LoadingSpinner message="Loading your results..." />
  if (!analysis) return (
    <div className="text-center py-20">
      <p className="font-display text-3xl text-dark-teal dark:text-cream uppercase">Analysis not found.</p>
      <Link to="/history" className="text-lime underline mt-4 block">Back to History</Link>
    </div>
  )

  const data = { ...MOCK, ...analysis }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/history"
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-dark-teal/50 dark:text-cream/50 hover:text-lime mb-3"
          >
            <ArrowLeft className="w-3 h-3" /> BACK TO HISTORY
          </Link>
          <h1 className="font-display font-black text-dark-teal dark:text-cream uppercase text-4xl leading-tight">
            {data.jobRole}
          </h1>
          <p className="text-dark-teal/50 dark:text-cream/50 text-xs mt-1 flex items-center gap-2 flex-wrap">
            <FileText className="w-3.5 h-3.5" />
            {data.resume?.originalName || 'Resume.pdf'}
            <span>·</span>
            {formatDateTime(data.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleBookmark}
            className="flex items-center gap-2 px-4 py-2.5 border-2 border-dark-teal dark:border-cream/20 text-dark-teal dark:text-cream hover:border-lime hover:text-lime transition-all text-xs font-bold uppercase tracking-wider"
          >
            {bookmarked ? <BookmarkCheck className="w-4 h-4 text-lime" /> : <Bookmark className="w-4 h-4" />}
            {bookmarked ? 'SAVED' : 'SAVE'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2.5 font-display font-black text-xs uppercase tracking-wider text-dark-teal transition-all hover:bg-lime-dark"
            style={{ background: '#C8FF00' }}
          >
            <Download className="w-4 h-4" />
            DOWNLOAD
          </button>
        </div>
      </div>

      {/* ── ATS Score Hero Card ──────────────────────────── */}
      <div className="bg-dark-teal border-2 border-dark-teal p-8">
        <div className="grid sm:grid-cols-3 gap-8 items-center">
          <div className="flex justify-center">
            <ScoreCircle score={data.atsScore} />
          </div>

          <div className="sm:col-span-2 grid grid-cols-2 gap-4">
            {[
              { label: 'Job Match', value: `${data.jobMatchScore || 81}%` },
              { label: 'Grammar Score', value: `${data.grammarScore || 92}%` },
              { label: 'Skills Found', value: data.skillsFound?.length || 7 },
              { label: 'Skills Missing', value: data.skillsMissing?.length || 4 },
            ].map(({ label, value }) => (
              <div key={label} className="border border-white/10 p-4">
                <p className="font-display font-black text-2xl text-lime">{value}</p>
                <p className="text-cream/50 text-xs uppercase tracking-widest mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Navigation ───────────────────────────────── */}
      <div className="border-b-2 border-dark-teal/10 dark:border-cream/10 overflow-x-auto">
        <div className="flex min-w-max">
          {TABS.map(({ id: tabId, label, icon: Icon }) => (
            <button
              key={tabId}
              onClick={() => setActiveTab(tabId)}
              className={[
                'flex items-center gap-2 px-5 py-3.5 text-xs font-bold uppercase tracking-widest transition-all border-b-2 whitespace-nowrap',
                activeTab === tabId
                  ? 'border-lime text-dark-teal dark:text-lime'
                  : 'border-transparent text-dark-teal/40 dark:text-cream/40 hover:text-dark-teal dark:hover:text-cream',
              ].join(' ')}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ──────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Section Scores */}
              <div className="bg-dark-teal border-2 border-dark-teal p-6">
                <h3 className="font-display font-black text-cream text-xl uppercase mb-6">SECTION SCORES</h3>
                {Object.entries(data.sectionScores || MOCK.sectionScores).map(([key, val]) => (
                  <SectionBar key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} value={val} />
                ))}
              </div>

              {/* Skills */}
              <div className="space-y-4">
                <div className="bg-dark-teal border-2 border-dark-teal p-6">
                  <h3 className="font-display font-black text-cream text-xl uppercase mb-4">SKILLS FOUND</h3>
                  <div className="flex flex-wrap gap-2">
                    {(data.skillsFound || MOCK.skillsFound).map(s => (
                      <span key={s} className="px-3 py-1 font-bold text-xs uppercase tracking-wide text-dark-teal" style={{ background: '#C8FF00' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-dark-teal border-2 border-dark-teal p-6">
                  <h3 className="font-display font-black text-cream text-xl uppercase mb-4">SKILLS MISSING</h3>
                  <div className="flex flex-wrap gap-2">
                    {(data.skillsMissing || MOCK.skillsMissing).map(s => (
                      <span key={s} className="px-3 py-1 font-bold text-xs uppercase tracking-wide border border-red-500/50 text-red-400">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUGGESTIONS */}
          {activeTab === 'suggestions' && (
            <div className="space-y-3">
              <p className="text-dark-teal/60 dark:text-cream/60 text-sm mb-4">
                {(data.suggestions || MOCK.suggestions).length} improvements identified. Address High priority items first.
              </p>
              {(data.suggestions || MOCK.suggestions).map((s, i) => {
                const priority = getPriorityStyle(s.priority)
                return (
                  <div key={i} className="bg-dark-teal border-2 border-dark-teal p-5 flex gap-4">
                    <div className="shrink-0">
                      <span className={`inline-block px-2 py-0.5 font-bold text-[10px] uppercase tracking-widest ${priority.bg} ${priority.text}`}>
                        {priority.label}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-lime shrink-0">{s.section}</span>
                      </div>
                      <div className="flex items-start gap-2 mb-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                        <p className="text-cream/80 text-sm">{s.issue}</p>
                      </div>
                      <div className="flex items-start gap-2 pl-5">
                        <p className="text-cream/50 text-sm leading-relaxed">→ {s.suggestion}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* SKILLS */}
          {activeTab === 'skills' && (
            <div className="grid lg:grid-cols-2 gap-6">
              <SkillRadar data={data.skillsData || MOCK.skillsData} />
              <div className="space-y-4">
                <div className="bg-dark-teal border-2 border-dark-teal p-6">
                  <h3 className="font-display font-black text-cream text-xl uppercase mb-4">KEYWORDS PRESENT</h3>
                  <div className="flex flex-wrap gap-2">
                    {(data.keywords?.present || MOCK.keywords.present).map(k => (
                      <span key={k} className="px-3 py-1 font-bold text-xs uppercase text-dark-teal" style={{ background: '#C8FF00' }}>{k}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-dark-teal border-2 border-dark-teal p-6">
                  <h3 className="font-display font-black text-cream text-xl uppercase mb-4">KEYWORDS MISSING</h3>
                  <div className="flex flex-wrap gap-2">
                    {(data.keywords?.missing || MOCK.keywords.missing).map(k => (
                      <span key={k} className="px-3 py-1 font-bold text-xs uppercase border border-red-500/50 text-red-400">{k}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* INTERVIEW */}
          {activeTab === 'interview' && (
            <div className="space-y-3">
              {['Technical', 'Behavioral', 'Situational'].map(cat => {
                const qs = (data.interviewQuestions || MOCK.interviewQuestions).filter(q => q.category === cat)
                if (!qs.length) return null
                return (
                  <div key={cat}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-display font-black text-xs uppercase tracking-[0.2em] px-3 py-1 bg-dark-teal text-cream">{cat}</span>
                      <div className="flex-1 h-px bg-dark-teal/10 dark:bg-cream/10" />
                    </div>
                    <div className="space-y-2">
                      {qs.map((q, i) => {
                        const diff = getDifficultyStyle(q.difficulty)
                        return (
                          <div key={i} className="bg-dark-teal border-2 border-dark-teal p-4 flex items-start gap-4">
                            <span
                              className={`shrink-0 px-2 py-0.5 font-bold text-[10px] uppercase tracking-widest mt-0.5 ${diff.bg} ${diff.text}`}
                            >
                              {q.difficulty}
                            </span>
                            <p className="text-cream/90 text-sm leading-relaxed">{q.question}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* COVER LETTER */}
          {activeTab === 'coverletter' && (
            <div className="bg-dark-teal border-2 border-dark-teal p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-black text-cream text-xl uppercase">AI COVER LETTER</h3>
                <button
                  onClick={handleCopyLetter}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-lime text-lime text-xs font-bold uppercase tracking-widest hover:bg-lime hover:text-dark-teal transition-all"
                >
                  {copied ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'COPIED!' : 'COPY'}
                </button>
              </div>
              <div className="bg-white/5 border border-white/10 p-6">
                <pre className="text-cream/80 text-sm leading-relaxed whitespace-pre-wrap font-body">
                  {data.coverLetter || MOCK.coverLetter}
                </pre>
              </div>
            </div>
          )}

          {/* ROADMAP */}
          {activeTab === 'roadmap' && (
            <div className="space-y-4">
              <p className="text-dark-teal/60 dark:text-cream/60 text-sm mb-2">
                Your personalized 6-month career action plan to land the role.
              </p>
              {(data.roadmap || MOCK.roadmap).map((milestone, i) => (
                <div key={i} className="bg-dark-teal border-2 border-dark-teal p-5 flex gap-5">
                  <div className="shrink-0 text-center w-20">
                    <p className="font-display font-black text-sm leading-tight" style={{ color: '#C8FF00' }}>
                      {milestone.month}
                    </p>
                    {i < (data.roadmap || MOCK.roadmap).length - 1 && (
                      <div className="w-px h-8 bg-lime/20 mx-auto mt-2" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-display font-black text-cream text-lg uppercase mb-3">
                      {milestone.goal}
                    </h4>
                    <ul className="space-y-1.5">
                      {milestone.actions.map((action, j) => (
                        <li key={j} className="flex items-start gap-2 text-cream/70 text-sm">
                          <ChevronRight className="w-3.5 h-3.5 text-lime shrink-0 mt-0.5" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* COMPANIES */}
          {activeTab === 'companies' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-dark-teal/60 dark:text-cream/60 text-sm">
                  {(data.companySuggestions || MOCK.companySuggestions).length} companies matched to your profile — ranked by fit score.
                </p>
                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                  {['Top Tier', 'Mid Tier', 'Startup'].map(t => (
                    <span key={t} className={`px-2 py-0.5 border ${TIER_STYLES[t].bg} ${TIER_STYLES[t].text} ${TIER_STYLES[t].border}`}>{t}</span>
                  ))}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(data.companySuggestions || MOCK.companySuggestions)
                  .slice()
                  .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
                  .map((company, i) => (
                    <CompanyCard key={company.name + i} company={company} index={i} />
                  ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
