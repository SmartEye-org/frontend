import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import { API_URL } from '../constants'

// Create axios instance
const axiosClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    // Add auth token if exists
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error: AxiosError) => {
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  }
)

// Response interceptor
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`[API Response] ${response.config.url}`, response.status)
    return response
  },
  (error: AxiosError) => {
    console.error('[API Response Error]', error.response?.status, error.message)

    // Handle specific errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('auth_token')
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }

    if (error.response?.status === 403) {
      console.error('Access denied')
    }

    if (error.response?.status === 500) {
      console.error('Server error')
    }

    return Promise.reject(error)
  }
)

export default axiosClient
