import { useEffect, useRef } from 'react';
import type { Message } from '../types';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export function MessageList({ messages, isLoading, hasMore, onLoadMore }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(0);

  // Auto-scroll to bottom only when new messages arrive (not load-more)
  useEffect(() => {
    if (messages.length > prevLengthRef.current) {
      const diff = messages.length - prevLengthRef.current;
      // If only 1 new message arrived (real-time), scroll to bottom
      if (diff <= 3) {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
    prevLengthRef.current = messages.length;
  }, [messages.length]);

  // Scroll to bottom on conversation change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'instant' });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return (
      <div className="message-list-loading">
        <div className="spinner-border text-accent" role="status">
          <span className="visually-hidden">Loading…</span>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="message-list-empty">
        <i className="bi bi-chat-dots-fill empty-icon" />
        <p>No messages yet. Say hello! 👋</p>
      </div>
    );
  }

  return (
    <div className="message-list" ref={listRef}>
      {hasMore && (
        <div className="load-more-wrapper">
          <button className="btn btn-sm load-more-btn" onClick={onLoadMore}>
            <i className="bi bi-arrow-up-circle me-1" />
            Load older messages
          </button>
        </div>
      )}

      {messages.map((msg, idx) => {
        const prev = messages[idx - 1];
        const showAvatar = !prev || prev.user_id !== msg.user_id;
        return (
          <MessageBubble key={msg.id} message={msg} showAvatar={showAvatar} />
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
}
