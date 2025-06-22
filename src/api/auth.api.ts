import axios from 'axios'
import type { LoginCredentials, AuthResponse, RefreshTokenRequest } from '../types/auth.types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// Separate axios instance for auth endpoints (no interceptors to avoid circular dependency)
const authClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await authClient.post<AuthResponse>('/auth/login', credentials)
    return response.data
  },

  refreshToken: async (tokenData: RefreshTokenRequest): Promise<AuthResponse> => {
    const response = await authClient.post<AuthResponse>('/auth/refresh', tokenData)
    return response.data
  },

  logout: async (): Promise<void> => {
    // Optional: call backend logout endpoint if it exists
    await authClient.post('/auth/logout')
  }
}