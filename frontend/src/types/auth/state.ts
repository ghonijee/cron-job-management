// ==========================================
// Authentication State Management Types
// ==========================================

import { User } from './user';
import { LoginRequest } from './requests';
import { AuthError } from './errors';

// Main authentication state for React hooks/context
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean; // Whether initial auth check is complete
  error: AuthError | null;
}

// Authentication actions for useReducer (if needed)
export type AuthAction = 
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User } }
  | { type: 'AUTH_FAILURE'; payload: { error: AuthError } }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_RESET_ERROR' }
  | { type: 'AUTH_INITIALIZE_COMPLETE' };

// Hook return type
export interface UseAuthReturn extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}
