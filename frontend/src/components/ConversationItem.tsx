import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import type { Conversation } from '../types';
import { useAuth } from '../context/AuthContext';
import { usePresence } from '../hooks/usePresence';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
}

function getOtherParticipant(conversation: Conversation, myId: number) {
  return conversation.participants.find((p) => p.id !== myId) ?? conversation.participants[0];
}

function getInitials(name: string) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

export function ConversationItem({ conversation, isActive }: ConversationItemProps) {
  const { user } = useAuth();
  const { isOnline } = usePresence();
  const navigate = useNavigate();

  const other =
    conversation.type === 'private' && user
      ? getOtherParticipant(conversation, user.id)
      : null;

  const title =
    conversation.type === 'private'
      ? other?.name ?? 'Unknown'
      : conversation.name ?? 'Group';

  const online = other ? isOnline(other.id) : false;
  const preview = conversation.last_message?.body ?? 'No messages yet';
  const previewTime = conversation.last_message
    ? formatDistanceToNow(new Date(conversation.last_message.created_at), { addSuffix: true })
    : '';

  return (
    <button
      className={`conversation-item ${isActive ? 'conversation-item--active' : ''}`}
      onClick={() => navigate(`/chat/${conversation.id}`)}
      aria-label={`Open conversation with ${title}`}
    >
      <div className="conv-avatar-wrap">
        {other?.avatar ? (
          <img src={other.avatar} alt={title} className="avatar-img" />
        ) : (
          <div className="avatar-initials">{getInitials(title)}</div>
        )}
        <span className={`presence-dot ${online ? 'presence-dot--online' : ''}`} />
      </div>

      <div className="conv-info">
        <div className="conv-top-row">
          <span className="conv-name">{title}</span>
          <span className="conv-time">{previewTime}</span>
        </div>
        <div className="conv-bottom-row">
          <span className="conv-preview">{preview}</span>
          {conversation.unread_count > 0 && (
            <span className="unread-badge">{conversation.unread_count}</span>
          )}
        </div>
      </div>
    </button>
  );
}
