import type { Conversation } from '../types';
import { useAuth } from '../context/AuthContext';
import { usePresence } from '../hooks/usePresence';
import { format, isToday } from 'date-fns';

interface ChatHeaderProps {
  conversation: Conversation;
}

function getOtherParticipant(conversation: Conversation, myId: number) {
  return conversation.participants.find((p) => p.id !== myId) ?? conversation.participants[0];
}

function getInitials(name: string) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

export function ChatHeader({ conversation }: ChatHeaderProps) {
  const { user } = useAuth();
  const { isOnline } = usePresence();

  const title =
    conversation.type === 'private' && user
      ? getOtherParticipant(conversation, user.id)?.name
      : conversation.name ?? 'Group Chat';

  const otherUser =
    conversation.type === 'private' && user
      ? getOtherParticipant(conversation, user.id)
      : null;

  const online = otherUser ? isOnline(otherUser.id) : false;

  const subtitle = online
    ? 'Online'
    : otherUser?.last_seen_at
    ? `Last seen ${
        isToday(new Date(otherUser.last_seen_at))
          ? format(new Date(otherUser.last_seen_at), 'HH:mm')
          : format(new Date(otherUser.last_seen_at), 'dd MMM')
      }`
    : '';

  return (
    <div className="chat-header">
      <div className="chat-header-avatar">
        {otherUser?.avatar ? (
          <img src={otherUser.avatar} alt={title} className="avatar-img avatar-img--md" />
        ) : (
          <div className="avatar-initials avatar-initials--md">
            {getInitials(title ?? '?')}
          </div>
        )}
        <span className={`presence-dot ${online ? 'presence-dot--online' : 'presence-dot--offline'}`} />
      </div>
      <div className="chat-header-info">
        <h2 className="chat-header-title">{title}</h2>
        {subtitle && <span className="chat-header-subtitle">{subtitle}</span>}
      </div>
    </div>
  );
}
