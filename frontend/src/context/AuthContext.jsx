import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../services/api.js'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  const isAuthenticated = !!user

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem('token')
      if (!storedToken) {
        setLoading(false)
        return
      }
      try {
        const res = await authAPI.getMe()
        setUser(res.data.user || res.data)
        setToken(storedToken)
      } catch {
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    validateToken()
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await authAPI.login({ email, password })
    const { token: newToken, user: userData } = res.data
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(userData)
    toast.success(`Welcome back, ${userData.name}!`)
    return userData
  }, [])

  const loginWithGoogle = useCallback(async (googleToken) => {
    const res = await authAPI.googleLogin(googleToken)
    const { token: newToken, user: userData } = res.data
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(userData)
    toast.success(`Welcome, ${userData.name}!`)
    return userData
  }, [])

  const register = useCallback(async (name, email, password) => {
    const res = await authAPI.register({ name, email, password })
    const { token: newToken, user: userData } = res.data
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(userData)
    toast.success('Account created successfully!')
    return userData
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    toast.success('Logged out successfully.')
  }, [])

  const updateUser = useCallback((updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }))
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, loginWithGoogle, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
