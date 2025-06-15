import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import axios from 'axios';
import { ApiClient, getApiClient, createApiClient, setApiClient, apiClient } from '../apiClient';
import { env } from '@/utils/shared/env';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);


// Mock environment
vi.mock('@/utils/shared/env', () => ({
  env: {
    API_BASE_URL: 'https://api.example.com',
  },
}));

describe('ApiClient', () => {
  let mockAxiosInstance: any;

  beforeEach(() => {
    // Create mock axios instance
    mockAxiosInstance = {
      request: vi.fn(),
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      patch: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
      defaults: {
        headers: {},
        baseURL: 'https://api.example.com',
        timeout: 30000,
      },
    };

    // Reset axios mock
    mockedAxios.create = vi.fn().mockReturnValue(mockAxiosInstance);
    // mockedAxios.create

    // Reset console mocks
    vi.spyOn(console, 'log').mockImplementation(() => { });
    vi.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Clear singleton instance
    setApiClient(null as any);
    // Reset env mock
    vi.mocked(env).API_BASE_URL = 'https://api.example.com';
  });

  describe('constructor', () => {
    it('should create axios instance with correct base configuration', () => {
      new ApiClient();

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://api.example.com',
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        validateStatus: expect.any(Function),
      });
    });

    it('should merge custom config with defaults', () => {
      const customConfig = {
        timeout: 60000,
        headers: { 'Custom-Header': 'value' },
      };

      new ApiClient(customConfig);

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://api.example.com',
        timeout: 60000,
        headers: expect.objectContaining({
          'Custom-Header': 'value',
        }),
        validateStatus: expect.any(Function),
      });
    });

    it('should throw error when base URL is missing', () => {
      // Mock env to return empty base URL
      vi.mocked(env).API_BASE_URL = '';

      expect(() => {
        new ApiClient();
      }).toThrow('API_BASE_URL is required but not provided');
    });

    it('should throw error when base URL is invalid', () => {
      vi.mocked(env).API_BASE_URL = 'invalid-url';

      expect(() => {
        new ApiClient();
      }).toThrow('API_BASE_URL must be a valid HTTP/HTTPS URL');
    });

    it('should throw error when timeout is invalid', () => {
      // Set valid URL first
      vi.mocked(env).API_BASE_URL = 'https://api.example.com';

      expect(() => {
        new ApiClient({ timeout: -1 });
      }).toThrow('Timeout must be a positive number');
    });

    it('should throw error when retry attempts is negative', () => {
      // Set valid URL first
      vi.mocked(env).API_BASE_URL = 'https://api.example.com';

      expect(() => {
        new ApiClient({ retryAttempts: -1 });
      }).toThrow('Retry attempts must be a non-negative number');
    });
  });

  describe('HTTP methods', () => {
    let client: ApiClient;

    beforeEach(() => {
      mockAxiosInstance.request.mockResolvedValue({
        data: 'test',
        status: 200,
        config: { metadata: { requestId: 'test-id' } }
      });
      client = new ApiClient();
    });

    it('should make GET request correctly', async () => {
      await client.get('/test');

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/test',
      });
    });

    it('should make POST request with data', async () => {
      const data = { name: 'test' };
      await client.post('/test', data);

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/test',
        data,
      });
    });

    it('should make PUT request with data', async () => {
      const data = { name: 'updated' };
      await client.put('/test/1', data);

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/test/1',
        data,
      });
    });

    it('should make DELETE request', async () => {
      await client.delete('/test/1');

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: 'DELETE',
        url: '/test/1',
      });
    });

    it('should make PATCH request with data', async () => {
      const data = { status: 'active' };
      await client.patch('/test/1', data);

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: 'PATCH',
        url: '/test/1',
        data,
      });
    });

    it('should handle request config options', async () => {
      const config = {
        headers: { 'Custom-Header': 'value' },
        params: { page: 1 },
      };

      await client.get('/test', config);

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/test',
        headers: { 'Custom-Header': 'value' },
        params: { page: 1 },
      });
    });

    it('should pass skipAuth option in config', async () => {
      const config = { skipAuth: true };
      await client.get('/test', config);

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/test',
        skipAuth: true,
      });
    });
  });

  describe('utility methods', () => {
    let client: ApiClient;

    beforeEach(() => {
      client = new ApiClient({ timeout: 60000 });
    });

    it('should return current config', () => {
      const config = client.getConfig();

      expect(config.timeout).toBe(60000);
      expect(config.baseURL).toBe('https://api.example.com');
      expect(config.retryAttempts).toBe(3);
    });

    it('should return status information', () => {
      const status = client.getStatus();

      expect(status).toEqual({
        isOnline: true,
        totalRequests: 0,
        failedRequests: 0,
      });
    });

    it('should update config', () => {
      client.updateConfig({ timeout: 45000 });

      const config = client.getConfig();
      expect(config.timeout).toBe(45000);
      expect(mockAxiosInstance.defaults.timeout).toBe(45000);
    });

    it('should update base URL in axios instance', () => {
      client.updateConfig({ baseURL: 'https://new-api.example.com' });

      expect(mockAxiosInstance.defaults.baseURL).toBe('https://new-api.example.com');
    });

    it('should update headers in axios instance', () => {
      client.updateConfig({ headers: { 'New-Header': 'value' } });

      expect(mockAxiosInstance.defaults.headers).toEqual({
        'New-Header': 'value',
      });
    });

    it('should return axios instance', () => {
      const axiosInstance = client.getAxiosInstance();
      expect(axiosInstance).toBe(mockAxiosInstance);
    });

    it('should check online status', () => {
      expect(client.isOnline()).toBe(true);
    });

    it('should reset status', () => {
      client.resetStatus();
      const status = client.getStatus();

      expect(status).toEqual({
        isOnline: true,
        totalRequests: 0,
        failedRequests: 0,
      });
    });
  });

  describe('factory functions', () => {
    it('should create new client instance', () => {
      const client = createApiClient({ timeout: 60000 });
      expect(client).toBeInstanceOf(ApiClient);
    });

    it('should return singleton instance', () => {
      const client1 = getApiClient();
      const client2 = getApiClient();
      expect(client1).toBe(client2);
    });

    it('should allow setting custom client', () => {
      const customClient = new ApiClient();
      setApiClient(customClient);

      const retrievedClient = getApiClient();
      expect(retrievedClient).toBe(customClient);
    });
  });

  describe('convenience API', () => {
    beforeEach(() => {
      mockAxiosInstance.request.mockResolvedValue({
        data: 'test',
        status: 200,
        config: { metadata: { requestId: 'test-id' } }
      });
    });

    it('should call GET method through convenience API', async () => {
      await apiClient.get('/test');
      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/test',
      });
    });

    it('should call POST method through convenience API', async () => {
      const data = { name: 'test' };
      await apiClient.post('/test', data);

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/test',
        data,
      });
    });

    it('should return config through convenience API', () => {
      const config = apiClient.getConfig();
      expect(config.baseURL).toBe('https://api.example.com');
    });

    it('should return status through convenience API', () => {
      const status = apiClient.getStatus();
      expect(status.isOnline).toBe(true);
    });

    it('should check online status through convenience API', () => {
      expect(apiClient.isOnline()).toBe(true);
    });
  });

  describe('request tracking', () => {
    let client: ApiClient;

    beforeEach(() => {
      client = new ApiClient();
    });

    it('should initialize status correctly', () => {
      const status = client.getStatus();
      expect(status.isOnline).toBe(true);
      expect(status.totalRequests).toBe(0);
      expect(status.failedRequests).toBe(0);
    });

    it('should reset status correctly', () => {
      client.resetStatus();
      const status = client.getStatus();
      expect(status.isOnline).toBe(true);
      expect(status.totalRequests).toBe(0);
      expect(status.failedRequests).toBe(0);
    });
  });
});