import { z } from 'zod';
import {
  ApiResponseSchema,
  ErrorResponseSchema,
  PaginatedResponseSchema,
  UserSchema,
  LoginDataSchema,
  TokenVerificationSchema,
} from '@/types/shared/schemas';

// ==========================================
// Validation Result Types
// ==========================================

export type ValidationResult<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
  details?: z.ZodError;
};

// ==========================================
// Generic Validation Functions
// ==========================================

/**
 * Generic validation function that validates data against a Zod schema
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns ValidationResult with either success data or error details
 */
export function validateResponse<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: `Validation failed: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
        details: error,
      };
    }
    return {
      success: false,
      error: 'Unknown validation error',
    };
  }
}

// ==========================================
// Specific API Response Validation Functions
// ==========================================

/**
 * Validates API response with specific data schema
 * @param dataSchema - Schema for the data property
 * @param response - Response object to validate
 * @returns ValidationResult for API response
 */
export function validateApiResponse<T>(
  dataSchema: z.ZodSchema<T>,
  response: unknown
): ValidationResult<z.infer<ReturnType<typeof ApiResponseSchema>>> {
  const schema = ApiResponseSchema(dataSchema);
  return validateResponse(schema, response);
}

/**
 * Validates paginated response with specific item schema
 * @param itemSchema - Schema for individual items in the array
 * @param response - Response object to validate
 * @returns ValidationResult for paginated response
 */
export function validatePaginatedResponse<T>(
  itemSchema: z.ZodSchema<T>,
  response: unknown
): ValidationResult<z.infer<ReturnType<typeof PaginatedResponseSchema>>> {
  const schema = PaginatedResponseSchema(itemSchema);
  return validateResponse(schema, response);
}

/**
 * Validates error response structure
 * @param response - Response object to validate
 * @returns ValidationResult for error response
 */
export function validateErrorResponse(
  response: unknown
): ValidationResult<z.infer<typeof ErrorResponseSchema>> {
  return validateResponse(ErrorResponseSchema, response);
}

// ==========================================
// Validation Utilities with Error Throwing
// ==========================================

/**
 * Validates response and throws error if validation fails
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validated data
 * @throws ValidationError if validation fails
 */
export function validateResponseStrict<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  const result = validateResponse(schema, data);
  
  if (!result.success) {
    throw new ValidationError(result.error, result.details, data);
  }
  
  return result.data;
}

/**
 * Validates optional response data
 * @param schema - Zod schema to validate against
 * @param data - Data to validate (can be null/undefined)
 * @returns Validated data or null
 */
export function validateOptionalResponse<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T | null {
  if (data === null || data === undefined) {
    return null;
  }
  
  return validateResponseStrict(schema, data);
}

// ==========================================
// Pre-built Validators for Common Entities
// ==========================================

export const validateUser = (data: unknown) => validateResponseStrict(UserSchema, data);
export const validateLoginData = (data: unknown) => validateResponseStrict(LoginDataSchema, data);
export const validateTokenVerification = (data: unknown) => validateResponseStrict(TokenVerificationSchema, data);

// ==========================================
// Factory Functions for Creating Validators
// ==========================================

/**
 * Creates a validator function for a specific schema
 * @param schema - Zod schema to create validator for
 * @returns Validator function
 */
export function createValidator<T>(schema: z.ZodSchema<T>) {
  return (data: unknown): T => validateResponseStrict(schema, data);
}

/**
 * Creates an API response validator for a specific data schema
 * @param dataSchema - Schema for the data property
 * @returns API response validator function
 */
export function createApiResponseValidator<T>(dataSchema: z.ZodSchema<T>) {
  return (response: unknown) => {
    const result = validateApiResponse(dataSchema, response);
    if (!result.success) {
      throw new ValidationError(result.error, result.details, response);
    }
    return result.data;
  };
}

/**
 * Creates a paginated response validator for a specific item schema
 * @param itemSchema - Schema for individual items
 * @returns Paginated response validator function
 */
export function createPaginatedResponseValidator<T>(itemSchema: z.ZodSchema<T>) {
  return (response: unknown) => {
    const result = validatePaginatedResponse(itemSchema, response);
    if (!result.success) {
      throw new ValidationError(result.error, result.details, response);
    }
    return result.data;
  };
}

// ==========================================
// Custom Error Class
// ==========================================

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly details?: z.ZodError,
    public readonly originalData?: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
  }

  /**
   * Gets field-specific errors from Zod validation
   * @returns Record of field paths to error messages
   */
  getFieldErrors(): Record<string, string[]> {
    if (!this.details) return {};
    
    const errors: Record<string, string[]> = {};
    
    this.details.errors.forEach(error => {
      const path = error.path.join('.');
      if (!errors[path]) {
        errors[path] = [];
      }
      errors[path].push(error.message);
    });
    
    return errors;
  }

  /**
   * Gets a formatted error message with field details
   * @returns Formatted error message
   */
  getFormattedMessage(): string {
    const fieldErrors = this.getFieldErrors();
    if (Object.keys(fieldErrors).length === 0) {
      return this.message;
    }
    
    const fieldMessages = Object.entries(fieldErrors)
      .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
      .join('; ');
    
    return `${this.message} (${fieldMessages})`;
  }
}

/**
 * Utility function to throw ValidationError
 * @param message - Error message
 * @param details - Zod error details
 * @param originalData - Original data that failed validation
 */
export function throwValidationError(
  message: string,
  details?: z.ZodError,
  originalData?: unknown
): never {
  throw new ValidationError(message, details, originalData);
}