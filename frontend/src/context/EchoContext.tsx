import React, { createContext, useContext, useEffect, useRef } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { useAuth } from './AuthContext';

// Make Pusher available globally (required by Echo)
(window as unknown as { Pusher: typeof Pusher }).Pusher = Pusher;

interface EchoContextValue {
  echo: Echo<'reverb'> | null;
}

const EchoContext = createContext<EchoContextValue>({ echo: null });

export function EchoProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const echoRef = useRef<Echo<'reverb'> | null>(null);

  useEffect(() => {
    if (!token) {
      if (echoRef.current) {
        echoRef.current.disconnect();
        echoRef.current = null;
      }
      return;
    }

    echoRef.current = new Echo({
      broadcaster: 'reverb',
      key: import.meta.env.VITE_REVERB_APP_KEY || 'chat-key',
      wsHost: import.meta.env.VITE_REVERB_HOST || '127.0.0.1',
      wsPort: Number(import.meta.env.VITE_REVERB_PORT) || 8080,
      wssPort: Number(import.meta.env.VITE_REVERB_PORT) || 8080,
      forceTLS: false,
      enabledTransports: ['ws'],
      authEndpoint: `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      },
    });

    return () => {
      echoRef.current?.disconnect();
      echoRef.current = null;
    };
  }, [token]);

  return (
    <EchoContext.Provider value={{ echo: echoRef.current }}>
      {children}
    </EchoContext.Provider>
  );
}

export function useEcho() {
  return useContext(EchoContext);
}
