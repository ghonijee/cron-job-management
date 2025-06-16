// ==========================================
// Authentication Service - Main Export
// ==========================================

export { AuthService, createAuthService, getAuthService, setAuthService } from './authService';
export { authService, authHelpers } from './authService';
export { cookieConfig, getAuthRequestConfig } from './cookieConfig';

// Re-export types for convenience
export type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  UserInfoResponse,
  TokenVerificationResponse,
} from '@/types/auth';
