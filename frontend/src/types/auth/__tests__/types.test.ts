import { describe, it, expect } from 'vitest';
import { AuthError, AuthErrorType, isAuthError } from '../errors';
import type { User, LoginRequest, AuthState } from '../index';

describe('Authentication Types', () => {
  describe('User Type', () => {
    it('should match API contract structure', () => {
      const user: User = {
        id: 'usr_123',
        email: 'admin@company.com',
        name: 'John Admin',
        role: 'admin',
        last_login: '2024-01-15T10:30:00Z',
        created_at: '2024-01-01T00:00:00Z'
      };

      expect(user.role).toBe('admin');
      expect(typeof user.id).toBe('string');
      expect(typeof user.email).toBe('string');
    });

    it('should support optional session_expires_at', () => {
      const userWithSession: User = {
        id: 'usr_123',
        email: 'admin@company.com',
        name: 'John Admin',
        role: 'admin',
        last_login: '2024-01-15T10:30:00Z',
        created_at: '2024-01-01T00:00:00Z',
        session_expires_at: '2024-01-16T10:30:00Z'
      };

      expect(userWithSession.session_expires_at).toBe('2024-01-16T10:30:00Z');
    });
  });

  describe('LoginRequest Type', () => {
    it('should have required fields', () => {
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'password123'
      };

      expect(loginRequest.email).toBe('test@example.com');
      expect(loginRequest.password).toBe('password123');
    });

    it('should support optional remember_me', () => {
      const loginWithRemember: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
        remember_me: true
      };

      expect(loginWithRemember.remember_me).toBe(true);
    });
  });

  describe('AuthState Type', () => {
    it('should have correct structure', () => {
      const authState: AuthState = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: false,
        error: null
      };

      expect(authState.isAuthenticated).toBe(false);
      expect(authState.user).toBeNull();
    });
  });

  describe('AuthError', () => {
    it('should create structured error objects', () => {
      const error = AuthError.invalidCredentials();
      
      expect(error.type).toBe(AuthErrorType.INVALID_CREDENTIALS);
      expect(error.message).toBe('Invalid email or password');
      expect(isAuthError(error)).toBe(true);
    });

    it('should handle rate limiting with retry info', () => {
      const error = AuthError.rateLimited(900);
      
      expect(error.type).toBe(AuthErrorType.RATE_LIMITED);
      expect(error.statusCode).toBe(429);
      expect(error.details?.retryAfter).toBe(900);
      expect(error.message).toContain('15 minutes');
    });

    it('should handle token expiration', () => {
      const error = AuthError.tokenExpired();
      
      expect(error.type).toBe(AuthErrorType.TOKEN_EXPIRED);
      expect(error.message).toContain('session has expired');
    });

    it('should handle network errors', () => {
      const error = AuthError.networkError();
      
      expect(error.type).toBe(AuthErrorType.NETWORK_ERROR);
      expect(error.message).toContain('Network error');
    });

    it('should identify AuthError instances', () => {
      const authError = new AuthError(AuthErrorType.SERVER_ERROR, 'Server error');
      const regularError = new Error('Regular error');
      
      expect(isAuthError(authError)).toBe(true);
      expect(isAuthError(regularError)).toBe(false);
      expect(isAuthError(null)).toBe(false);
      expect(isAuthError(undefined)).toBe(false);
    });
  });
});
