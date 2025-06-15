import { describe, it, expect } from 'vitest';
import {
  UserSchema,
  LoginDataSchema,
  ApiResponseSchema,
  ErrorResponseSchema,
  PaginatedResponseSchema,
} from '@/types/shared/schemas';
import {
  validateResponse,
  validateApiResponse,
  validatePaginatedResponse,
  validateErrorResponse,
  validateResponseStrict,
  validateOptionalResponse,
  ValidationError,
  createValidator,
  createApiResponseValidator,
} from '../responseValidation';

describe('responseValidation', () => {
  describe('validateResponse', () => {
    it('should validate valid user data', () => {
      const validUser = {
        id: 'usr_123',
        email: 'admin@company.com',
        name: 'John Admin',
        role: 'admin',
        last_login: '2024-01-15T10:30:00Z',
        created_at: '2024-01-01T00:00:00Z',
      };

      const result = validateResponse(UserSchema, validUser);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validUser);
      }
    });

    it('should reject invalid email format', () => {
      const invalidUser = {
        id: 'usr_123',
        email: 'invalid-email',
        name: 'John Admin',
        role: 'admin',
        last_login: null,
        created_at: '2024-01-01T00:00:00Z',
      };

      const result = validateResponse(UserSchema, invalidUser);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('email');
        expect(result.details).toBeDefined();
      }
    });

    it('should reject missing required fields', () => {
      const incompleteUser = {
        id: 'usr_123',
        email: 'admin@company.com',
        // missing name, role, created_at
      };

      const result = validateResponse(UserSchema, incompleteUser);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('name');
        expect(result.error).toContain('role');
        expect(result.error).toContain('created_at');
      }
    });

    it('should reject invalid role enum', () => {
      const invalidUser = {
        id: 'usr_123',
        email: 'admin@company.com',
        name: 'John Admin',
        role: 'user', // Invalid - only 'admin' allowed
        last_login: null,
        created_at: '2024-01-01T00:00:00Z',
      };

      const result = validateResponse(UserSchema, invalidUser);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('role');
      }
    });
  });

  describe('validateApiResponse', () => {
    it('should validate successful API response', () => {
      const apiResponse = {
        success: true,
        message: 'User retrieved successfully',
        data: {
          id: 'usr_123',
          email: 'admin@company.com',
          name: 'John Admin',
          role: 'admin',
          last_login: '2024-01-15T10:30:00Z',
          created_at: '2024-01-01T00:00:00Z',
        },
      };

      const result = validateApiResponse(UserSchema, apiResponse);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.success).toBe(true);
        expect(result.data.data).toEqual(apiResponse.data);
      }
    });

    it('should validate API response with null data', () => {
      const apiResponse = {
        success: true,
        message: 'Operation completed',
        data: null,
      };

      const result = validateApiResponse(UserSchema, apiResponse);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.data).toBeNull();
      }
    });

    it('should reject API response with invalid success field', () => {
      const invalidResponse = {
        success: 'true', // Should be boolean
        message: 'Test message',
        data: null,
      };

      const result = validateApiResponse(UserSchema, invalidResponse);
      expect(result.success).toBe(false);
    });

    it('should validate API response with validation errors', () => {
      const apiResponse = {
        success: true,
        message: 'Validation passed',
        data: null,
        errors: {
          email: ['Invalid email format'],
          name: ['Name is required'],
        },
      };

      const result = validateApiResponse(UserSchema, apiResponse);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.errors).toEqual(apiResponse.errors);
      }
    });
  });

  describe('validateErrorResponse', () => {
    it('should validate error response', () => {
      const errorResponse = {
        success: false,
        message: 'User not found',
        data: null,
      };

      const result = validateErrorResponse(errorResponse);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.success).toBe(false);
        expect(result.data.message).toBe('User not found');
      }
    });

    it('should validate error response with validation errors', () => {
      const errorResponse = {
        success: false,
        message: 'Validation failed',
        data: null,
        errors: {
          email: ['Email is required'],
        },
      };

      const result = validateErrorResponse(errorResponse);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.errors).toEqual(errorResponse.errors);
      }
    });
  });

  describe('validatePaginatedResponse', () => {
    it('should validate paginated response', () => {
      const paginatedResponse = {
        items: [
          {
            id: 'usr_123',
            email: 'admin@company.com',
            name: 'John Admin',
            role: 'admin',
            last_login: '2024-01-15T10:30:00Z',
            created_at: '2024-01-01T00:00:00Z',
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        },
      };

      const result = validatePaginatedResponse(UserSchema, paginatedResponse);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.items).toHaveLength(1);
        expect(result.data.pagination.page).toBe(1);
      }
    });

    it('should reject invalid pagination structure', () => {
      const invalidResponse = {
        items: [],
        pagination: {
          page: 'first', // Should be number
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrevious: false,
        },
      };

      const result = validatePaginatedResponse(UserSchema, invalidResponse);
      expect(result.success).toBe(false);
    });
  });

  describe('validateResponseStrict', () => {
    it('should return validated data on success', () => {
      const validUser = {
        id: 'usr_123',
        email: 'admin@company.com',
        name: 'John Admin',
        role: 'admin',
        last_login: null,
        created_at: '2024-01-01T00:00:00Z',
      };

      const result = validateResponseStrict(UserSchema, validUser);
      expect(result).toEqual(validUser);
    });

    it('should throw ValidationError on failure', () => {
      const invalidUser = {
        id: 'usr_123',
        email: 'invalid-email',
      };

      expect(() => {
        validateResponseStrict(UserSchema, invalidUser);
      }).toThrow(ValidationError);
    });
  });

  describe('validateOptionalResponse', () => {
    it('should return null for null input', () => {
      const result = validateOptionalResponse(UserSchema, null);
      expect(result).toBeNull();
    });

    it('should return null for undefined input', () => {
      const result = validateOptionalResponse(UserSchema, undefined);
      expect(result).toBeNull();
    });

    it('should validate and return data for valid input', () => {
      const validUser = {
        id: 'usr_123',
        email: 'admin@company.com',
        name: 'John Admin',
        role: 'admin',
        last_login: null,
        created_at: '2024-01-01T00:00:00Z',
      };

      const result = validateOptionalResponse(UserSchema, validUser);
      expect(result).toEqual(validUser);
    });
  });

  describe('ValidationError', () => {
    it('should create error with proper name', () => {
      const error = new ValidationError('Test error');
      expect(error.name).toBe('ValidationError');
      expect(error.message).toBe('Test error');
    });

    it('should extract field errors from Zod error', () => {
      const invalidData = { email: 'invalid' };
      
      try {
        validateResponseStrict(UserSchema, invalidData);
      } catch (error) {
        if (error instanceof ValidationError) {
          const fieldErrors = error.getFieldErrors();
          expect(fieldErrors).toHaveProperty('email');
          expect(fieldErrors).toHaveProperty('id');
          expect(fieldErrors).toHaveProperty('name');
        }
      }
    });

    it('should format error message with field details', () => {
      const invalidData = { email: 'invalid' };
      
      try {
        validateResponseStrict(UserSchema, invalidData);
      } catch (error) {
        if (error instanceof ValidationError) {
          const formatted = error.getFormattedMessage();
          expect(formatted).toContain('email');
          expect(formatted).toContain('id');
          expect(formatted).toContain('name');
        }
      }
    });
  });

  describe('factory functions', () => {
    describe('createValidator', () => {
      it('should create validator function', () => {
        const validateUser = createValidator(UserSchema);
        
        const validUser = {
          id: 'usr_123',
          email: 'admin@company.com',
          name: 'John Admin',
          role: 'admin',
          last_login: null,
          created_at: '2024-01-01T00:00:00Z',
        };

        const result = validateUser(validUser);
        expect(result).toEqual(validUser);
      });
    });

    describe('createApiResponseValidator', () => {
      it('should create API response validator', () => {
        const validateUserResponse = createApiResponseValidator(UserSchema);
        
        const apiResponse = {
          success: true,
          message: 'Success',
          data: {
            id: 'usr_123',
            email: 'admin@company.com',
            name: 'John Admin',
            role: 'admin',
            last_login: null,
            created_at: '2024-01-01T00:00:00Z',
          },
        };

        const result = validateUserResponse(apiResponse);
        expect(result.success).toBe(true);
        expect(result.data).toEqual(apiResponse.data);
      });
    });
  });

  describe('LoginDataSchema validation', () => {
    it('should validate complete login response data', () => {
      const loginData = {
        user: {
          id: 'usr_123',
          email: 'admin@company.com',
          name: 'John Admin',
          role: 'admin',
          last_login: '2024-01-15T10:30:00Z',
          created_at: '2024-01-01T00:00:00Z',
        },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        expires_at: '2024-01-16T10:30:00Z',
        remember_me: false,
      };

      const result = validateResponse(LoginDataSchema, loginData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.user.email).toBe('admin@company.com');
        expect(result.data.token).toBe(loginData.token);
        expect(result.data.remember_me).toBe(false);
      }
    });
  });
});