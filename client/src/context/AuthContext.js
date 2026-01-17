import React, { createContext, useState, useEffect, useContext } from 'react';
import { getMockUser, setMockUser, removeMockUser } from '../data/mockData';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage
    const savedUser = getMockUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    // Mock login - accept any email/password
    const mockUser = {
      id: Date.now(),
      username: credentials.email.split('@')[0],
      email: credentials.email,
      totalScore: 2150,
      solvedCount: 3
    };

    setMockUser(mockUser);
    setUser(mockUser);
    return { success: true };
  };

  const register = async (userData) => {
    // Mock registration
    const mockUser = {
      id: Date.now(),
      username: userData.username,
      email: userData.email,
      totalScore: 0,
      solvedCount: 0
    };

    setMockUser(mockUser);
    setUser(mockUser);
    return { success: true };
  };

  const logout = () => {
    removeMockUser();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
