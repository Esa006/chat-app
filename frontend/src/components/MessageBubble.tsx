import { format, isToday, isYesterday } from 'date-fns';
import type { Message } from '../types';
import { useAuth } from '../context/AuthContext';

interface MessageBubbleProps {
  message: Message;
  showAvatar: boolean;
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  if (isToday(d)) return format(d, 'HH:mm');
  if (isYesterday(d)) return `Yesterday ${format(d, 'HH:mm')}`;
  return format(d, 'dd MMM, HH:mm');
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function MessageBubble({ message, showAvatar }: MessageBubbleProps) {
  const { user } = useAuth();
  const isOwn = message.user_id === user?.id;

  return (
    <div className={`message-row ${isOwn ? 'message-row--own' : 'message-row--other'}`}>
      {!isOwn && (
        <div className="message-avatar">
          {showAvatar ? (
            message.user.avatar ? (
              <img src={message.user.avatar} alt={message.user.name} className="avatar-img" />
            ) : (
              <div className="avatar-initials">{getInitials(message.user.name)}</div>
            )
          ) : (
            <div className="avatar-spacer" />
          )}
        </div>
      )}

      <div className="message-content-wrapper">
        {!isOwn && showAvatar && (
          <span className="message-sender-name">{message.user.name}</span>
        )}
        <div className={`message-bubble ${isOwn ? 'bubble--own' : 'bubble--other'}`}>
          <span className="message-body">{message.body}</span>
          <span className="message-time">
            {formatTime(message.created_at)}
            {isOwn && (
              <i className={`bi ms-1 ${message.read_at ? 'bi-check2-all read' : 'bi-check2'}`} />
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
