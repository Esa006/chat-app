import { useCallback } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { ChatRoom } from './ChatRoom';
import { useConversations } from '../hooks/useConversations';
import type { Message } from '../types';

export function ChatLayout() {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const activeId = conversationId ? Number(conversationId) : null;

  const {
    conversations,
    isLoading,
    addConversation,
    updateLastMessage,
  } = useConversations();

  const handleNewMessage = useCallback(
    (convId: number, msg: Message) => {
      updateLastMessage(convId, msg);
    },
    [updateLastMessage]
  );

  return (
    <div className="app-shell">
      <Sidebar
        conversations={conversations}
        isLoading={isLoading}
        activeConversationId={activeId}
        onConversationCreated={addConversation}
      />
      <main className="chat-main">
        {activeId ? (
          <ChatRoom onNewMessage={handleNewMessage} />
        ) : (
          <div className="chat-empty-state">
            <div className="chat-empty-inner">
              <i className="bi bi-chat-square-dots-fill chat-empty-icon" />
              <h2 className="chat-empty-title">Welcome to ChatFlow</h2>
              <p className="chat-empty-subtitle">
                Select a conversation from the sidebar<br />or click ✏️ to start a new chat.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('auth_token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
