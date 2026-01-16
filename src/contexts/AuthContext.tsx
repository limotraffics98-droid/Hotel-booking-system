import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authApi } from '../api/auth';
import { apiClient } from '../api/client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        apiClient.setToken(token);
        const response = await authApi.getMe();
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          apiClient.setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });

    if (response.success && response.data) {
      setUser(response.data.user);
      apiClient.setToken(response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      return { success: true };
    }

    return { success: false, error: response.error || 'Login failed' };
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    const response = await authApi.register({ name, email, password, phone });

    if (response.success && response.data) {
      setUser(response.data.user);
      apiClient.setToken(response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      return { success: true };
    }

    return { success: false, error: response.error || 'Registration failed' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    apiClient.setToken(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
