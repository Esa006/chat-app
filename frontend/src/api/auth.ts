import api from './client';
import type { AuthResponse } from '../types';

export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/api/login', { email, password }),

  register: (name: string, email: string, password: string, password_confirmation: string) =>
    api.post<AuthResponse>('/api/register', { name, email, password, password_confirmation }),

  logout: () => api.post('/api/logout'),

  me: () => api.get<AuthResponse['user']>('/api/me'),
};
