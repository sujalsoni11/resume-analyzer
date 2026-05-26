import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  Target, TrendingUp, MessageSquare, FileText, Map, Briefcase,
  ArrowRight, CheckCircle, Upload, BarChart2, Star, ChevronRight,
  Zap, Shield, Clock
} from 'lucide-react'
import Navbar from '../components/layout/Navbar.jsx'

/* ─── Animation helpers ─────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Typewriter Effect Component ───────────────────────────── */
function Typewriter({ words, speed = 80, delay = 2500 }) {
  const [index, setIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const [reverse, setReverse] = useState(false)
  const [blink, setBlink] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setBlink((prev) => !prev)
    }, 500)
    return () => clearTimeout(timeout)
  }, [blink])

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      const timeout = setTimeout(() => setReverse(true), delay)
      return () => clearTimeout(timeout)
    }

    if (subIndex === 0 && reverse) {
      setReverse(false)
      setIndex((prev) => (prev + 1) % words.length)
      return
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1))
    }, speed + (reverse ? 30 : 0))

    return () => clearTimeout(timeout)
  }, [subIndex, index, reverse, words, speed, delay])

  return (
    <span className="font-display font-black tracking-widest text-lime text-xl md:text-2xl uppercase" style={{ color: '#C8FF00' }}>
      {`${words[index].substring(0, subIndex)}`}
      <span className={`${blink ? 'opacity-100' : 'opacity-0'} transition-opacity`} style={{ color: '#C8FF00' }}>|</span>
    </span>
  )
}

