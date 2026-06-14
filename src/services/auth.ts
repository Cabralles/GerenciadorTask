import api from './api';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  full_name?: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
}

export const authAPI = {
  register: (data: RegisterRequest) =>
    api.post<User>('/api/auth/register', data),

  login: (credentials: LoginRequest) =>
    api.post<AuthResponse>('/api/auth/login', credentials),

  getCurrentUser: () =>
    api.get<User>('/api/auth/me'),
};
