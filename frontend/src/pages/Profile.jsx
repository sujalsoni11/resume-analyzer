import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User, Mail, Lock, Shield, Trash2, Save, Eye, EyeOff,
  AlertTriangle, CheckCircle2, Calendar, BarChart2, FileText
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'
import { authAPI } from '../services/api.js'
import { formatDate, getInitials } from '../utils/helpers.js'

function Section({ title, children }) {
  return (
    <div className="border-2 border-dark-teal dark:border-cream/20 bg-white dark:bg-dark-teal">
      <div className="px-6 py-4 border-b border-dark-teal/10 dark:border-cream/10">
        <h2 className="font-display font-black text-dark-teal dark:text-cream text-2xl uppercase">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

const inputClass = "w-full px-4 py-3 bg-cream dark:bg-teal-800 border-2 border-dark-teal dark:border-cream/20 text-dark-teal dark:text-cream placeholder-dark-teal/30 dark:placeholder-cream/30 focus:outline-none focus:border-lime text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
const labelClass = "block text-xs font-bold uppercase tracking-widest text-dark-teal dark:text-cream/80 mb-2"

export default function Profile() {
  const { user, updateUser, logout } = useAuth()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' })

  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' })
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false })
  const [savingPw, setSavingPw] = useState(false)

  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleting, setDeleting] = useState(false)

  const handleSaveProfile = async () => {
    if (!form.name || !form.email) {
      toast.error('Name and email are required.')
      return
    }
    setSaving(true)
    try {
      const res = await authAPI.updateProfile(form)
      updateUser(res.data.user || form)
      setEditing(false)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (!pwForm.current || !pwForm.newPw || !pwForm.confirm) {
      toast.error('Please fill in all password fields.')
      return
    }
    if (pwForm.newPw !== pwForm.confirm) {
      toast.error('New passwords do not match.')
      return
    }
    if (pwForm.newPw.length < 8) {
      toast.error('New password must be at least 8 characters.')
      return
    }
    setSavingPw(true)
    try {
      await authAPI.changePassword({ currentPassword: pwForm.current, newPassword: pwForm.newPw })
      setPwForm({ current: '', newPw: '', confirm: '' })
      toast.success('Password changed successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password.')
    } finally {
      setSavingPw(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      toast.error('Type DELETE to confirm.')
      return
    }
    setDeleting(true)
    try {
      await authAPI.deleteAccount()
      logout()
      toast.success('Account deleted.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account.')
      setDeleting(false)
    }
  }

  const statsData = [
    { icon: FileText, label: 'Resumes Uploaded', value: user?.totalResumes ?? '—' },
    { icon: BarChart2, label: 'Analyses Run', value: user?.totalAnalyses ?? '—' },
    { icon: CheckCircle2, label: 'Best ATS Score', value: user?.bestAtsScore ?? '—' },
    { icon: Calendar, label: 'Member Since', value: user?.createdAt ? formatDate(user.createdAt) : '—' },
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* ── Header ──────────────────────────────────────── */}
      <div>
        <h1
          className="font-display font-black text-dark-teal dark:text-cream uppercase"
          style={{ fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 0.9 }}
        >
          YOUR<br />
          <span style={{ WebkitTextStroke: '3px #0D3333', color: 'transparent' }}>
            PROFILE.
          </span>
        </h1>
      </div>

      {/* ── User Overview Card ───────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-teal border-2 border-dark-teal p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6"
      >
        {/* Avatar */}
        <div
          className="w-20 h-20 flex items-center justify-center font-display font-black text-3xl shrink-0"
          style={{ background: '#C8FF00', color: '#0D3333' }}
        >
          {getInitials(user?.name)}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h2 className="font-display font-black text-cream text-3xl uppercase">{user?.name}</h2>
          <p className="text-cream/50 text-sm mt-1">{user?.email}</p>
          <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
            <span className="px-3 py-1 font-bold text-xs uppercase tracking-widest border border-lime/40 text-lime">
              {user?.plan || 'FREE'} PLAN
            </span>
            {user?.createdAt && (
              <span className="px-3 py-1 font-bold text-xs uppercase tracking-widest border border-white/10 text-cream/40">
                JOINED {formatDate(user.createdAt)}
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Stats ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statsData.map(({ icon: Icon, label, value }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-dark-teal border-2 border-dark-teal p-4 text-center"
          >
            <Icon className="w-4 h-4 text-lime mx-auto mb-2" />
            <p className="font-display font-black text-lime text-2xl">{value}</p>
            <p className="text-cream/50 text-xs uppercase tracking-wider mt-1 leading-tight">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Edit Profile ─────────────────────────────────── */}
      <Section title="EDIT PROFILE">
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              disabled={!editing}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              disabled={!editing}
              className={inputClass}
            />
          </div>

          <div className="flex gap-3 pt-2">
            {editing ? (
              <>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 font-display font-black text-xs uppercase tracking-widest text-dark-teal transition-all hover:bg-lime-dark disabled:opacity-50"
                  style={{ background: '#C8FF00' }}
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'SAVING...' : 'SAVE CHANGES'}
                </button>
                <button
                  onClick={() => { setEditing(false); setForm({ name: user?.name, email: user?.email }) }}
                  className="px-6 py-3 border-2 border-dark-teal dark:border-cream/20 text-dark-teal dark:text-cream font-display font-black text-xs uppercase tracking-widest hover:bg-dark-teal hover:text-cream dark:hover:bg-cream/10 transition-all"
                >
                  CANCEL
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-6 py-3 border-2 border-dark-teal dark:border-cream/20 text-dark-teal dark:text-cream font-display font-black text-xs uppercase tracking-widest hover:border-lime hover:text-lime transition-all"
              >
                <User className="w-4 h-4" />
                EDIT PROFILE
              </button>
            )}
          </div>
        </div>
      </Section>

      {/* ── Change Password ──────────────────────────────── */}
      <Section title="CHANGE PASSWORD">
        <form onSubmit={handleChangePassword} className="space-y-4">
          {[
            { key: 'current', label: 'Current Password', placeholder: 'Your current password' },
            { key: 'newPw', label: 'New Password', placeholder: 'At least 8 characters' },
            { key: 'confirm', label: 'Confirm New Password', placeholder: 'Re-enter new password' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className={labelClass}>{label}</label>
              <div className="relative">
                <input
                  type={showPw[key] ? 'text' : 'password'}
                  value={pwForm[key]}
                  onChange={e => setPwForm(p => ({ ...p, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => ({ ...p, [key]: !p[key] }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-teal/40 hover:text-dark-teal dark:text-cream/40 dark:hover:text-cream transition-colors"
                >
                  {showPw[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={savingPw}
            className="flex items-center gap-2 px-6 py-3 font-display font-black text-xs uppercase tracking-widest text-dark-teal transition-all hover:bg-lime-dark disabled:opacity-50"
            style={{ background: '#C8FF00' }}
          >
            <Lock className="w-4 h-4" />
            {savingPw ? 'CHANGING...' : 'CHANGE PASSWORD'}
          </button>
        </form>
      </Section>

      {/* ── Danger Zone ──────────────────────────────────── */}
      <Section title="DANGER ZONE">
        <div className="border-2 border-red-500/30 p-5 bg-red-500/5">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-dark-teal dark:text-cream text-sm mb-1">Delete Account</h3>
              <p className="text-dark-teal/60 dark:text-cream/60 text-sm">
                This action is permanent and cannot be undone. All your resumes, analyses, and data will be deleted.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-red-400 mb-2">
                Type DELETE to confirm
              </label>
              <input
                type="text"
                value={deleteConfirm}
                onChange={e => setDeleteConfirm(e.target.value)}
                placeholder="DELETE"
                className="px-4 py-2.5 bg-white dark:bg-dark-teal border-2 border-red-500/30 focus:border-red-500 text-dark-teal dark:text-cream text-sm focus:outline-none w-full sm:w-auto"
              />
            </div>

            <button
              onClick={handleDeleteAccount}
              disabled={deleting || deleteConfirm !== 'DELETE'}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white font-display font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              {deleting ? 'DELETING...' : 'DELETE MY ACCOUNT'}
            </button>
          </div>
        </div>
      </Section>
    </div>
  )
}