/* ─── Mock ATS Score Card ────────────────────────────────────── */
function MockScoreCard() {
  const skills = ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker']
  const missing = ['Kubernetes', 'GraphQL']
  return (
    <motion.div
      initial={{ opacity: 0, x: 40, rotate: 2 }}
      animate={{ opacity: 1, x: 0, rotate: 1 }}
      transition={{ duration: 0.8, delay: 0.4, type: 'spring', stiffness: 100 }}
      className="bg-dark-teal border-2 border-lime/30 p-6 w-full max-w-sm shadow-sharp-lime"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-display text-xs font-black text-cream/50 uppercase tracking-[0.2em]">
          ATS SCORE REPORT
        </span>
        <span className="text-xs text-lime/60 font-medium">Software Engineer</span>
      </div>

      {/* Big Score */}
      <div className="flex items-end gap-2 mb-1">
        <span className="font-display text-7xl font-black leading-none" style={{ color: '#C8FF00' }}>
          87
        </span>
        <span className="text-cream/40 text-lg mb-2 font-bold">/ 100</span>
      </div>
      <div className="flex items-center gap-2 mb-6">
        <span className="px-2 py-0.5 font-bold text-xs uppercase tracking-widest text-dark-teal" style={{ background: '#C8FF00' }}>
          STRONG
        </span>
        <span className="text-cream/40 text-xs">Top 12% of applicants</span>
      </div>

      {/* Section bars */}
      {[
        { label: 'Experience', val: 90 },
        { label: 'Education', val: 85 },
        { label: 'Skills', val: 82 },
        { label: 'Summary', val: 78 },
      ].map(({ label, val }) => (
        <div key={label} className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-cream/60 font-medium">{label}</span>
            <span className="text-lime font-bold">{val}%</span>
          </div>
          <div className="h-1 bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${val}%` }}
              transition={{ duration: 1, delay: 0.8 }}
              className="h-full"
              style={{ background: '#C8FF00' }}
            />
          </div>
        </div>
      ))}

      {/* Skills found */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-xs font-bold text-cream/50 uppercase tracking-widest mb-2">Skills Found</p>
        <div className="flex flex-wrap gap-1.5">
          {skills.map(s => (
            <span key={s} className="text-[10px] font-bold px-2 py-0.5 uppercase" style={{ background: '#C8FF00', color: '#0D3333' }}>
              {s}
            </span>
          ))}
          {missing.map(s => (
            <span key={s} className="text-[10px] font-bold px-2 py-0.5 uppercase border border-red-500/50 text-red-400">
              {s}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Features data ──────────────────────────────────────────── */
const features = [
  {
    icon: Target,
    title: 'ATS Score Checker',
    desc: 'Instant scoring against 50+ ATS systems used by top companies. Know exactly where you stand.',
  },
  {
    icon: TrendingUp,
    title: 'Skill Gap Analysis',
    desc: 'Radar chart comparison of your skills vs. job requirements. Find what\'s missing fast.',
  },
  {
    icon: MessageSquare,
    title: 'Interview Questions',
    desc: 'AI-generated questions tailored to your resume and target role. Practice before the real thing.',
  },
  {
    icon: FileText,
    title: 'Cover Letter AI',
    desc: 'Professional cover letter generated from your resume and the job description in seconds.',
  },
  {
    icon: Map,
    title: 'Career Roadmap',
    desc: '6-month personalized action plan to close skill gaps and land your dream role.',
  },
  {
    icon: Briefcase,
    title: 'Job Role Matching',
    desc: 'See which roles you\'re best suited for based on your skills and experience.',
  },
]

/* ─── Steps data ─────────────────────────────────────────────── */
const steps = [
  {
    num: '01',
    icon: Upload,
    title: 'Upload Your Resume',
    desc: 'Drag and drop your PDF resume. We accept all formats and extract everything automatically.',
  },
  {
    num: '02',
    icon: Briefcase,
    title: 'Select Job Role',
    desc: 'Choose your target position from 50+ roles. Our AI tailors analysis to match specific requirements.',
  },
  {
    num: '03',
    icon: BarChart2,
    title: 'Get Your Results',
    desc: 'Receive a comprehensive report with ATS score, skill gaps, and actionable improvements.',
  },
]

/* ─── Stats ──────────────────────────────────────────────────── */
const stats = [
  { value: '10,000+', label: 'Resumes Analyzed' },
  { value: '94%', label: 'ATS Improvement Rate' },
  { value: '50+', label: 'Job Roles Covered' },
  { value: '< 30s', label: 'Analysis Time' },
]

/* ─── Main Landing Component ─────────────────────────────────── */
export default function Landing() {
  return (
    <div className="bg-cream dark:bg-teal-900 min-h-screen">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen pt-16 dot-grid overflow-hidden flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left */}
            <div>
              {/* Pill badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 mb-8"
              >
                <span
                  className="px-4 py-2 font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2"
                  style={{ background: '#C8FF00', color: '#0D3333' }}
                >
                  <Zap className="w-3.5 h-3.5" />
                  AI-POWERED CAREER TOOL
                </span>
              </motion.div>

              {/* Giant headline */}
              <div className="mb-8">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="font-display font-black uppercase"
                  style={{ fontSize: 'clamp(72px, 10vw, 140px)', lineHeight: 0.88 }}
                >
                  <span className="block text-dark-teal dark:text-cream">ANALYZE.</span>
                  <span className="block text-stroke dark:text-stroke-white" style={{ WebkitTextStroke: '3px #0D3333' }}>
                    IMPROVE.
                  </span>
                  <span className="block text-dark-teal dark:text-cream">GET HIRED.</span>
                </motion.h1>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-dark-teal/70 dark:text-cream/70 text-lg max-w-lg leading-relaxed mb-10"
              >
                Upload your resume. Get an AI-powered ATS score, skill gap analysis, and personalized career roadmap in seconds.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="flex flex-wrap gap-4 mb-12"
              >
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 font-display font-black text-sm uppercase tracking-widest text-dark-teal transition-all hover:bg-lime-dark active:scale-95"
                  style={{ background: '#C8FF00' }}
                >
                  ANALYZE MY RESUME
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="#how-it-works"
                  className="inline-flex items-center gap-2 px-8 py-4 font-display font-black text-sm uppercase tracking-widest border-2 border-dark-teal text-dark-teal dark:text-cream dark:border-cream hover:bg-dark-teal hover:text-cream dark:hover:bg-cream dark:hover:text-dark-teal transition-all"
                >
                  SEE HOW IT WORKS
                </Link>
              </motion.div>

              {/* Floating stat badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-4"
              >
                {[
                  { icon: CheckCircle, text: '10K+ Resumes Analyzed' },
                  { icon: Star, text: '94% Success Rate' },
                  { icon: Shield, text: 'ATS Guaranteed' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-dark-teal/70 dark:text-cream/70 text-sm font-medium">
                    <Icon className="w-4 h-4 text-lime shrink-0" />
                    {text}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Mock Score Card */}
            <div className="flex justify-center lg:justify-end">
              <MockScoreCard />
            </div>
          </div>
        </div>

        {/* Decorative corner element */}
        <div
          className="absolute top-24 right-4 w-24 h-24 border-2 border-lime/30 hidden lg:block"
          aria-hidden
        />
        <div
          className="absolute bottom-12 left-4 w-16 h-16 border-2 border-dark-teal/20 hidden lg:block"
          aria-hidden
        />
      </section>

      {/* ── STATS BAR ────────────────────────────────────────── */}
      <section className="bg-dark-teal py-12 border-y-2 border-lime/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ value, label }, i) => (
              <FadeUp key={label} delay={i * 0.1}>
                <div className="text-center">
                  <p className="font-display font-black text-5xl md:text-6xl leading-none mb-2" style={{ color: '#C8FF00' }}>
                    {value}
                  </p>
                  <p className="text-cream/60 text-sm font-medium uppercase tracking-wider">{label}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section className="py-24 dot-grid bg-cream dark:bg-teal-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="mb-16">
              <span className="font-display text-xs font-black uppercase tracking-[0.3em] text-lime bg-dark-teal px-4 py-2 inline-block mb-6">
                WHAT WE ANALYZE
              </span>
              <h2
                className="font-display font-black text-dark-teal dark:text-cream uppercase"
                style={{ fontSize: 'clamp(48px, 6vw, 80px)', lineHeight: 0.9 }}
              >
                EVERYTHING YOUR
                <br />
                <span className="text-stroke" style={{ WebkitTextStroke: '3px #0D3333' }}>
                  RECRUITER
                </span>{' '}
                SEES.
              </h2>
            </div>
          </FadeUp>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <FadeUp key={title} delay={i * 0.08}>
                <div className="bg-dark-teal border-2 border-dark-teal p-6 card-hover group h-full">
                  <div
                    className="w-10 h-10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                    style={{ background: '#C8FF00' }}
                  >
                    <Icon className="w-5 h-5 text-dark-teal" />
                  </div>
                  <h3 className="font-display font-black text-cream text-2xl uppercase mb-3 leading-tight">
                    {title}
                  </h3>
                  <p className="text-cream/60 text-sm leading-relaxed">{desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-dark-teal border-y-2 border-dark-teal/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="text-center mb-16">
              <span className="font-display text-xs font-black uppercase tracking-[0.3em] text-dark-teal/50 dark:text-cream/50 inline-block mb-4">
                SIMPLE PROCESS
              </span>
              <h2
                className="font-display font-black text-dark-teal dark:text-cream uppercase"
                style={{ fontSize: 'clamp(48px, 6vw, 80px)', lineHeight: 0.9 }}
              >
                HOW IT WORKS
              </h2>
            </div>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-lime/30 z-0" />

            {steps.map(({ num, icon: Icon, title, desc }, i) => (
              <FadeUp key={num} delay={i * 0.15}>
                <div className="relative text-center">
                  <div className="flex justify-center mb-6">
                    <div
                      className="w-16 h-16 flex items-center justify-center border-2 border-dark-teal dark:border-cream relative z-10 bg-cream dark:bg-teal-900"
                    >
                      <Icon className="w-7 h-7 text-dark-teal dark:text-cream" />
                    </div>
                  </div>
                  <span
                    className="font-display font-black text-6xl leading-none block mb-4"
                    style={{ color: '#C8FF00' }}
                  >
                    {num}
                  </span>
                  <h3 className="font-display font-black text-dark-teal dark:text-cream text-2xl uppercase mb-3">
                    {title}
                  </h3>
                  <p className="text-dark-teal/60 dark:text-cream/60 text-sm leading-relaxed max-w-xs mx-auto">
                    {desc}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEET THE CREATOR ─────────────────────────────────── */}
      <section className="py-24 dot-grid bg-cream dark:bg-teal-900 border-b-2 border-dark-teal/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left: Avatar with animations */}
            <div className="lg:col-span-5 flex justify-center order-2 lg:order-1">
              <div className="relative group">
                {/* Decorative border boxes */}
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                  className="absolute -inset-4 border-2 border-dashed border-lime/40 group-hover:border-lime/80 transition-colors"
                />
                
                {/* Sharp neon lime background shadow */}
                <div className="absolute inset-0 bg-dark-teal translate-x-3 translate-y-3 shadow-sharp-lime transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
                
                {/* Main Avatar Container */}
                <div className="relative border-4 border-dark-teal dark:border-cream bg-dark-teal overflow-hidden aspect-square w-72 md:w-80 lg:w-96 shadow-2xl">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    src="/sujal_soni_avatar.jpg"
                    alt="Sujal Soni - Creator"
                    className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
                  />
                  
                  {/* Futuristic overlay elements */}
                  <div className="absolute top-4 left-4 bg-lime text-dark-teal px-3 py-1 font-display font-black text-xs uppercase tracking-widest">
                    SYS.ADMIN
                  </div>
                  <div className="absolute bottom-4 right-4 bg-dark-teal border border-lime/50 text-cream px-3 py-1 font-mono text-[10px] tracking-wider uppercase">
                    LOC: DEL, IN
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Info and Text Details */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <FadeUp>
                <div className="mb-6">
                  <span className="font-display text-xs font-black uppercase tracking-[0.3em] text-lime bg-dark-teal px-4 py-2 inline-block mb-6">
                    THE CREATOR
                  </span>
                  
                  {/* Dynamic typewriter typo effect */}
                  <div className="h-8 mb-2 flex items-center">
                    <Typewriter 
                      words={['Full-Stack Developer', 'AI Solutions Architect', 'Creator of ResumeAI']} 
                      speed={80} 
                      delay={2500} 
                    />
                  </div>
                  
                  <h2
                    className="font-display font-black text-dark-teal dark:text-cream uppercase leading-none mb-6"
                    style={{ fontSize: 'clamp(56px, 8vw, 96px)' }}
                  >
                    SUJAL SONI
                  </h2>
                </div>
              </FadeUp>

              <FadeUp delay={0.15}>
                <p className="text-dark-teal/80 dark:text-cream/80 text-base md:text-lg mb-8 leading-relaxed font-medium">
                  A visionary developer committed to engineered excellence. ResumeAI was conceived to push the limits of modern full-stack systems and artificial intelligence, offering job seekers a competitive edge with high-fidelity, real-time ATS optimization.
                </p>
              </FadeUp>

              {/* Technologies / Specialities Grid */}
              <FadeUp delay={0.25}>
                <div className="mb-10">
                  <p className="text-xs font-bold text-dark-teal/50 dark:text-cream/40 uppercase tracking-[0.2em] mb-4">
                    SPECIALITIES & TECH STACK
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'React.js', 'Node.js', 'Express.js', 'MongoDB', 
                      'Google Gemini AI', 'Tailwind CSS', 'Vite', 'Framer Motion'
                    ].map(tech => (
                      <span 
                        key={tech} 
                        className="text-xs font-bold px-3 py-1.5 uppercase border-2 border-dark-teal text-dark-teal dark:text-cream dark:border-cream hover:bg-dark-teal hover:text-cream dark:hover:bg-cream dark:hover:text-dark-teal transition-all duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeUp>

              {/* Action/Social Links */}
              <FadeUp delay={0.35}>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://github.com/sujalsoni11"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-3.5 font-display font-black text-sm uppercase tracking-widest text-dark-teal transition-all hover:bg-lime-dark active:scale-95 shadow-sharp-lime"
                    style={{ background: '#C8FF00' }}
                  >
                    GITHUB PORTFOLIO
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </FadeUp>
            </div>
            
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      <section className="bg-dark-teal dot-grid-dark py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp>
            <h2
              className="font-display font-black uppercase mb-2"
              style={{ fontSize: 'clamp(56px, 8vw, 120px)', lineHeight: 0.88 }}
            >
              <span className="block text-cream">STOP</span>
              <span
                className="block"
                style={{ WebkitTextStroke: '3px #C8FF00', color: 'transparent' }}
              >
                SETTLING.
              </span>
            </h2>
            <h2
              className="font-display font-black uppercase text-cream mb-10"
              style={{ fontSize: 'clamp(32px, 5vw, 72px)', lineHeight: 0.9 }}
            >
              START GETTING HIRED.
            </h2>
            <p className="text-cream/60 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Join thousands of job seekers who improved their ATS score and landed more interviews with ResumeAI.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-3 px-10 py-5 font-display font-black text-base uppercase tracking-widest text-dark-teal transition-all hover:bg-lime-dark active:scale-95 lime-glow"
              style={{ background: '#C8FF00' }}
            >
              ANALYZE MY RESUME FREE
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-cream/30 text-xs mt-4 uppercase tracking-widest">
              No credit card required · Free forever plan
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="bg-dark-teal border-t border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-1">
              <span className="font-display font-black text-xl text-cream">RESUME</span>
              <span
                className="font-display font-black text-xl px-2 py-0.5"
                style={{ background: '#C8FF00', color: '#0D3333' }}
              >
                AI
              </span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-cream/50">
              <Link to="/" className="hover:text-cream transition-colors">Home</Link>
              <Link to="/login" className="hover:text-cream transition-colors">Login</Link>
              <Link to="/register" className="hover:text-cream transition-colors">Register</Link>
              <a href="#features" className="hover:text-cream transition-colors">Features</a>
            </div>

            <p className="text-cream/30 text-xs uppercase tracking-widest">
              © {new Date().getFullYear()} ResumeAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
