import axios from 'axios'
import Cookies from 'js-cookie'
import { clearAuthData } from './auth'

// Create axios instance
const api = axios.create({
  // baseURL: 'http://localhost:5000',
  baseURL: 'https://api.cnhtc4.com',
  timeout: 10000,
})

// Flag to prevent multiple logout attempts
let isLoggingOut = false

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('jwt')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('[Request Error]', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isResetPasswordRoute = 
      error.config?.url?.includes('/reset-password') || 
      error.config?.url?.includes('/forgot-password')

    if (
      error.response?.status === 401 && 
      !isLoggingOut && 
      !isResetPasswordRoute &&
      typeof window !== 'undefined'
    ) {
      isLoggingOut = true
      
      try {
        await api.post('/logout')
      } catch (logoutError) {
        console.error('Logout error:', logoutError)
      }
      
      clearAuthData()
      
      // Force redirect to login
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

export default api