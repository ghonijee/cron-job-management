import { apiClient } from '@/services/shared/apiClient';
import { AuthError, AuthErrorType } from '@/types/auth/errors';
import type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  UserInfoResponse,
  TokenVerificationResponse,
} from '@/types/auth';
import type { AxiosError } from 'axios';

// ==========================================
// Authentication Service Class
// ==========================================

export class AuthService {
  private readonly baseUrl = '/auth';

  // ==========================================
  // Login Methods
  // ==========================================

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        `${this.baseUrl}/login`,
        credentials,
        {
          withCredentials: true, // Enable cookie handling
        }
      );

      return response.data;
    } catch (error) {
      throw this.handleAuthError(error, 'login');
    }
  }

  // ==========================================
  // Logout Methods
  // ==========================================

  async logout(): Promise<LogoutResponse> {
    try {
      const response = await apiClient.post<LogoutResponse>(
        `${this.baseUrl}/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      throw this.handleAuthError(error, 'logout');
    }
  }

  // ==========================================
  // User Info Methods
  // ==========================================

  async getCurrentUser(): Promise<UserInfoResponse> {
    try {
      const response = await apiClient.get<UserInfoResponse>(
        `${this.baseUrl}/me`,
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      throw this.handleAuthError(error, 'getCurrentUser');
    }
  }

  // ==========================================
  // Token Verification Methods
  // ==========================================

  async verifyToken(token: string): Promise<TokenVerificationResponse> {
    try {
      const response = await apiClient.post<TokenVerificationResponse>(
        `${this.baseUrl}/verify-token`,
        { token },
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      throw this.handleAuthError(error, 'verifyToken');
    }
  }

  // ==========================================
  // Error Handling
  // ==========================================

  private handleAuthError(error: unknown, operation: string): AuthError {
    if (this.isAxiosError(error)) {
      const { response } = error;

      // Handle specific HTTP status codes
      switch (response?.status) {
        case 401:
          return this.createAuthError(AuthErrorType.INVALID_CREDENTIALS, response.data);
        case 429:
          return this.createRateLimitError(response.data);
        case 400:
          return this.createValidationError(response.data);
        case 500:
          return new AuthError(
            AuthErrorType.SERVER_ERROR,
            'Server error occurred. Please try again later.',
            500
          );
        default:
          return new AuthError(
            AuthErrorType.UNKNOWN_ERROR,
            `Authentication ${operation} failed: ${error.message}`,
            response?.status
          );
      }
    }

    // Handle network errors
    if (error instanceof Error) {
      if (error.message.includes('Network Error') || error.message.includes('ERR_NETWORK')) {
        return AuthError.networkError();
      }
    }

    return new AuthError(
      AuthErrorType.UNKNOWN_ERROR,
      `Unexpected error during ${operation}`
    );
  }

  private createAuthError(type: AuthErrorType, responseData: any): AuthError {
    const message = responseData?.message || 'Authentication failed';
    return new AuthError(type, message, responseData?.status);
  }

  private createRateLimitError(responseData: any): AuthError {
    const retryAfter = responseData?.data?.retry_after || 900;
    return AuthError.rateLimited(retryAfter);
  }

  private createValidationError(responseData: any): AuthError {
    const message = responseData?.message || 'Validation failed';
    return new AuthError(
      AuthErrorType.VALIDATION_ERROR,
      message,
      400,
      { errors: responseData?.errors }
    );
  }

  private isAxiosError(error: unknown): error is AxiosError {
    return error !== null && typeof error === 'object' && 'isAxiosError' in error;
  }
}

// ==========================================
// Factory Functions and Singleton
// ==========================================

let defaultAuthService: AuthService | null = null;

export function createAuthService(): AuthService {
  return new AuthService();
}

export function getAuthService(): AuthService {
  if (!defaultAuthService) {
    defaultAuthService = new AuthService();
  }
  return defaultAuthService;
}

export function setAuthService(service: AuthService): void {
  defaultAuthService = service;
}

// ==========================================
// Convenience API
// ==========================================

export const authService = {
  login: (credentials: LoginRequest) => getAuthService().login(credentials),
  logout: () => getAuthService().logout(),
  getCurrentUser: () => getAuthService().getCurrentUser(),
  verifyToken: (token: string) => getAuthService().verifyToken(token),
};

// ==========================================
// Authentication Helper Functions
// ==========================================

export const authHelpers = {
  /**
   * Check if user is authenticated by calling /auth/me
   * Used for silent authentication checks
   */
  async checkAuthentication(): Promise<{ isAuthenticated: boolean; user?: any }> {
    try {
      const response = await authService.getCurrentUser();
      return {
        isAuthenticated: response.success && response.data !== null,
        user: response.data?.user,
      };
    } catch (error) {
      return { isAuthenticated: false };
    }
  },

  /**
   * Perform silent logout without API call
   * Used when we know the session is invalid
   */
  silentLogout(): void {
    // Clear any client-side state if needed
    // Note: httpOnly cookies are handled by the server
    console.log('Silent logout performed');
  },

  /**
   * Extract user-friendly error message from AuthError
   */
  getErrorMessage(error: unknown): string {
    if (error instanceof AuthError) {
      return error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unexpected error occurred';
  },

  /**
   * Check if error is related to authentication
   */
  isAuthenticationError(error: unknown): boolean {
    if (error instanceof AuthError) {
      return [
        AuthErrorType.INVALID_CREDENTIALS,
        AuthErrorType.TOKEN_EXPIRED,
        AuthErrorType.TOKEN_INVALID,
        AuthErrorType.UNAUTHORIZED,
      ].includes(error.type);
    }
    return false;
  },
};
