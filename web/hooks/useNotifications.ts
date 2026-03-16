import { useState, useCallback } from 'react';
import { Notification } from '@/types/mira';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

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

  const markRead = useCallback(
    async (id: string) => {
      try {
        await fetch(`/api/notifications/${id}/read`, {
          method: 'PUT',
          headers: getHeaders(),
        });
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      } catch (err) {
        console.error('Failed to mark notification as read:', err);
      }
    },
    [getHeaders],
  );

  const markAllRead = useCallback(async () => {
    try {
      await fetch('/api/notifications/read-all', {
        method: 'PUT',
        headers: getHeaders(),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
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
