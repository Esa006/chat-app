import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Conversation, User } from '../types';
import { usersApi, conversationsApi } from '../api/conversations';
import { ConversationItem } from './ConversationItem';
import { useAuth } from '../context/AuthContext';
import { requestNotificationPermission, playNotificationSound } from '../utils/notifications';

interface SidebarProps {
  conversations: Conversation[];
  isLoading: boolean;
  activeConversationId: number | null;
  onConversationCreated: (conv: Conversation) => void;
}

function getInitials(name: string) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

export function Sidebar({
  conversations,
  isLoading,
  activeConversationId,
  onConversationCreated,
}: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = useCallback(async (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) { setSearchResults([]); return; }
    setIsSearching(true);
    try {
      const { data } = await usersApi.search(q);
      setSearchResults(data);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const startConversation = useCallback(async (targetUser: User) => {
    try {
      const { data } = await conversationsApi.create([targetUser.id]);
      onConversationCreated(data);
      navigate(`/chat/${data.id}`);
      setShowSearch(false);
      setSearchQuery('');
      setSearchResults([]);
    } catch {/* conversation may already exist — navigate away */}
  }, [navigate, onConversationCreated]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <i className="bi bi-lightning-charge-fill brand-icon" />
          <span className="brand-name">ChatFlow</span>
        </div>
        <div className="sidebar-actions">
          <button
            className="icon-btn"
            title="Enable Notifications & Test Sound"
            onClick={async () => {
              await requestNotificationPermission();
              playNotificationSound();
            }}
            aria-label="Enable notifications"
          >
            <i className="bi bi-bell-fill" />
          </button>
          <button
            id="new-chat-btn"
            className="icon-btn"
            title="New chat"
            onClick={() => setShowSearch((s) => !s)}
            aria-label="Start new chat"
          >
            <i className="bi bi-pencil-square" />
          </button>
        </div>
      </div>

      {/* New chat search */}
      {showSearch && (
        <div className="search-panel">
          <div className="search-input-wrap">
            <i className="bi bi-search search-icon" />
            <input
              id="user-search-input"
              type="text"
              className="search-input"
              placeholder="Search users…"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              autoFocus
            />
          </div>
          <div className="search-results">
            {isSearching && <div className="search-spinner"><div className="spinner-border spinner-border-sm" /></div>}
            {searchResults.map((u) => (
              <button
                key={u.id}
                className="search-result-item"
                onClick={() => startConversation(u)}
              >
                <div className="avatar-initials avatar-initials--sm">{getInitials(u.name)}</div>
                <div>
                  <div className="search-result-name">{u.name}</div>
                  <div className="search-result-email">{u.email}</div>
                </div>
              </button>
            ))}
            {!isSearching && searchQuery && searchResults.length === 0 && (
              <p className="search-empty">No users found</p>
            )}
          </div>
        </div>
      )}

      {/* Conversation List */}
      <div className="conversation-list">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="conv-skeleton">
              <div className="skeleton-avatar" />
              <div className="skeleton-lines">
                <div className="skeleton-line skeleton-line--wide" />
                <div className="skeleton-line skeleton-line--narrow" />
              </div>
            </div>
          ))
        ) : conversations.length === 0 ? (
          <div className="conv-empty">
            <i className="bi bi-chat-left-dots conv-empty-icon" />
            <p>No chats yet.<br />Click <strong>✏️</strong> to start one.</p>
          </div>
        ) : (
          conversations.map((c) => (
            <ConversationItem
              key={c.id}
              conversation={c}
              isActive={c.id === activeConversationId}
            />
          ))
        )}
      </div>

      {/* User footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="avatar-initials avatar-initials--sm">
            {getInitials(user?.name ?? '?')}
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user?.name}</span>
            <span className="sidebar-user-email">{user?.email}</span>
          </div>
        </div>
        <button id="logout-btn" className="icon-btn" title="Logout" onClick={handleLogout} aria-label="Logout">
          <i className="bi bi-box-arrow-right" />
        </button>
      </div>
    </aside>
  );
}
