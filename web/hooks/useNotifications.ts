import { useState, useCallback, useEffect, useRef } from 'react';
import { Notification } from '@/types/mira';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isConnectingRef = useRef(false);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const getHeaders = useCallback(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('mira_token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }, []);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/notifications', {
        cache: 'no-store',
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      setNotifications(data || []);
    } catch (err: unknown) {
      console.error('Failed to fetch notifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  }, [getHeaders]);

  // Real-time SSE Listener
  useEffect(() => {
    if (typeof window === 'undefined' || isConnectingRef.current) return;

    let isMounted = true;
    const controller = new AbortController();

    const connectSSE = async () => {
      isConnectingRef.current = true;
      try {
        const response = await fetch('/api/notifications/stream', {
          cache: 'no-store',
          headers: getHeaders(),
          signal: controller.signal,
        });

        if (!response.ok) throw new Error('SSE connection failed');
        const reader = response.body?.getReader();
        if (!reader) return;

        const decoder = new TextDecoder();
        let buffer = '';
        while (isMounted) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const newNotif: Notification = JSON.parse(line.slice(6));
                setNotifications((prev) => {
                  // Avoid duplicates
                  if (prev.some((n) => n.id === newNotif.id)) return prev;
                  return [newNotif, ...prev];
                });
              } catch (e) {
                // Ignore parse errors from heartbeat or malformed chunks
              }
            }
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('SSE Error:', err);
          // Retry after 5s
          setTimeout(() => {
            if (isMounted) connectSSE();
          }, 5000);
        }
      } finally {
        isConnectingRef.current = false;
      }
    };

    connectSSE();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [getHeaders]);

  // Fallback refresh in case SSE is interrupted by proxy/network behavior.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const id = window.setInterval(() => {
      fetchNotifications();
    }, 30000);
    return () => window.clearInterval(id);
  }, [fetchNotifications]);

  const markRead = useCallback(
    async (id: string) => {
      try {
        await fetch(`/api/notifications/${id}/read`, {
          method: 'PATCH',
          cache: 'no-store',
          headers: getHeaders(),
        });
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
      } catch (err) {
        console.error('Failed to mark notification as read:', err);
      }
    },
    [getHeaders],
  );

  const markAllRead = useCallback(async () => {
    try {
      await fetch('/api/notifications/read-all', {
        method: 'PATCH',
        cache: 'no-store',
        headers: getHeaders(),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  }, [getHeaders]);

  return {
    notifications,
    isLoading,
    error,
    unreadCount,
    fetchNotifications,
    markRead,
    markAllRead,
  };
}
