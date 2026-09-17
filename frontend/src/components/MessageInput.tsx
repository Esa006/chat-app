import { useState, useRef, type FormEvent, type KeyboardEvent } from 'react';

interface MessageInputProps {
  onSend: (body: string) => void;
  onTyping?: () => void;
  isSending: boolean;
  disabled?: boolean;
}

export function MessageInput({ onSend, onTyping, isSending, disabled }: MessageInputProps) {
  const [body, setBody] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!body.trim() || isSending || disabled) return;
    onSend(body);
    setBody('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
    // Auto-grow
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
    // Typing indicator throttle
    if (onTyping) {
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => { /* typing throttle */ }, 1500) as ReturnType<typeof setTimeout>;
      onTyping();
    }
  };

  return (
    <form className="message-input-form" onSubmit={handleSubmit}>
      <div className="message-input-wrapper">
        <textarea
          id="message-input"
          ref={textareaRef}
          className="message-textarea"
          placeholder="Type a message… (Enter to send, Shift+Enter for newline)"
          value={body}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled || isSending}
          rows={1}
        />
        <button
          id="send-button"
          type="submit"
          className="send-btn"
          disabled={!body.trim() || isSending || disabled}
          aria-label="Send message"
        >
          {isSending ? (
            <span className="spinner-border spinner-border-sm" role="status" />
          ) : (
            <i className="bi bi-send-fill" />
          )}
        </button>
      </div>
    </form>
  );
}
