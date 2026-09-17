import { useState, useEffect, useCallback, useRef } from 'react';
import { messagesApi } from '../api/messages';
import { useEcho } from '../context/EchoContext';
import type { Message } from '../types';

interface UseMessagesOptions {
  conversationId: number | null;
  onNewMessage?: (msg: Message) => void;
}

export function useMessages({ conversationId, onNewMessage }: UseMessagesOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const { echo } = useEcho();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const channelRef = useRef<any>(null);

  // Fetch message history when conversation changes
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    setMessages([]);
    setCurrentPage(1);
    setIsLoading(true);

    messagesApi.list(conversationId, 1)
      .then(({ data }) => {
        setMessages(data.data.reverse());
        setLastPage(data.last_page);
        messagesApi.markRead(conversationId).catch(() => {});
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [conversationId]);

  // Load older messages (pagination)
  const loadMore = useCallback(async () => {
    if (!conversationId || currentPage >= lastPage) return;
    const nextPage = currentPage + 1;
    const { data } = await messagesApi.list(conversationId, nextPage);
    setMessages((prev) => [...data.data.reverse(), ...prev]);
    setCurrentPage(nextPage);
  }, [conversationId, currentPage, lastPage]);

  // Subscribe to real-time channel
  useEffect(() => {
    if (!echo || !conversationId) return;

    channelRef.current = echo.private(`conversation.${conversationId}`);

    channelRef.current.listen('.MessageSent', (event: { message: Message }) => {
      setMessages((prev) => {
        // Deduplicate by id
        if (prev.find((m) => m.id === event.message.id)) return prev;
        return [...prev, event.message];
      });
      onNewMessage?.(event.message);
      messagesApi.markRead(conversationId).catch(() => {});
    });

    return () => {
      channelRef.current?.stopListening('.MessageSent');
      echo.leave(`conversation.${conversationId}`);
      channelRef.current = null;
    };
  }, [echo, conversationId, onNewMessage]);

  // Send typing whisper
  const sendTyping = useCallback(() => {
    channelRef.current?.whisper('typing', {});
  }, []);

  // Send a message
  const sendMessage = useCallback(async (body: string) => {
    if (!conversationId || !body.trim()) return;
    setIsSending(true);
    try {
      const { data } = await messagesApi.send(conversationId, body.trim());
      // Optimistically add own message (broadcast will arrive too — dedup handles it)
      setMessages((prev) => {
        if (prev.find((m) => m.id === data.id)) return prev;
        return [...prev, data];
      });
      return data;
    } finally {
      setIsSending(false);
    }
  }, [conversationId]);

  return {
    messages,
    isLoading,
    isSending,
    hasMore: currentPage < lastPage,
    loadMore,
    sendMessage,
    sendTyping,
    channel: channelRef.current,
  };
}
