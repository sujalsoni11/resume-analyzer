import { useState, useCallback } from 'react'
import { analysisAPI } from '../services/api.js'
import toast from 'react-hot-toast'

export function useAnalysis() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const createAnalysis = useCallback(async (resumeId, jobRole) => {
    setLoading(true)
    setError(null)
    try {
      const res = await analysisAPI.create({ resumeId, jobRole })
      setData(res.data)
      return res.data
    } catch (err) {
      const msg = err.response?.data?.message || 'Analysis failed. Please try again.'
      setError(msg)
      toast.error(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAnalysis = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    try {
      const res = await analysisAPI.getOne(id)
      setData(res.data)
      return res.data
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch analysis.'
      setError(msg)
      toast.error(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return { loading, error, data, createAnalysis, fetchAnalysis, reset }
}
