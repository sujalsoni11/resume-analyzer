import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sun, Moon, User, LogOut, ChevronDown, Menu, X } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { getInitials } from '../../utils/helpers.js'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar({ onMenuToggle, sidebarOpen }) {
  const { isDark, toggle } = useTheme()
  const { user, logout, isAuthenticated } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setDropdownOpen(false)
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 md:px-6"
      style={{
        background: '#0D3333',
        borderBottom: '1px solid rgba(200,255,0,0.2)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Left: Hamburger (mobile) + Logo */}
      <div className="flex items-center gap-4">
        {isAuthenticated && (
          <button
            onClick={onMenuToggle}
            className="md:hidden w-9 h-9 flex items-center justify-center text-cream hover:text-lime transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        )}

        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-1 group">
          <span className="font-display font-black text-2xl tracking-tight text-cream group-hover:text-lime transition-colors">
            RESUME
          </span>
          <span
            className="font-display font-black text-2xl tracking-tight px-2 py-0.5 leading-none"
            style={{ background: '#C8FF00', color: '#0D3333' }}
          >
            AI
          </span>
        </Link>
      </div>

      {/* Right: Theme toggle + User */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggle}
          className="w-9 h-9 flex items-center justify-center text-cream hover:text-lime transition-colors border border-white/10 hover:border-lime/40"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {isAuthenticated ? (
          /* User Dropdown */
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(prev => !prev)}
              className="flex items-center gap-2 pl-3 pr-2 py-1.5 border border-white/10 hover:border-lime/40 text-cream hover:text-lime transition-all"
            >
              {/* Avatar */}
              <div
                className="w-7 h-7 flex items-center justify-center text-xs font-black font-display"
                style={{ background: '#C8FF00', color: '#0D3333' }}
              >
                {getInitials(user?.name)}
              </div>
              <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">
                {user?.name?.split(' ')[0]}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-52 bg-dark-teal border-2 border-lime/30 z-50"
                >
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="font-bold text-cream text-sm truncate">{user?.name}</p>
                    <p className="text-cream/50 text-xs truncate mt-0.5">{user?.email}</p>
                  </div>

                  {/* Links */}
                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-cream/80 hover:text-lime hover:bg-white/5 text-sm font-medium transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-white/5 text-sm font-medium transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* Guest: Login/Register */
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="hidden sm:block text-cream text-sm font-medium hover:text-lime transition-colors px-3 py-1.5"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-dark-teal text-sm font-black uppercase tracking-wider px-4 py-2 transition-all hover:bg-lime-dark"
              style={{ background: '#C8FF00' }}
            >
              GET STARTED
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
