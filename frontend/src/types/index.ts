// Base API response types
export interface ApiResponse<T> {
  data: T
  message: string
  statusCode: number
}

export interface MetaPaginatedResponse {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: MetaPaginatedResponse
}

export interface ApiError {
  message: string
  statusCode: number
  error?: string
}

// User related types
export interface User {
  id: string
  email: string
  username: string
  firstName?: string
  lastName?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Authentication types
export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  access_token: string
  refresh_token: string
}

// Category types
export interface Category {
  id: string
  name: string
  description?: string
  color: string
  isActive: boolean
  userId: string | number  // Optional - can be extracted from JWT token by backend
  cronJobsCount?: number
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryDto {
  name: string
  description?: string
  color: string
  userId?: string | number  // Optional - can be extracted from JWT token by backend
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {
  isActive?: boolean
}

// Cron Job types
export interface CronJob {
  id: string
  name: string
  description?: string
  cronExpression: string
  url: string
  httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: string
  isActive: boolean
  retryAttempts: number
  timeoutMs: number
  categoryId?: string
  category?: Category
  userId: string
  lastExecutedAt?: string
  nextExecutionAt?: string
  createdAt: string
  updatedAt: string
}

export interface CreateCronJobDto {
  name: string
  description?: string
  cronExpression: string
  url: string
  httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: string
  retryAttempts?: number
  timeoutMs?: number
  categoryId?: string
}

export interface UpdateCronJobDto extends Partial<CreateCronJobDto> {
  isActive?: boolean
}

// Execution History types
export interface ExecutionHistory {
  id: string
  cronJobId: string
  cronJob?: CronJob
  executedAt: string
  status: 'success' | 'failed' | 'timeout' | 'retry'
  responseStatus?: number
  responseTime: number
  errorMessage?: string
  responseBody?: string
  createdAt: string
}

// Query and filter types
export interface PaginationParams {
  page?: number
  limit?: number
}

export interface CategoryFilter extends PaginationParams {
  search?: string
  isActive?: boolean
  sortBy?: 'name' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}

export interface CronJobFilter extends PaginationParams {
  search?: string
  isActive?: boolean
  categoryId?: string
  httpMethod?: string
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'nextExecutionAt'
  sortOrder?: 'asc' | 'desc'
}

export interface ExecutionHistoryFilter extends PaginationParams {
  cronJobId?: string
  status?: string
  dateFrom?: string
  dateTo?: string
  sortBy?: 'executedAt' | 'responseTime'
  sortOrder?: 'asc' | 'desc'
}