const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

export const tokenStorage = {
  getAccessToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  setAccessToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (token: string): void => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  clearTokens: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]!));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};