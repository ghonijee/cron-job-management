import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios, { AxiosError } from 'axios';
import { ApiClient } from '../apiClient';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

// Mock auth service
vi.mock('@/services/auth/authService', () => ({
  authHelpers: {
    checkAuthentication: vi.fn(),
  },
}));

describe('ApiClient Authentication Interceptors', () => {
  let apiClient: ApiClient;
  let mockAxiosInstance: any;
  let requestInterceptor: any;
  let responseSuccessInterceptor: any;
  let responseErrorInterceptor: any;

  beforeEach(() => {
    mockAxiosInstance = vi.fn();
    Object.assign(mockAxiosInstance, {
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
      request: vi.fn(),
      defaults: {
        headers: {},
      },
    });

    mockedAxios.create.mockReturnValue(mockAxiosInstance);
    
    apiClient = new ApiClient({
      baseURL: 'http://localhost:3000/api',
      timeout: 5000,
      headers: {},
      retryAttempts: 3,
      enableLogging: false,
    });

    // Extract the interceptor functions
    requestInterceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
    responseSuccessInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls[0][0];
    responseErrorInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls[0][1];
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Request Interceptor', () => {
    it('should add withCredentials for authenticated endpoints', () => {
      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
      
      const config = requestInterceptor({ url: '/users' });
      
      expect(config.withCredentials).toBe(true);
    });

    it('should skip withCredentials for public endpoints', () => {
      const config = requestInterceptor({ url: '/auth/login' });
      
      expect(config.withCredentials).toBeUndefined();
    });

    it('should handle login endpoint as public', () => {
      const config = requestInterceptor({ url: '/auth/login' });
      
      expect(config.withCredentials).toBeUndefined();
    });

    it('should handle verify-token endpoint as public', () => {
      const config = requestInterceptor({ url: '/auth/verify-token' });
      
      expect(config.withCredentials).toBeUndefined();
    });
  });

  describe('Response Interceptor', () => {
    it('should update statistics on successful response', () => {
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
      
      const response = { data: { success: true } };
      const result = responseSuccessInterceptor(response);
      
      expect(result).toBe(response);
      expect(apiClient.getStatus().totalRequests).toBe(1);
    });

    it('should handle 401 errors with authentication flow', async () => {
      const error = {
        response: { status: 401 },
        config: { url: '/users', _retry: undefined },
      };

      // Mock authentication check to return false (not authenticated)
      const { authHelpers } = await import('@/services/auth/authService');
      vi.mocked(authHelpers.checkAuthentication).mockResolvedValue({
        isAuthenticated: false,
      });

      await expect(responseErrorInterceptor(error)).rejects.toEqual(error);
    });

    it('should handle 403 errors with authentication flow', async () => {
      const error = {
        response: { status: 403 },
        config: { url: '/users', _retry: undefined },
      };

      // Mock authentication check to return false
      const { authHelpers } = await import('@/services/auth/authService');
      vi.mocked(authHelpers.checkAuthentication).mockResolvedValue({
        isAuthenticated: false,
      });

      await expect(responseErrorInterceptor(error)).rejects.toEqual(error);
    });

    it('should skip authentication retry for public endpoints', async () => {
      const error = {
        response: { status: 401 },
        config: { url: '/auth/login' },
      };

      await expect(responseErrorInterceptor(error)).rejects.toEqual(error);
    });

    it('should reject if request was already retried', async () => {
      const error = {
        response: { status: 401 },
        config: { url: '/users', _retry: true },
      };

      await expect(responseErrorInterceptor(error)).rejects.toEqual(error);
    });

    it('should pass through non-authentication errors', async () => {
      const error = {
        response: { status: 500 },
        config: { url: '/users' },
      };

      await expect(responseErrorInterceptor(error)).rejects.toEqual(error);
    });
  });

  describe('Token Refresh Flow', () => {
    it('should retry request after successful authentication check', async () => {
      const originalRequest = { url: '/users', _retry: undefined };
      const error = {
        response: { status: 401 },
        config: originalRequest,
      };

      // Mock successful authentication check
      const { authHelpers } = await import('@/services/auth/authService');
      vi.mocked(authHelpers.checkAuthentication).mockResolvedValue({
        isAuthenticated: true,
      });

      // Mock successful retry
      const retryResponse = { data: { success: true } };
      mockAxiosInstance.mockResolvedValue(retryResponse);

      const result = await responseErrorInterceptor(error);
      
      expect(authHelpers.checkAuthentication).toHaveBeenCalled();
      expect(mockAxiosInstance).toHaveBeenCalledWith(originalRequest);
      expect(originalRequest._retry).toBe(true);
    });

    it('should call onAuthenticationFailed callback when refresh fails', async () => {
      const onAuthenticationFailed = vi.fn();
      
      // Create new client with callback
      const newApiClient = new ApiClient({
        baseURL: 'http://localhost:3000/api',
        timeout: 5000,
        headers: {},
        retryAttempts: 3,
        enableLogging: false,
        onAuthenticationFailed,
      });

      const newErrorInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls[1][1];
      
      const error = {
        response: { status: 401 },
        config: { url: '/users', _retry: undefined },
      };

      // Mock failed authentication check
      const { authHelpers } = await import('@/services/auth/authService');
      vi.mocked(authHelpers.checkAuthentication).mockResolvedValue({
        isAuthenticated: false,
      });

      await expect(newErrorInterceptor(error)).rejects.toEqual(error);
      expect(onAuthenticationFailed).toHaveBeenCalled();
    });
  });

  describe('Request Queuing', () => {
    it('should queue concurrent requests during refresh', async () => {
      const firstError = {
        response: { status: 401 },
        config: { url: '/users', _retry: undefined },
      };

      const secondError = {
        response: { status: 401 },
        config: { url: '/categories', _retry: undefined },
      };

      // Mock authentication check with delay
      const { authHelpers } = await import('@/services/auth/authService');
      vi.mocked(authHelpers.checkAuthentication).mockImplementation(
        () => new Promise(resolve => 
          setTimeout(() => resolve({ isAuthenticated: true }), 100)
        )
      );

      mockAxiosInstance.mockResolvedValue({ data: { success: true } });

      // Start both requests
      const firstPromise = responseErrorInterceptor(firstError);
      const secondPromise = responseErrorInterceptor(secondError);

      // Both should resolve successfully
      await expect(Promise.all([firstPromise, secondPromise])).resolves.toBeDefined();
      
      // Authentication should only be checked once
      expect(authHelpers.checkAuthentication).toHaveBeenCalledTimes(1);
    });
  });
});