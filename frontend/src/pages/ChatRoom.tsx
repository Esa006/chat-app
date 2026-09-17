import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Conversation, Message } from '../types';
import { ChatHeader } from '../components/ChatHeader';
import { MessageList } from '../components/MessageList';
import { MessageInput } from '../components/MessageInput';
import { TypingIndicator } from '../components/TypingIndicator';
import { useMessages } from '../hooks/useMessages';
import { useEcho } from '../context/EchoContext';
import { useAuth } from '../context/AuthContext';
import { conversationsApi } from '../api/conversations';

interface ChatRoomProps {
  onNewMessage?: (conversationId: number, msg: Message) => void;
}

export function ChatRoom({ onNewMessage }: ChatRoomProps) {
  const { conversationId } = useParams<{ conversationId: string }>();
  const id = conversationId ? Number(conversationId) : null;

  const { echo } = useEcho();
  const { user } = useAuth();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [typerName, setTyperName] = useState<string | null>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Load conversation details
  useEffect(() => {
    if (!id) return;
    conversationsApi.show(id).then(({ data }) => setConversation(data));
  }, [id]);

  const handleNewMessage = useCallback(
    (msg: Message) => {
      onNewMessage?.(msg.conversation_id, msg);
    },
    [onNewMessage]
  );

  const { messages, isLoading, isSending, hasMore, loadMore, sendMessage, sendTyping } =
    useMessages({ conversationId: id, onNewMessage: handleNewMessage });

  // Listen for whisper typing events
  useEffect(() => {
    if (!echo || !id) return;
    const channel = echo.private(`conversation.${id}`);

    channel.listenForWhisper('typing', (e: { name: string }) => {
      if (e.name === user?.name) return;
      setTyperName(e.name);
      clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => setTyperName(null), 3000) as ReturnType<typeof setTimeout>;
    });

    return () => {
      channel.stopListeningForWhisper('typing');
    };
  }, [echo, id, user]);

  const handleSend = useCallback(
    async (body: string) => {
      const msg = await sendMessage(body);
      if (msg) onNewMessage?.(id!, msg);
    },
    [sendMessage, onNewMessage, id]
  );

  if (!id) {
    return (
      <div className="chat-empty-state">
        <i className="bi bi-chat-square-dots-fill chat-empty-icon" />
        <h2>Select a conversation</h2>
        <p>Pick a chat from the sidebar or start a new one.</p>
      </div>
    );
  }

  return (
    <div className="chat-room">
      {conversation && <ChatHeader conversation={conversation} />}

      <MessageList
        messages={messages}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={loadMore}
      />

      <TypingIndicator typerName={typerName} />

      <div className="message-input-area">
        <MessageInput
          onSend={handleSend}
          onTyping={sendTyping}
          isSending={isSending}
        />
      </div>
    </div>
  );
}
