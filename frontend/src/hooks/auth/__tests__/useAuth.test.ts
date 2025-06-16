import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { AuthError, AuthErrorType } from '@/types/auth/errors';
import type { User, LoginRequest } from '@/types/auth';

// Mock auth service
vi.mock('@/services/auth/authService', () => ({
  authService: {
    login: vi.fn(),
    logout: vi.fn(),
  },
  authHelpers: {
    checkAuthentication: vi.fn(),
  },
}));

// Mock API client
vi.mock('@/services/shared/apiClient', () => ({
  getApiClient: vi.fn(() => ({
    updateConfig: vi.fn(),
  })),
}));

describe('useAuth Hook', () => {
  const mockUser: User = {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-01-15T10:30:00Z',
  };

  const mockCredentials: LoginRequest = {
    email: 'test@example.com',
    password: 'password123',
    rememberMe: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial state before auth check completes', async () => {
      const { authHelpers } = await import('@/services/auth/authService');
      
      // Mock checkAuthentication to never resolve to avoid auto-initialization
      let resolveAuth: (value: any) => void;
      const authPromise = new Promise(resolve => {
        resolveAuth = resolve;
      });
      vi.mocked(authHelpers.checkAuthentication).mockReturnValue(authPromise);

      const { result } = renderHook(() => useAuth());
      
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isInitialized).toBe(false);
      expect(result.current.error).toBeNull();
      
      // Should be loading during initial auth check
      expect(result.current.isLoading).toBe(true);

      // Clean up - resolve the promise to prevent warnings
      await act(async () => {
        resolveAuth!({ isAuthenticated: false });
        await authPromise;
      });
    });

    it('should initialize authentication check on mount', async () => {
      const { authHelpers } = await import('@/services/auth/authService');
      vi.mocked(authHelpers.checkAuthentication).mockResolvedValue({
        isAuthenticated: false,
      });

      renderHook(() => useAuth());

      // Wait for initial auth check
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(authHelpers.checkAuthentication).toHaveBeenCalled();
    });
  });

  describe('Login Functionality', () => {
    it('should update state on successful login', async () => {
      const { authService } = await import('@/services/auth/authService');
      vi.mocked(authService.login).mockResolvedValue({
        success: true,
        message: 'Login successful',
        data: { user: mockUser },
      });

      const { result } = renderHook(() => useAuth());
      
      await act(async () => {
        await result.current.login(mockCredentials);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle login failure with error state', async () => {
      const { authService } = await import('@/services/auth/authService');
      const authError = new AuthError(
        AuthErrorType.INVALID_CREDENTIALS,
        'Invalid email or password'
      );
      
      vi.mocked(authService.login).mockRejectedValue(authError);

      const { result } = renderHook(() => useAuth());
      
      await act(async () => {
        try {
          await result.current.login(mockCredentials);
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toEqual(authError);
    });

    it('should handle invalid response format', async () => {
      const { authService } = await import('@/services/auth/authService');
      vi.mocked(authService.login).mockResolvedValue({
        success: false,
        message: 'Login failed',
        data: null,
      });

      const { result } = renderHook(() => useAuth());
      
      await act(async () => {
        try {
          await result.current.login(mockCredentials);
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error?.type).toBe(AuthErrorType.INVALID_CREDENTIALS);
    });

    it('should show loading state during login', async () => {
      const { authService } = await import('@/services/auth/authService');
      let resolveLogin: (value: any) => void;
      const loginPromise = new Promise(resolve => {
        resolveLogin = resolve;
      });
      
      vi.mocked(authService.login).mockReturnValue(loginPromise);

      const { result } = renderHook(() => useAuth());
      
      // Start login
      act(() => {
        result.current.login(mockCredentials);
      });

      // Should be in loading state
      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBeNull();

      // Resolve login
      await act(async () => {
        resolveLogin!({
          success: true,
          data: { user: mockUser },
        });
        await loginPromise;
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Logout Functionality', () => {
    it('should clear state on logout', async () => {
      const { authService } = await import('@/services/auth/authService');
      vi.mocked(authService.logout).mockResolvedValue({
        success: true,
        message: 'Logout successful',
        data: null,
      });

      const { result } = renderHook(() => useAuth());
      
      // Set up authenticated state first
      await act(async () => {
        result.current.login = vi.fn().mockImplementation(async () => {
          // Mock successful login without API call
        });
      });

      // Manually set authenticated state for testing
      act(() => {
        // This would normally be done by login, but we'll simulate it
        (result.current as any).user = mockUser;
        (result.current as any).isAuthenticated = true;
      });

      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should logout even if API call fails', async () => {
      const { authService } = await import('@/services/auth/authService');
      vi.mocked(authService.logout).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useAuth());
      
      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('Authentication Check', () => {
    it('should update state when check auth returns authenticated user', async () => {
      const { authHelpers } = await import('@/services/auth/authService');
      vi.mocked(authHelpers.checkAuthentication).mockResolvedValue({
        isAuthenticated: true,
        user: mockUser,
      });

      const { result } = renderHook(() => useAuth());
      
      await act(async () => {
        await result.current.checkAuth();
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isInitialized).toBe(true);
    });

    it('should clear state when check auth returns not authenticated', async () => {
      const { authHelpers } = await import('@/services/auth/authService');
      vi.mocked(authHelpers.checkAuthentication).mockResolvedValue({
        isAuthenticated: false,
      });

      const { result } = renderHook(() => useAuth());
      
      await act(async () => {
        await result.current.checkAuth();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isInitialized).toBe(true);
    });

    it('should handle check auth errors gracefully', async () => {
      const { authHelpers } = await import('@/services/auth/authService');
      vi.mocked(authHelpers.checkAuthentication).mockRejectedValue(
        new Error('Network error')
      );

      const { result } = renderHook(() => useAuth());
      
      await act(async () => {
        await result.current.checkAuth();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isInitialized).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should clear error when clearError is called', async () => {
      const { authService } = await import('@/services/auth/authService');
      const authError = new AuthError(
        AuthErrorType.INVALID_CREDENTIALS,
        'Invalid credentials'
      );
      
      vi.mocked(authService.login).mockRejectedValue(authError);

      const { result } = renderHook(() => useAuth());
      
      // Trigger an error
      await act(async () => {
        try {
          await result.current.login(mockCredentials);
        } catch (error) {
          // Expected
        }
      });

      expect(result.current.error).toEqual(authError);

      // Clear the error
      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });

    it('should transform unknown errors to AuthError', async () => {
      const { authService } = await import('@/services/auth/authService');
      vi.mocked(authService.login).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useAuth());
      
      await act(async () => {
        try {
          await result.current.login(mockCredentials);
        } catch (error) {
          // Expected
        }
      });

      expect(result.current.error).toBeInstanceOf(AuthError);
      expect(result.current.error?.type).toBe(AuthErrorType.UNKNOWN_ERROR);
      expect(result.current.error?.message).toBe('Network error');
    });
  });

  describe('API Client Integration', () => {
    it('should setup authentication failure callback', async () => {
      const { getApiClient } = await import('@/services/shared/apiClient');
      const mockUpdateConfig = vi.fn();
      
      vi.mocked(getApiClient).mockReturnValue({
        updateConfig: mockUpdateConfig,
      } as any);

      renderHook(() => useAuth());

      // Wait for effect to run
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(mockUpdateConfig).toHaveBeenCalledWith({
        onAuthenticationFailed: expect.any(Function),
      });
    });
  });

  describe('Development Helpers', () => {
    it('should provide debug state in development', () => {
      const { result } = renderHook(() => useAuth());
      
      if (import.meta.env.DEV) {
        expect(typeof result.current.debugState).toBe('function');
      } else {
        expect(result.current.debugState).toBeUndefined();
      }
    });
  });
});