import { useReducer, useCallback, useEffect } from 'react';
import { authService, authHelpers } from '@/services/auth/authService';
import { AuthError, AuthErrorType } from '@/types/auth/errors';
import type {
  AuthState,
  AuthAction,
  UseAuthReturn,
  LoginRequest
} from '@/types/auth';

// ==========================================
// Initial State
// ==========================================

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,
};

// ==========================================
// Reducer
// ==========================================

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error,
      };

    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case 'AUTH_RESET_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'AUTH_INITIALIZE_COMPLETE':
      return {
        ...state,
        isInitialized: true,
        isLoading: false,
      };

    default:
      return state;
  }
}

// ==========================================
// Helper Functions
// ==========================================

function transformError(error: unknown): AuthError {
  if (error instanceof AuthError) {
    return error;
  }

  if (error instanceof Error) {
    return new AuthError(
      AuthErrorType.UNKNOWN_ERROR,
      error.message
    );
  }

  return new AuthError(
    AuthErrorType.UNKNOWN_ERROR,
    'An unexpected error occurred'
  );
}

// ==========================================
// useAuth Hook
// ==========================================

export function useAuth(): UseAuthReturn {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // ==========================================
  // Login Method
  // ==========================================

  const login = useCallback(async (credentials: LoginRequest): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });

      const response = await authService.login(credentials);

      if (response.success && response.data?.user) {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: response.data.user }
        });
      } else {
        throw new AuthError(
          AuthErrorType.INVALID_CREDENTIALS,
          response.message || 'Login failed'
        );
      }
    } catch (error) {
      const authError = transformError(error);
      dispatch({
        type: 'AUTH_FAILURE',
        payload: { error: authError }
      });
      throw authError;
    }
  }, []);

  // ==========================================
  // Logout Method
  // ==========================================

  const logout = useCallback(async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  }, []);

  // ==========================================
  // Token Check Method
  // ==========================================

  const checkAuth = useCallback(async (): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });

      const result = await authHelpers.checkAuthentication();

      if (result.isAuthenticated && result.user) {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: result.user }
        });
      } else {
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    } catch (error) {
      dispatch({ type: 'AUTH_LOGOUT' });
    } finally {
      dispatch({ type: 'AUTH_INITIALIZE_COMPLETE' });
    }
  }, []);

  // ==========================================
  // Clear Error Method
  // ==========================================

  const clearError = useCallback((): void => {
    dispatch({ type: 'AUTH_RESET_ERROR' });
  }, []);

  // ==========================================
  // Development Helpers
  // ==========================================

  const debugState = useCallback(() => {
    if (import.meta.env.DEV) {
      console.log('useAuth state:', {
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        isInitialized: state.isInitialized,
        hasUser: !!state.user,
        hasError: !!state.error,
        errorType: state.error?.type,
      });
    }
  }, [state]);

  // ==========================================
  // Effects
  // ==========================================

  // Handle automatic logout from API client
  useEffect(() => {
    // Set up API client callback for authentication failures
    const setupApiClientCallback = async () => {
      try {
        const { apiClient } = await import('@/services/shared/apiClient');

        apiClient.updateConfig({
          onAuthenticationFailed: () => {
            dispatch({ type: 'AUTH_LOGOUT' });
          }
        });
      } catch (error) {
        console.warn('Failed to setup API client authentication callback:', error);
      }
    };

    setupApiClientCallback();
  }, []);

  // Initialize authentication check on mount
  useEffect(() => {
    if (!state.isInitialized) {
      checkAuth();
    }
  }, [checkAuth, state.isInitialized]);

  // ==========================================
  // Return Hook Interface
  // ==========================================

  return {
    // State
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    isInitialized: state.isInitialized,
    error: state.error,

    // Methods
    login,
    logout,
    checkAuth,
    clearError,

    // Development helpers
    ...(import.meta.env.DEV && { debugState }),
  };
}

// ==========================================
// Default Export
// ==========================================

export default useAuth;