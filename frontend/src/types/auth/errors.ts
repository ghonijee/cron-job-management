// ==========================================
// Authentication Error Types
// ==========================================

// Authentication error types based on API responses
export enum AuthErrorType {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RATE_LIMITED = 'RATE_LIMITED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// Authentication error class
export class AuthError extends Error {
  public readonly type: AuthErrorType;
  public readonly statusCode?: number;
  public readonly details?: Record<string, unknown>;

  constructor(
    type: AuthErrorType,
    message: string,
    statusCode?: number,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AuthError';
    this.type = type;
    this.statusCode = statusCode;
    this.details = details;
  }

  // Helper methods for common error types
  static invalidCredentials(): AuthError {
    return new AuthError(
      AuthErrorType.INVALID_CREDENTIALS,
      'Invalid email or password'
    );
  }

  static rateLimited(retryAfter: number): AuthError {
    return new AuthError(
      AuthErrorType.RATE_LIMITED,
      `Too many login attempts. Please try again in ${Math.ceil(retryAfter / 60)} minutes`,
      429,
      { retryAfter }
    );
  }

  static tokenExpired(): AuthError {
    return new AuthError(
      AuthErrorType.TOKEN_EXPIRED,
      'Your session has expired. Please log in again'
    );
  }

  static networkError(): AuthError {
    return new AuthError(
      AuthErrorType.NETWORK_ERROR,
      'Network error. Please check your connection and try again'
    );
  }
}

// Type guard for AuthError
export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError;
}
