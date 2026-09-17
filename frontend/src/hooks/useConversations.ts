import { useState, useEffect, useCallback } from 'react';
import { conversationsApi } from '../api/conversations';
import type { Conversation, Message } from '../types';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await conversationsApi.list();
      setConversations(data);
    } catch {
      setError('Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  /** Call this to optimistically push a new last_message to a conversation */
  const updateLastMessage = useCallback((conversationId: number, message: Message) => {
    setConversations((prev) =>
      prev
        .map((c) =>
          c.id === conversationId
            ? { ...c, last_message: message, updated_at: message.created_at }
            : c
        )
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    );
  }, []);

  const addConversation = useCallback((conv: Conversation) => {
    setConversations((prev) => [conv, ...prev]);
  }, []);

  return {
    conversations,
    isLoading,
    error,
    refresh: fetchConversations,
    updateLastMessage,
    addConversation,
  };
}
