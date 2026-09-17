import api from './client';
import type { Message, PaginatedMessages } from '../types';

export const messagesApi = {
  list: (conversationId: number, page = 1) =>
    api.get<PaginatedMessages>(`/api/conversations/${conversationId}/messages`, {
      params: { page, per_page: 30 },
    }),

  send: (conversationId: number, body: string) =>
    api.post<Message>(`/api/conversations/${conversationId}/messages`, { body }),

  markRead: (conversationId: number) =>
    api.post(`/api/conversations/${conversationId}/read`),
};
