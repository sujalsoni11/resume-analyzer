import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Upload,
  Clock,
  Bookmark,
  User,
  LogOut,
  Zap,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { getInitials, truncateText } from '../../utils/helpers.js'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/analyze', icon: Upload, label: 'Analyze' },
  { to: '/history', icon: Clock, label: 'History' },
  { to: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-dark-teal" style={{ width: 240 }}>
      {/* Top spacer for navbar */}
      <div className="h-16 border-b border-white/10 flex items-center px-6">
        <span className="font-display text-xs font-black text-cream/40 uppercase tracking-[0.2em]">
          NAVIGATION
        </span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => onClose?.()}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all duration-150 relative',
                isActive
                  ? 'text-lime bg-white/5'
                  : 'text-cream/60 hover:text-cream hover:bg-white/5',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                {/* Active indicator */}
                {isActive && (
                  <span
                    className="absolute left-0 top-0 bottom-0 w-0.5"
                    style={{ background: '#C8FF00' }}
                  />
                )}
                <Icon className="w-4 h-4 shrink-0" />
                <span className="font-display font-bold uppercase tracking-wider text-xs">
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Quick Analyze CTA */}
      <div className="px-4 py-4 border-t border-white/10">
        <NavLink
          to="/analyze"
          onClick={() => onClose?.()}
          className="flex items-center justify-center gap-2 w-full py-3 font-display font-black text-xs uppercase tracking-widest text-dark-teal transition-all hover:bg-lime-dark"
          style={{ background: '#C8FF00' }}
        >
          <Zap className="w-3.5 h-3.5" />
          ANALYZE RESUME
        </NavLink>
      </div>

      {/* User Footer */}
      <div className="px-4 pb-4 border-t border-white/10">
        <div className="flex items-center gap-3 py-3">
          <div
            className="w-9 h-9 flex items-center justify-center text-sm font-black font-display shrink-0"
            style={{ background: '#C8FF00', color: '#0D3333' }}
          >
            {getInitials(user?.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-cream text-sm font-bold truncate">{user?.name}</p>
            <p className="text-cream/40 text-xs truncate">{truncateText(user?.email, 22)}</p>
          </div>
        </div>
        {/* Plan badge */}
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 border border-lime/40 text-lime/80">
            {user?.plan || 'FREE'} PLAN
          </span>
          <button
            onClick={handleLogout}
            className="text-cream/40 hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-40" style={{ width: 240 }}>
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed left-0 top-0 bottom-0 z-50 md:hidden"
              style={{ width: 240 }}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
