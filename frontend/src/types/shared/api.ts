// ==========================================
// Base API Response Types
// ==========================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  errors?: ValidationErrors;
}

export interface ValidationErrors {
  [field: string]: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface ErrorResponse {
  success: false;
  message: string;
  data: null;
  errors?: ValidationErrors;
}

export type ApiResult<T> = ApiResponse<T> | ErrorResponse;

// ==========================================
// HTTP Configuration Types
// ==========================================

export type HttpStatus = 
  | 200 | 201 | 204
  | 400 | 401 | 403 | 404 | 422 | 429
  | 500 | 502 | 503;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RequestConfig {
  method: HttpMethod;
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  data?: unknown;
  timeout?: number;
}

// ==========================================
// Query Parameter Types
// ==========================================

export interface BaseQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface QueryParams extends BaseQueryParams {
  sort?: SortConfig;
  filters?: Record<string, unknown>;
}

// ==========================================
// Type Guards
// ==========================================

export function isSuccessResponse<T>(
  response: ApiResult<T>
): response is ApiResponse<T> {
  return response.success === true;
}

export function isErrorResponse(
  response: ApiResult<unknown>
): response is ErrorResponse {
  return response.success === false;
}

export function hasValidationErrors(
  response: ApiResult<unknown>
): response is ErrorResponse & { errors: ValidationErrors } {
  return !response.success && response.errors !== undefined;
}