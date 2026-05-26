import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import Button from '../components/ui/Button.jsx'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* ── LEFT: Bold text panel ──────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between bg-dark-teal dot-grid-dark p-12 relative overflow-hidden">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1">
          <span className="font-display font-black text-2xl text-cream">RESUME</span>
          <span
            className="font-display font-black text-2xl px-2 py-0.5"
            style={{ background: '#C8FF00', color: '#0D3333' }}
          >
            AI
          </span>
        </Link>

        {/* Big text */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-black uppercase text-cream"
            style={{ fontSize: 'clamp(72px, 8vw, 120px)', lineHeight: 0.88 }}
          >
            WELCOME
            <br />
            <span style={{ WebkitTextStroke: '3px #C8FF00', color: 'transparent' }}>
              BACK.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-cream/60 text-lg mt-6 max-w-sm leading-relaxed"
          >
            Your next opportunity is one analysis away. Let's get you there.
          </motion.p>
        </div>

        {/* Bottom stat */}
        <div className="flex items-center gap-4">
          {[
            { value: '87', label: 'Avg ATS Score' },
            { value: '10K+', label: 'Users' },
          ].map(({ value, label }) => (
            <div key={label} className="border border-lime/20 px-4 py-3">
              <p className="font-display font-black text-3xl text-lime leading-none">{value}</p>
              <p className="text-cream/50 text-xs uppercase tracking-wider mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Decorative element */}
        <div className="absolute top-1/2 right-0 w-48 h-48 border-2 border-lime/10 translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* ── RIGHT: Form ───────────────────────────────────── */}
      <div className="flex items-center justify-center bg-cream dark:bg-teal-900 p-6 lg:p-12">
        {/* Mobile logo */}
        <div className="w-full max-w-md">
          <div className="flex lg:hidden items-center gap-1 mb-10">
            <Link to="/" className="flex items-center gap-1">
              <span className="font-display font-black text-2xl text-dark-teal">RESUME</span>
              <span
                className="font-display font-black text-2xl px-2 py-0.5"
                style={{ background: '#C8FF00', color: '#0D3333' }}
              >
                AI
              </span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display font-black text-dark-teal dark:text-cream text-5xl uppercase mb-2">
              SIGN IN
            </h2>
            <p className="text-dark-teal/60 dark:text-cream/60 text-sm mb-8">
              Don't have an account?{' '}
              <Link to="/register" className="text-dark-teal dark:text-lime font-bold hover:underline">
                Create one free
              </Link>
            </p>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center gap-2 mb-6 px-4 py-3 bg-red-500/10 border border-red-500"
              >
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-red-500 text-sm font-medium">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-dark-teal dark:text-cream mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="xyz@gmail.com"
                  className="w-full px-4 py-3 bg-white dark:bg-dark-teal border-2 border-dark-teal dark:border-cream/20 text-dark-teal dark:text-cream placeholder-dark-teal/30 dark:placeholder-cream/30 focus:outline-none focus:border-lime text-sm transition-colors"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-dark-teal dark:text-cream mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-12 bg-white dark:bg-dark-teal border-2 border-dark-teal dark:border-cream/20 text-dark-teal dark:text-cream placeholder-dark-teal/30 dark:placeholder-cream/30 focus:outline-none focus:border-lime text-sm transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-teal/40 hover:text-dark-teal dark:text-cream/40 dark:hover:text-cream transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 font-display font-black text-sm uppercase tracking-widest text-dark-teal transition-all hover:bg-lime-dark disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                style={{ background: '#C8FF00' }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    SIGNING IN...
                  </>
                ) : (
                  <>
                    LOGIN
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-dark-teal/40 dark:text-cream/30 text-xs mt-8 uppercase tracking-widest">
              By signing in, you agree to our Terms of Service
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
