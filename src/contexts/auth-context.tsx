import React, { createContext, useEffect, useState } from "react";
import type {
  AuthContextType,
  User,
  LoginCredentials,
} from "../types/auth.types";
import { tokenStorage, isTokenExpired } from "../lib/auth";
import { authApi } from "../api/auth.api";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (credentials: LoginCredentials) => {
    const authResponse = await authApi.login(credentials);

    setUser(authResponse.user);
    tokenStorage.setAccessToken(authResponse.accessToken);
    tokenStorage.setRefreshToken(authResponse.refreshToken);
    localStorage.setItem("user_data", JSON.stringify(authResponse.user));
  };

  const logout = () => {
    setUser(null);
    tokenStorage.clearTokens();
  };

  const refreshToken = async () => {
    const refresh = tokenStorage.getRefreshToken();
    if (!refresh) throw new Error("No refresh token");

    const authResponse = await authApi.refreshToken({ refreshToken: refresh });

    tokenStorage.setAccessToken(authResponse.accessToken);
    tokenStorage.setRefreshToken(authResponse.refreshToken);
    setUser(authResponse.user);
    localStorage.setItem("user_data", JSON.stringify(authResponse.user));
  };

  useEffect(() => {
    const initializeAuth = () => {
      const token = tokenStorage.getAccessToken();
      const userData = localStorage.getItem("user_data");

      if (token && !isTokenExpired(token) && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch {
          tokenStorage.clearTokens();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
