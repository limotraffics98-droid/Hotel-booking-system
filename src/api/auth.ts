import { apiClient } from './client';
import { User, ApiResponse } from '../types';

export const authApi = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>> => {
    return apiClient.post('/auth/register', data);
  },

  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>> => {
    return apiClient.post('/auth/login', credentials);
  },

  refresh: async (refreshToken: string): Promise<ApiResponse<{ accessToken: string }>> => {
    return apiClient.post('/auth/refresh', { refreshToken });
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    return apiClient.get('/auth/me');
  },

  updateProfile: async (data: {
    name?: string;
    phone?: string;
  }): Promise<ApiResponse<User>> => {
    return apiClient.put('/auth/profile', data);
  },

  updatePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<null>> => {
    return apiClient.put('/auth/password', data);
  },
};
