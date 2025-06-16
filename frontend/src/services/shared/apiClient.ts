import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { env } from '@/utils/shared/env';
import type {
  ApiClientConfig,
  ApiRequestConfig,
  ApiClientError,
  RequestMetadata,
  ClientStatus,
  HttpMethod,
  RefreshQueueItem,
} from './types';

// ==========================================
// API Client Class
// ==========================================

export class ApiClient {
  private axiosInstance: AxiosInstance;
  private config: ApiClientConfig;
  private status: ClientStatus;
  private isRefreshing = false;
  private refreshQueue: RefreshQueueItem[] = [];

  constructor(config?: Partial<ApiClientConfig>) {
    // Initialize status tracking
    this.status = {
      isOnline: true,
      totalRequests: 0,
      failedRequests: 0,
    };

    // Merge default config with provided config
    this.config = {
      baseURL: env.API_BASE_URL,
      timeout: 30000, // 30 seconds
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      retryAttempts: 3,
      enableLogging: import.meta.env.DEV, // Use Vite's development flag
      ...config,
    };

    this.validateConfig();
    this.axiosInstance = this.createAxiosInstance();
    this.setupInterceptors();
  }

  // ==========================================
  // Configuration and Validation
  // ==========================================

  private validateConfig(): void {
    if (!this.config.baseURL) {
      throw new Error('API_BASE_URL is required but not provided');
    }

    if (!this.config.baseURL.startsWith('http')) {
      throw new Error('API_BASE_URL must be a valid HTTP/HTTPS URL');
    }

    if (this.config.timeout <= 0) {
      throw new Error('Timeout must be a positive number');
    }

    if (this.config.retryAttempts < 0) {
      throw new Error('Retry attempts must be a non-negative number');
    }
  }

  private createAxiosInstance(): AxiosInstance {
    return axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: this.config.headers,
      validateStatus: (status) => status < 500, // Don't throw for client errors (4xx)
    });
  }

  // ==========================================
  // Authentication Interceptors
  // ==========================================

  private setupInterceptors(): void {
    this.setupRequestInterceptor();
    this.setupResponseInterceptor();
  }

  private setupRequestInterceptor(): void {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Skip authentication for public endpoints
        if (this.isPublicEndpoint(config.url)) {
          return config;
        }

        // Add withCredentials for httpOnly cookie authentication
        config.withCredentials = true;

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  private setupResponseInterceptor(): void {
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Update success statistics
        this.status.totalRequests++;
        this.status.lastRequestTime = Date.now();
        return response;
      },
      async (error) => {
        this.status.failedRequests++;

        // Handle authentication errors
        if (this.isAuthenticationError(error)) {
          return this.handleAuthenticationError(error);
        }

        return Promise.reject(error);
      }
    );
  }

  private isPublicEndpoint(url?: string): boolean {
    const publicEndpoints = ['/auth/login', '/auth/verify-token'];
    return publicEndpoints.some(endpoint => url?.includes(endpoint));
  }

  private isAuthenticationError(error: any): boolean {
    return error.response?.status === 401 || error.response?.status === 403;
  }

  private async handleAuthenticationError(error: any) {
    const originalRequest = error.config;

    // Skip retry for public endpoints
    if (this.isPublicEndpoint(originalRequest.url)) {
      return Promise.reject(error);
    }

    // Mark request as retried to prevent infinite loops
    if (originalRequest._retry) {
      this.onAuthenticationFailed();
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    // If currently refreshing, queue this request
    if (this.isRefreshing) {
      return this.queueFailedRequest(originalRequest);
    }

    // Attempt token refresh
    return this.attemptTokenRefresh(originalRequest, error);
  }

  private async attemptTokenRefresh(originalRequest: any, originalError: any) {
    try {
      this.isRefreshing = true;

      // Use authService to check if we're still authenticated
      const authResult = await this.checkAuthentication();

      if (authResult.isAuthenticated) {
        // Process queued requests
        this.processRefreshQueue(true);
        // Retry original request
        return this.axiosInstance(originalRequest);
      } else {
        // Authentication failed
        this.processRefreshQueue(false);
        this.onAuthenticationFailed();
        return Promise.reject(originalError);
      }
    } catch (refreshError) {
      this.processRefreshQueue(false);
      this.onAuthenticationFailed();
      return Promise.reject(originalError);
    } finally {
      this.isRefreshing = false;
    }
  }

  private queueFailedRequest(originalRequest: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.refreshQueue.push({ resolve, reject });
    }).then(() => {
      // Retry the original request after refresh completes
      return this.axiosInstance(originalRequest);
    });
  }

  private processRefreshQueue(success: boolean): void {
    this.refreshQueue.forEach(({ resolve, reject }) => {
      if (success) {
        resolve(true);
      } else {
        reject(new Error('Token refresh failed'));
      }
    });
    this.refreshQueue = [];
  }

  private async checkAuthentication(): Promise<{ isAuthenticated: boolean }> {
    try {
      // Import authHelpers dynamically to avoid circular dependency
      const { authHelpers } = await import('@/services/auth/authService');
      return await authHelpers.checkAuthentication();
    } catch (error) {
      return { isAuthenticated: false };
    }
  }

  private onAuthenticationFailed(): void {
    // Trigger logout and redirect - this will be handled by auth context
    if (this.config.onAuthenticationFailed) {
      this.config.onAuthenticationFailed();
    }
  }

  // ==========================================
  // HTTP Methods
  // ==========================================

  async request<T = unknown>(
    method: HttpMethod,
    url: string,
    config?: ApiRequestConfig
  ): Promise<AxiosResponse<T>> {
    try {
      const response = await this.axiosInstance.request<T>({
        method,
        url,
        ...config,
      });

      return response as AxiosResponse<T>;
    } catch (error) {
      throw error; // Already transformed by interceptor
    }
  }

  async get<T = unknown>(url: string, config?: ApiRequestConfig): Promise<AxiosResponse<T>> {
    return this.request<T>('GET', url, config);
  }

  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: ApiRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.request<T>('POST', url, { ...config, data });
  }

  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: ApiRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.request<T>('PUT', url, { ...config, data });
  }

  async delete<T = unknown>(url: string, config?: ApiRequestConfig): Promise<AxiosResponse<T>> {
    return this.request<T>('DELETE', url, config);
  }

  async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: ApiRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.request<T>('PATCH', url, { ...config, data });
  }

  // ==========================================
  // Utility Methods
  // ==========================================

  getConfig(): ApiClientConfig {
    return { ...this.config };
  }

  getStatus(): ClientStatus {
    return { ...this.status };
  }

  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  updateConfig(newConfig: Partial<ApiClientConfig>): void {
    this.config = { ...this.config, ...newConfig };

    // Update axios instance defaults
    if (newConfig.baseURL) {
      this.axiosInstance.defaults.baseURL = newConfig.baseURL;
    }
    if (newConfig.timeout) {
      this.axiosInstance.defaults.timeout = newConfig.timeout;
    }
    if (newConfig.headers) {
      this.axiosInstance.defaults.headers = {
        ...this.axiosInstance.defaults.headers,
        ...newConfig.headers,
      };
    }
  }

  isOnline(): boolean {
    return this.status.isOnline;
  }

  resetStatus(): void {
    this.status = {
      isOnline: true,
      totalRequests: 0,
      failedRequests: 0,
    };
  }
}

