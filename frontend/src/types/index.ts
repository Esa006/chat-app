// ─────────────────────────────────────────────
//  Shared TypeScript interfaces for the chat app
// ─────────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  is_online: boolean;
  last_seen_at: string | null;
}

export interface Conversation {
  id: number;
  name: string | null;
  type: 'private' | 'group';
  participants: User[];
  last_message: Message | null;
  unread_count: number;
  updated_at: string;
}

export interface Message {
  id: number;
  conversation_id: number;
  user_id: number;
  user: User;
  body: string;
  type: 'text' | 'image';
  read_at: string | null;
  created_at: string;
}

export interface PaginatedMessages {
  data: Message[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}
