// ==========================================
// Authentication Response Types
// ==========================================

import { ApiResponse } from '@/types/shared/api';
import { User } from './user';

// Login successful response data
export interface LoginResponseData {
  user: User;
  token: string;
  expires_at: string; // ISO 8601 datetime
  remember_me: boolean;
}

// Token verification response data
export interface TokenVerificationData {
  valid: boolean;
  expires_at?: string; // Present if valid
  user_id?: string; // Present if valid
  reason?: 'expired' | 'invalid'; // Present if invalid
}

// User info response data (from /auth/me)
export interface UserInfoResponseData {
  user: User;
}

// Typed API responses
export type LoginResponse = ApiResponse<LoginResponseData>;
export type LogoutResponse = ApiResponse<null>;
export type UserInfoResponse = ApiResponse<UserInfoResponseData>;
export type TokenVerificationResponse = ApiResponse<TokenVerificationData>;
