import axios from 'axios'
import { tokenStorage, isTokenExpired } from './auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// Import authApi for refresh token handling
const getAuthApi = async () => {
  const { authApi } = await import('../api/auth.api')
  return authApi
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessToken()
    if (token && !isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for token refresh and error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = tokenStorage.getRefreshToken()
        if (refreshToken) {
          const authApi = await getAuthApi()
          const authResponse = await authApi.refreshToken({ refreshToken })
          
          tokenStorage.setAccessToken(authResponse.accessToken)
          tokenStorage.setRefreshToken(authResponse.refreshToken)
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${authResponse.accessToken}`
          return apiClient(originalRequest)
        }
      } catch {
        // Refresh failed, clear tokens and redirect to login
        tokenStorage.clearTokens()
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient