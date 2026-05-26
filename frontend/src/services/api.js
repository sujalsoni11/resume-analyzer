import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  googleLogin: (token) => api.post('/auth/google', { token }),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  deleteAccount: () => api.delete('/auth/account'),
}

// ─── Resumes ─────────────────────────────────────────────────────────────────
export const resumeAPI = {
  upload: (formData) =>
    api.post('/resumes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getAll: (params) => api.get('/resumes', { params }),
  getOne: (id) => api.get(`/resumes/${id}`),
  delete: (id) => api.delete(`/resumes/${id}`),
}

// ─── Analysis ────────────────────────────────────────────────────────────────
export const analysisAPI = {
  create: (data) => api.post('/analysis', data),
  getAll: (params) => api.get('/analysis', { params }),
  getOne: (id) => api.get(`/analysis/${id}`),
  getDashboard: () => api.get('/analysis/dashboard'),
  toggleBookmark: (id) => api.patch(`/analysis/${id}/bookmark`),
  getBookmarks: () => api.get('/analysis/bookmarks'),
  downloadReport: (id) =>
    api.get(`/analysis/${id}/download`, { responseType: 'blob' }),
  delete: (id) => api.delete(`/analysis/${id}`),
}

export default api
