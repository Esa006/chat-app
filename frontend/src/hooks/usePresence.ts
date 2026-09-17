import { useState, useEffect, useCallback } from 'react';
import { useEcho } from '../context/EchoContext';
import { useAuth } from '../context/AuthContext';

export function usePresence() {
  const { echo } = useEcho();
  const { user } = useAuth();
  const [onlineIds, setOnlineIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!echo || !user) return;

    const channel = echo.join('online');

    channel
      .here((users: { id: number }[]) => {
        setOnlineIds(new Set(users.map((u) => u.id)));
      })
      .joining((u: { id: number }) => {
        setOnlineIds((prev) => new Set([...prev, u.id]));
      })
      .leaving((u: { id: number }) => {
        setOnlineIds((prev) => {
          const next = new Set(prev);
          next.delete(u.id);
          return next;
        });
      });

    return () => {
      echo.leave('online');
    };
  }, [echo, user]);

  const isOnline = useCallback((userId: number) => onlineIds.has(userId), [onlineIds]);

  return { onlineIds, isOnline };
}
