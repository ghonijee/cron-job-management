import { z } from 'zod';

// ==========================================
// Entity Schemas Based on API Contract
// ==========================================

// User entity schema based on API contract
export const UserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1),
  role: z.enum(['admin']), // Admin-only system
  last_login: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
  session_expires_at: z.string().datetime().optional(),
});

// Auth token schema
export const AuthTokenSchema = z.object({
  token: z.string().min(1),
  expires_at: z.string().datetime(),
});

// Login response data schema
export const LoginDataSchema = z.object({
  user: UserSchema,
  token: z.string().min(1),
  expires_at: z.string().datetime(),
  remember_me: z.boolean(),
});

// Token verification response schema
export const TokenVerificationSchema = z.object({
  valid: z.boolean(),
  expires_at: z.string().datetime().optional(),
  user_id: z.string().optional(),
  reason: z.string().optional(),
});

// ==========================================
// Base Response Schemas
// ==========================================

export const ValidationErrorsSchema = z.record(z.array(z.string()));

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    message: z.string(),
    data: dataSchema.nullable(),
    errors: ValidationErrorsSchema.optional(),
  });

export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  data: z.null(),
  errors: ValidationErrorsSchema.optional(),
});

export const PaginationSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
  hasNext: z.boolean(),
  hasPrevious: z.boolean(),
});

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    pagination: PaginationSchema,
  });

// ==========================================
// Inferred TypeScript Types
// ==========================================

export type User = z.infer<typeof UserSchema>;
export type AuthToken = z.infer<typeof AuthTokenSchema>;
export type LoginData = z.infer<typeof LoginDataSchema>;
export type TokenVerification = z.infer<typeof TokenVerificationSchema>;
export type ValidationErrors = z.infer<typeof ValidationErrorsSchema>;

// Generic types for API responses
export type ApiResponseType<T> = z.infer<ReturnType<typeof ApiResponseSchema<z.ZodSchema<T>>>>;
export type ErrorResponseType = z.infer<typeof ErrorResponseSchema>;
export type PaginatedResponseType<T> = z.infer<ReturnType<typeof PaginatedResponseSchema<z.ZodSchema<T>>>>;