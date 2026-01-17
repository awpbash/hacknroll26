import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { getMockUser, setMockUser, removeMockUser, MockUser } from '../data/mockData';

// User interface
export interface User {
  id: string | number;
  username: string;
  email: string;
  totalScore: number;
  solvedCount: number;
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
export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
}
export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
}
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
    // Load user from localStorage
    const savedUser = getMockUser();
    if (savedUser) {
      setUser(savedUser as User);
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Mock login - accept any email/password
    const mockUser: User = {
      id: Date.now(),
      username: credentials.email.split('@')[0],
      email: credentials.email,
      totalScore: 2150,
      solvedCount: 3
    };

    setMockUser(mockUser as MockUser);
    setUser(mockUser);
    return { success: true };
  };

  const register = async (userData: RegisterData): Promise<AuthResponse> => {
    // Mock registration
    const mockUser: User = {
      id: Date.now(),
      username: userData.username,
      email: userData.email,
      totalScore: 0,
      solvedCount: 0
    };

    setMockUser(mockUser as MockUser);
    setUser(mockUser);
    return { success: true };
  };

  const logout = (): void => {
    removeMockUser();
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
