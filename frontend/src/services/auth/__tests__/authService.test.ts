import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AuthService, authService, authHelpers } from '../authService';
import { AuthError, AuthErrorType } from '@/types/auth/errors';
import type { LoginRequest } from '@/types/auth';
import { apiClient } from '@/services/shared/apiClient';

// Mock the API client
vi.mock('@/services/shared/apiClient', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    service = new AuthService();
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        data: {
          success: true,
          message: 'Login successful',
          data: {
            user: {
              id: '1',
              email: 'test@example.com',
              name: 'Test User',
              role: 'admin' as const,
              last_login: '2024-01-15T10:30:00Z',
              created_at: '2024-01-01T00:00:00Z',
            },
            token: 'jwt-token',
            expires_at: '2024-01-16T10:30:00Z',
            remember_me: false,
          },
        },
      };

      // Mock successful API response
      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const result = await service.login(credentials);

      expect(apiClient.post).toHaveBeenCalledWith(
        '/auth/login',
        credentials,
        { withCredentials: true }
      );
      expect(result.success).toBe(true);
      expect(result.data?.user.email).toBe('test@example.com');
    });

    it('should handle invalid credentials error', async () => {
      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const mockError = {
        isAxiosError: true,
        response: {
          status: 401,
          data: {
            success: false,
            message: 'Invalid email or password',
            data: null,
          },
        },
      };

      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      await expect(service.login(credentials)).rejects.toThrow(AuthError);
      
      try {
        await service.login(credentials);
      } catch (error) {
        expect(error).toBeInstanceOf(AuthError);
        expect((error as AuthError).type).toBe(AuthErrorType.INVALID_CREDENTIALS);
      }
    });

    it('should handle rate limiting error', async () => {
      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockError = {
        isAxiosError: true,
        response: {
          status: 429,
          data: {
            success: false,
            message: 'Too many login attempts',
            data: { retry_after: 900 },
          },
        },
      };

      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      try {
        await service.login(credentials);
      } catch (error) {
        expect(error).toBeInstanceOf(AuthError);
        expect((error as AuthError).type).toBe(AuthErrorType.RATE_LIMITED);
        expect((error as AuthError).details?.retryAfter).toBe(900);
      }
    });

    it('should handle validation errors', async () => {
      const credentials: LoginRequest = {
        email: 'invalid-email',
        password: '123',
      };

      const mockError = {
        isAxiosError: true,
        response: {
          status: 400,
          data: {
            success: false,
            message: 'Validation failed',
            errors: {
              email: ['Invalid email format'],
              password: ['Password too short'],
            },
          },
        },
      };

      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      try {
        await service.login(credentials);
      } catch (error) {
        expect(error).toBeInstanceOf(AuthError);
        expect((error as AuthError).type).toBe(AuthErrorType.VALIDATION_ERROR);
        expect((error as AuthError).details?.errors).toBeDefined();
      }
    });

    it('should handle network errors', async () => {
      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      const networkError = new Error('Network Error');
      vi.mocked(apiClient.post).mockRejectedValue(networkError);

      try {
        await service.login(credentials);
      } catch (error) {
        expect(error).toBeInstanceOf(AuthError);
        expect((error as AuthError).type).toBe(AuthErrorType.NETWORK_ERROR);
      }
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Logout successful',
          data: null,
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const result = await service.logout();

      expect(apiClient.post).toHaveBeenCalledWith(
        '/auth/logout',
        {},
        { withCredentials: true }
      );
      expect(result.success).toBe(true);
    });

    it('should handle logout errors', async () => {
      const mockError = {
        isAxiosError: true,
        response: {
          status: 401,
          data: {
            success: false,
            message: 'Invalid token',
            data: null,
          },
        },
      };

      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      try {
        await service.logout();
      } catch (error) {
        expect(error).toBeInstanceOf(AuthError);
        expect((error as AuthError).type).toBe(AuthErrorType.INVALID_CREDENTIALS);
      }
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'User information retrieved',
          data: {
            user: {
              id: '1',
              email: 'test@example.com',
              name: 'Test User',
              role: 'admin' as const,
              last_login: '2024-01-15T10:30:00Z',
              created_at: '2024-01-01T00:00:00Z',
              session_expires_at: '2024-01-16T10:30:00Z',
            },
          },
        },
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await service.getCurrentUser();

      expect(apiClient.get).toHaveBeenCalledWith(
        '/auth/me',
        { withCredentials: true }
      );
      expect(result.success).toBe(true);
      expect(result.data?.user.email).toBe('test@example.com');
    });

    it('should handle unauthorized access', async () => {
      const mockError = {
        isAxiosError: true,
        response: {
          status: 401,
          data: {
            success: false,
            message: 'Unauthorized',
            data: null,
          },
        },
      };

      vi.mocked(apiClient.get).mockRejectedValue(mockError);

      try {
        await service.getCurrentUser();
      } catch (error) {
        expect(error).toBeInstanceOf(AuthError);
        expect((error as AuthError).type).toBe(AuthErrorType.INVALID_CREDENTIALS);
      }
    });
  });

  describe('verifyToken', () => {
    it('should verify token successfully', async () => {
      const token = 'test-token';
      const mockResponse = {
        data: {
          success: true,
          message: 'Token is valid',
          data: {
            valid: true,
            expires_at: '2024-01-16T10:30:00Z',
            user_id: '1',
          },
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const result = await service.verifyToken(token);

      expect(apiClient.post).toHaveBeenCalledWith(
        '/auth/verify-token',
        { token },
        { withCredentials: true }
      );
      expect(result.success).toBe(true);
      expect(result.data?.valid).toBe(true);
    });

    it('should handle invalid token', async () => {
      const token = 'invalid-token';
      const mockError = {
        isAxiosError: true,
        response: {
          status: 401,
          data: {
            success: false,
            message: 'Token is invalid',
            data: {
              valid: false,
              reason: 'expired',
            },
          },
        },
      };

      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      try {
        await service.verifyToken(token);
      } catch (error) {
        expect(error).toBeInstanceOf(AuthError);
        expect((error as AuthError).type).toBe(AuthErrorType.INVALID_CREDENTIALS);
      }
    });
  });

  describe('convenience API', () => {
    it('should use the same service instance', async () => {
      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        data: {
          success: true,
          message: 'Login successful',
          data: {
            user: {
              id: '1',
              email: 'test@example.com',
              name: 'Test User',
              role: 'admin' as const,
              last_login: '2024-01-15T10:30:00Z',
              created_at: '2024-01-01T00:00:00Z',
            },
            token: 'jwt-token',
            expires_at: '2024-01-16T10:30:00Z',
            remember_me: false,
          },
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const result = await authService.login(credentials);

      expect(apiClient.post).toHaveBeenCalledWith(
        '/auth/login',
        credentials,
        { withCredentials: true }
      );
      expect(result.success).toBe(true);
    });
  });

  describe('authHelpers', () => {
    it('should check authentication status successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            user: { id: '1', email: 'test@example.com' },
          },
        },
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await authHelpers.checkAuthentication();

      expect(result.isAuthenticated).toBe(true);
      expect(result.user).toBeDefined();
    });

    it('should handle authentication check failure', async () => {
      vi.mocked(apiClient.get).mockRejectedValue(new Error('Unauthorized'));

      const result = await authHelpers.checkAuthentication();

      expect(result.isAuthenticated).toBe(false);
      expect(result.user).toBeUndefined();
    });

    it('should perform silent logout', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      authHelpers.silentLogout();
      
      expect(consoleSpy).toHaveBeenCalledWith('Silent logout performed');
      consoleSpy.mockRestore();
    });

    it('should extract error messages correctly', () => {
      const authError = new AuthError(
        AuthErrorType.INVALID_CREDENTIALS,
        'Invalid credentials'
      );
      const regularError = new Error('Network error');
      const unknownError = { message: 'Unknown' };

      expect(authHelpers.getErrorMessage(authError)).toBe('Invalid credentials');
      expect(authHelpers.getErrorMessage(regularError)).toBe('Network error');
      expect(authHelpers.getErrorMessage(unknownError)).toBe('An unexpected error occurred');
    });

    it('should identify authentication errors', () => {
      const authError = new AuthError(
        AuthErrorType.INVALID_CREDENTIALS,
        'Invalid credentials'
      );
      const tokenExpiredError = new AuthError(
        AuthErrorType.TOKEN_EXPIRED,
        'Token expired'
      );
      const networkError = new AuthError(
        AuthErrorType.NETWORK_ERROR,
        'Network error'
      );
      const regularError = new Error('Regular error');

      expect(authHelpers.isAuthenticationError(authError)).toBe(true);
      expect(authHelpers.isAuthenticationError(tokenExpiredError)).toBe(true);
      expect(authHelpers.isAuthenticationError(networkError)).toBe(false);
      expect(authHelpers.isAuthenticationError(regularError)).toBe(false);
    });
  });
});
