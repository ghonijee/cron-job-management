// ==========================================
// Authentication Types - Main Export
// ==========================================

// Re-export all authentication types
export * from './user';
export * from './requests';
export * from './responses';
export * from './state';
export * from './errors';

// Import specific types for re-export with aliases if needed
import { LoginRequest } from './requests';
import { AuthState } from './state';
import { User } from './user';

// Commonly used type aliases
export type LoginCredentials = LoginRequest;
export type AuthenticationState = AuthState;
export type AuthenticatedUser = User;
