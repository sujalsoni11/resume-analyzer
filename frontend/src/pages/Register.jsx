import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleGoogleSuccess = async (response) => {
    setError('')
    setLoading(true)
    try {
      await loginWithGoogle(response.credential)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Google authentication failed.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const initGoogle = () => {
      if (typeof google !== 'undefined') {
        google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '923316002790-381bvv12k7ldgvsnr9k67p4g80l2igvq.apps.googleusercontent.com',
          callback: handleGoogleSuccess,
        })
        google.accounts.id.renderButton(
          document.getElementById('googleRegisterBtn'),
          {
            theme: 'filled_black',
            size: 'large',
            width: '380',
            text: 'continue_with',
            shape: 'square',
          }
        )
      }
    }

    initGoogle()

    const interval = setInterval(() => {
      if (typeof google !== 'undefined') {
        initGoogle()
        clearInterval(interval)
      }
    }, 500)

    return () => clearInterval(interval)
  }, [loginWithGoogle])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const passwordStrength = (pw) => {
    let score = 0
    if (pw.length >= 8) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    return score
  }

  const strength = passwordStrength(form.password)
  const strengthLabels = ['', 'WEAK', 'FAIR', 'GOOD', 'STRONG']
  const strengthColors = ['', '#ef4444', '#fb923c', '#facc15', '#C8FF00']

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError('Please fill in all fields.')
      return
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-3 bg-white dark:bg-dark-teal border-2 border-dark-teal dark:border-cream/20 text-dark-teal dark:text-cream placeholder-dark-teal/30 dark:placeholder-cream/30 focus:outline-none focus:border-lime text-sm transition-colors"
  const labelClass = "block text-xs font-bold uppercase tracking-widest text-dark-teal dark:text-cream mb-2"

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* ── LEFT: Bold panel ──────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between bg-dark-teal dot-grid-dark p-12 relative overflow-hidden">
        <Link to="/" className="flex items-center gap-1">
          <span className="font-display font-black text-2xl text-cream">RESUME</span>
          <span className="font-display font-black text-2xl px-2 py-0.5" style={{ background: '#C8FF00', color: '#0D3333' }}>
            AI
          </span>
        </Link>

        <div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-display font-black uppercase text-cream"
            style={{ fontSize: 'clamp(72px, 8vw, 110px)', lineHeight: 0.88 }}
          >
            JOIN
            <br />
            <span style={{ WebkitTextStroke: '3px #C8FF00', color: 'transparent' }}>
              THE 1%.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-cream/60 text-lg mt-6 max-w-sm leading-relaxed"
          >
            Top candidates don't leave their application to chance. Start analyzing and start winning.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 space-y-3"
          >
            {[
              'Instant ATS Score Analysis',
              'Skill Gap & Career Roadmap',
              'AI Cover Letter Generator',
              'Interview Question Bank',
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-3 text-cream/70 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-lime shrink-0" />
                {feat}
              </div>
            ))}
          </motion.div>
        </div>

        <p className="text-cream/30 text-xs uppercase tracking-widest">
          Free forever · No credit card required
        </p>

        <div className="absolute bottom-1/3 right-0 w-64 h-64 border border-lime/10 translate-x-1/2" />
      </div>

      {/* ── RIGHT: Form ───────────────────────────────────── */}
      <div className="flex items-center justify-center bg-cream dark:bg-teal-900 p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="flex lg:hidden items-center gap-1 mb-10">
            <Link to="/">
              <span className="font-display font-black text-2xl text-dark-teal">RESUME</span>
              <span className="font-display font-black text-2xl px-2 py-0.5 ml-1" style={{ background: '#C8FF00', color: '#0D3333' }}>
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
              CREATE ACCOUNT
            </h2>
            <p className="text-dark-teal/60 dark:text-cream/60 text-sm mb-8">
              Already have an account?{' '}
              <Link to="/login" className="text-dark-teal dark:text-lime font-bold hover:underline">
                Sign in
              </Link>
            </p>

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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Sujal Soni"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Email Address</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="xyz@gmail.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 8 characters"
                    className={`${inputClass} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-teal/40 hover:text-dark-teal dark:text-cream/40 dark:hover:text-cream"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Password strength */}
                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map(n => (
                        <div
                          key={n}
                          className="h-1 flex-1 transition-all duration-300"
                          style={{ background: n <= strength ? strengthColors[strength] : 'rgba(13,51,51,0.15)' }}
                        />
                      ))}
                    </div>
                    <p
                      className="text-xs font-bold mt-1 uppercase tracking-wider"
                      style={{ color: strengthColors[strength] || 'transparent' }}
                    >
                      {strengthLabels[strength]}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className={labelClass}>Confirm Password</label>
                <input
                  name="confirm"
                  type="password"
                  value={form.confirm}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className={[
                    inputClass,
                    form.confirm && form.confirm !== form.password ? 'border-red-500' : '',
                    form.confirm && form.confirm === form.password ? 'border-lime' : '',
                  ].join(' ')}
                />
                {form.confirm && form.confirm !== form.password && (
                  <p className="text-red-500 text-xs mt-1 font-medium">Passwords don't match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 mt-2 font-display font-black text-sm uppercase tracking-widest text-dark-teal transition-all hover:bg-lime-dark disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: '#C8FF00' }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    CREATING ACCOUNT...
                  </>
                ) : (
                  <>
                    CREATE ACCOUNT
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Google Divider */}
            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-dark-teal/10 dark:border-cream/10"></div>
              <span className="flex-shrink mx-4 text-dark-teal/40 dark:text-cream/40 text-xs font-bold uppercase tracking-widest">or</span>
              <div className="flex-grow border-t border-dark-teal/10 dark:border-cream/10"></div>
            </div>

            {/* Google Signup Button */}
            <div className="flex justify-center w-full">
              <div id="googleRegisterBtn" className="w-full max-w-[380px] shadow-sharp-lime transition-all duration-300"></div>
            </div>

            <p className="text-center text-dark-teal/40 dark:text-cream/30 text-xs mt-6 leading-relaxed">
              By creating an account, you agree to our{' '}
              <span className="underline cursor-pointer">Terms of Service</span> and{' '}
              <span className="underline cursor-pointer">Privacy Policy</span>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
