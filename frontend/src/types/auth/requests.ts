// ==========================================
// Authentication Request Types
// ==========================================

// Login request payload
export interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean; // Optional, defaults to false
}

// Login form data (includes validation state)
export interface LoginFormData extends LoginRequest {
  isSubmitting?: boolean;
  errors?: {
    email?: string[];
    password?: string[];
    general?: string;
  };
}

// Token verification request
export interface TokenVerificationRequest {
  token: string;
}
