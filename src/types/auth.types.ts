export interface User {
  id: number;  // Matches backend (number, not string)
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Matches backend AuthResponseDto exactly
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

// Matches backend RefreshTokenDto
export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}