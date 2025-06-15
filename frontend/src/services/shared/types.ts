import type { AxiosRequestConfig, AxiosResponse } from 'axios';

// ==========================================
// API Client Configuration Types
// ==========================================

export interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
  retryAttempts: number;
  enableLogging: boolean;
}

export interface ApiRequestConfig extends Omit<AxiosRequestConfig, 'url'> {
  skipAuth?: boolean;
  skipRetry?: boolean;
  skipInterceptors?: boolean;
}

// ==========================================
// Error Types
// ==========================================

export interface ApiClientError extends Error {
  code?: string;
  status?: number;
  response?: AxiosResponse;
  isNetworkError?: boolean;
  isTimeout?: boolean;
}

// ==========================================
// Request Metadata Types
// ==========================================

export interface RequestMetadata {
  requestId: string;
  timestamp: number;
  url?: string;
  method?: string;
}

// ==========================================
// HTTP Method Types
// ==========================================

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// ==========================================
// Client Status Types
// ==========================================

export interface ClientStatus {
  isOnline: boolean;
  lastRequestTime?: number;
  totalRequests: number;
  failedRequests: number;
}

// ==========================================
// Type Guards
// ==========================================

export function isApiClientError(error: unknown): error is ApiClientError {
  return error instanceof Error && 'code' in error;
}

export function isNetworkError(error: ApiClientError): boolean {
  return error.isNetworkError === true;
}

export function isTimeoutError(error: ApiClientError): boolean {
  return error.isTimeout === true;
}

export function isHttpError(error: ApiClientError): boolean {
  return typeof error.status === 'number' && error.status >= 400;
}