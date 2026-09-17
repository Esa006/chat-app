import api from './client';
import type { Conversation, User } from '../types';

export const conversationsApi = {
  list: () => api.get<Conversation[]>('/api/conversations'),

  create: (participant_ids: number[], name?: string, type: 'private' | 'group' = 'private') =>
    api.post<Conversation>('/api/conversations', { participant_ids, name, type }),

  show: (id: number) => api.get<Conversation>(`/api/conversations/${id}`),
};

export const usersApi = {
  search: (query: string) => api.get<User[]>('/api/users', { params: { q: query } }),
};
