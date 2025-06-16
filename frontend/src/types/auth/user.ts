// ==========================================
// User Types & Interfaces
// ==========================================

// Matches API contract exactly
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin'; // Admin-only system
  last_login: string; // ISO 8601 datetime
  created_at: string; // ISO 8601 datetime
  session_expires_at?: string; // Only present in /auth/me response
}

// For future extensibility if roles expand
export type UserRole = 'admin';

// User profile data that might be updated
export interface UserProfile {
  name: string;
  email: string;
}
