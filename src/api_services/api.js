import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export default API_BASE_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export { api }

// ── Auth ──────────────────────────────────────────────────────────────────────

export function login(email, password) {
  return api.post('/auth/login', { email, password })
}

export function register(name, email, password, role) {
  return api.post('/auth/register', { name, email, password, role })
}

export function getMe() {
  return api.get('/auth/me')
}

// ── Applications (Applicant) ──────────────────────────────────────────────────

export function createApplication(data) {
  return api.post('/applications/', data)
}

export function updateApplication(id, data) {
  return api.put(`/applications/${id}`, data)
}

export function listMyApplications(params = {}) {
  return api.get('/applications/mine', { params })
}

// ── Applications (Reviewer) ───────────────────────────────────────────────────

export function listReviewQueue(params = {}) {
  return api.get('/applications/queue', { params })
}

// ── Shared ────────────────────────────────────────────────────────────────────

export function getApplicationDetail(id) {
  return api.get(`/applications/${id}`)
}

export function transitionApplication(id, action, comment = '') {
  return api.post(`/applications/${id}/transition`, { action, comment })
}

// ── Notifications ─────────────────────────────────────────────────────────────

export function getNotifications(params = {}) {
  return api.get('/notifications/', { params })
}
