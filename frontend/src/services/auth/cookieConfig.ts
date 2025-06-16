// ==========================================
// Cookie Configuration for Authentication
// ==========================================

export const cookieConfig = {
  // Request configuration for authenticated requests
  withCredentials: true,
  
  // Cookie settings that should be coordinated with backend
  security: {
    httpOnly: true,      // Managed by backend
    secure: true,        // HTTPS only in production
    sameSite: 'strict' as const,  // CSRF protection
  },
  
  // Cookie names (should match backend)
  names: {
    accessToken: 'access_token',
    refreshToken: 'refresh_token',
    sessionId: 'session_id',
  },
  
  // Expiration times (informational - actual expiry managed by backend)
  expiry: {
    accessToken: 24 * 60 * 60 * 1000,  // 24 hours
    refreshToken: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
};

// Helper to get cookie configuration for requests
export function getAuthRequestConfig() {
  return {
    withCredentials: cookieConfig.withCredentials,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };
}
