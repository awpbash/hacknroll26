import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { authAPI } from '../services/api';
import { AxiosError } from 'axios';

// User interface
export interface User {
  id: string | number;
  username: string;
  email: string;
  totalScore?: number;
  solvedCount?: number;
}

// Login credentials interface
export interface LoginCredentials {
  email: string;
  password: string;
}

// Registration data interface
export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

// Auth response interface
export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// AuthContext type definition
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (userData: RegisterData) => Promise<AuthResponse>;
  logout: () => void;
  isAuthenticated: boolean;
}

// AuthProvider props
interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load user from token
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and load user
      authAPI.getCurrentUser()
        .then(response => {
          setUser(response.data);
          setLoading(false);
        })
        .catch(() => {
          // Token invalid or expired
          localStorage.removeItem('token');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;

      if (token && user) {
        localStorage.setItem('token', token);
        setUser(user);
        return { success: true };
      }

      return { success: false, error: 'Invalid response from server' };
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return {
        success: false,
        error: axiosError.response?.data?.message || 'Login failed. Please try again.'
      };
    }
  };

  const register = async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await authAPI.register(userData);
      const { token, user } = response.data;

      if (token && user) {
        localStorage.setItem('token', token);
        setUser(user);
        return { success: true };
      }

      return { success: false, error: 'Invalid response from server' };
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return {
        success: false,
        error: axiosError.response?.data?.message || 'Registration failed. Please try again.'
      };
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