// ==========================================
// Factory Functions and Singleton
// ==========================================

let defaultApiClient: ApiClient | null = null;

export function createApiClient(config?: Partial<ApiClientConfig>): ApiClient {
  return new ApiClient(config);
}

export function getApiClient(): ApiClient {
  if (!defaultApiClient) {
    defaultApiClient = new ApiClient();
  }
  return defaultApiClient;
}

export function setApiClient(client: ApiClient): void {
  defaultApiClient = client;
}

// ==========================================
// Convenience API
// ==========================================

export const apiClient = {
  get: <T = unknown>(url: string, config?: ApiRequestConfig) =>
    getApiClient().get<T>(url, config),

  post: <T = unknown>(url: string, data?: unknown, config?: ApiRequestConfig) =>
    getApiClient().post<T>(url, data, config),

  put: <T = unknown>(url: string, data?: unknown, config?: ApiRequestConfig) =>
    getApiClient().put<T>(url, data, config),

  delete: <T = unknown>(url: string, config?: ApiRequestConfig) =>
    getApiClient().delete<T>(url, config),

  patch: <T = unknown>(url: string, data?: unknown, config?: ApiRequestConfig) =>
    getApiClient().patch<T>(url, data, config),

  // Utility methods
  getConfig: () => getApiClient().getConfig(),
  updateConfig: (config: Partial<ApiClientConfig>) => getApiClient().updateConfig(config),
  getStatus: () => getApiClient().getStatus(),
  isOnline: () => getApiClient().isOnline(),
  resetStatus: () => getApiClient().resetStatus(),
};

// ==========================================
// Exports
// ==========================================

export type {
  ApiClientConfig,
  ApiRequestConfig,
  AxiosResponse,
  ApiClientError,
  RequestMetadata,
  ClientStatus,
  HttpMethod,
};