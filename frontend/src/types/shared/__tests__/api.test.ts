import { describe, it, expect } from 'vitest';
import {
  isSuccessResponse,
  isErrorResponse,
  hasValidationErrors,
  type ApiResponse,
  type ErrorResponse,
  type PaginatedResponse
} from '../api';

describe('API Types', () => {
  describe('Type Guards', () => {
    it('should identify successful responses', () => {
      const successResponse: ApiResponse<string> = {
        success: true,
        message: 'Success',
        data: 'test data'
      };

      expect(isSuccessResponse(successResponse)).toBe(true);
      expect(isErrorResponse(successResponse)).toBe(false);
    });

    it('should identify error responses', () => {
      const errorResponse: ErrorResponse = {
        success: false,
        message: 'Error occurred',
        data: null
      };

      expect(isErrorResponse(errorResponse)).toBe(true);
      expect(isSuccessResponse(errorResponse)).toBe(false);
    });

    it('should identify validation errors', () => {
      const validationResponse: ErrorResponse = {
        success: false,
        message: 'Validation failed',
        data: null,
        errors: {
          email: ['Email is required'],
          password: ['Password too short']
        }
      };

      expect(hasValidationErrors(validationResponse)).toBe(true);
    });

    it('should not identify validation errors when errors field is missing', () => {
      const errorResponse: ErrorResponse = {
        success: false,
        message: 'Server error',
        data: null
      };

      expect(hasValidationErrors(errorResponse)).toBe(false);
    });
  });

  describe('Interface Structure', () => {
    it('should validate ApiResponse structure', () => {
      const response: ApiResponse<{ id: string }> = {
        success: true,
        message: 'User created',
        data: { id: '123' }
      };

      expect(response.success).toBe(true);
      expect(response.data?.id).toBe('123');
      expect(response.message).toBe('User created');
    });

    it('should validate ApiResponse with null data', () => {
      const response: ApiResponse<string> = {
        success: true,
        message: 'Operation completed',
        data: null
      };

      expect(response.success).toBe(true);
      expect(response.data).toBeNull();
    });

    it('should validate PaginatedResponse structure', () => {
      const paginatedResponse: PaginatedResponse<{ name: string }> = {
        items: [{ name: 'Test' }],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false
        }
      };

      expect(paginatedResponse.items).toHaveLength(1);
      expect(paginatedResponse.pagination.total).toBe(1);
      expect(paginatedResponse.pagination.hasNext).toBe(false);
    });

    it('should validate ValidationErrors structure', () => {
      const errors = {
        email: ['Email is required', 'Invalid email format'],
        password: ['Password is too short']
      };

      expect(errors.email).toContain('Email is required');
      expect(errors.password).toHaveLength(1);
    });
  });

  describe('Type Safety', () => {
    it('should provide type safety for generic data', () => {
      interface User {
        id: string;
        name: string;
        email: string;
      }

      const userResponse: ApiResponse<User> = {
        success: true,
        message: 'User retrieved',
        data: {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com'
        }
      };

      if (isSuccessResponse(userResponse) && userResponse.data) {
        // TypeScript should know data is User type
        expect(userResponse.data.email).toBe('john@example.com');
        expect(userResponse.data.name).toBe('John Doe');
      }
    });

    it('should handle array data types', () => {
      interface Job {
        id: string;
        name: string;
        status: string;
      }

      const jobsResponse: ApiResponse<Job[]> = {
        success: true,
        message: 'Jobs retrieved',
        data: [
          { id: '1', name: 'Job 1', status: 'active' },
          { id: '2', name: 'Job 2', status: 'inactive' }
        ]
      };

      if (isSuccessResponse(jobsResponse) && jobsResponse.data) {
        expect(jobsResponse.data).toHaveLength(2);
        expect(jobsResponse.data[0]!.status).toBe('active');
      }
    });
  });
});