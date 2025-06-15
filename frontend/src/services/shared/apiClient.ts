import axios, { type AxiosInstance } from 'axios';
import { env } from '@/utils/shared/env';
import type {
  ApiClientConfig,
  ApiRequestConfig,
  ApiClientResponse,
  ApiClientError,
  RequestMetadata,
  ClientStatus,
  HttpMethod,
} from './types';

// ==========================================
// API Client Class
// ==========================================

export class ApiClient {
  private axiosInstance: AxiosInstance;
  private config: ApiClientConfig;
  private status: ClientStatus;

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
  // HTTP Methods
  // ==========================================

  async request<T = unknown>(
    method: HttpMethod,
    url: string,
    config?: ApiRequestConfig
  ): Promise<ApiClientResponse<T>> {
    try {
      const response = await this.axiosInstance.request<T>({
        method,
        url,
        ...config,
      });

      return response as ApiClientResponse<T>;
    } catch (error) {
      throw error; // Already transformed by interceptor
    }
  }

  async get<T = unknown>(url: string, config?: ApiRequestConfig): Promise<ApiClientResponse<T>> {
    return this.request<T>('GET', url, config);
  }

  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: ApiRequestConfig
  ): Promise<ApiClientResponse<T>> {
    return this.request<T>('POST', url, { ...config, data });
  }

  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: ApiRequestConfig
  ): Promise<ApiClientResponse<T>> {
    return this.request<T>('PUT', url, { ...config, data });
  }

  async delete<T = unknown>(url: string, config?: ApiRequestConfig): Promise<ApiClientResponse<T>> {
    return this.request<T>('DELETE', url, config);
  }

  async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: ApiRequestConfig
  ): Promise<ApiClientResponse<T>> {
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
  ApiClientResponse,
  ApiClientError,
  RequestMetadata,
  ClientStatus,
  HttpMethod,
};