import api from './api';

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface LoginResponse {
  success: boolean;
  data: User;
  token: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (username: string, email: string, password: string): Promise<LoginResponse> => {
  const response = await api.post('/auth/register', { username, email, password });
  return response.data;
};

export const getMe = async (): Promise<{ success: boolean; data: User }> => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const updateProfile = async (data: Partial<User>): Promise<{ success: boolean; data: User }> => {
  const response = await api.put('/auth/profile', data);
  return response.data;
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.put('/auth/password', { currentPassword, newPassword });
  return response.data;
};
