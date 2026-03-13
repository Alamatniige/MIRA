import type { Assignment, User } from '@/types/mira';
import { useCallback, useEffect, useState } from 'react';

export function useAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = useCallback(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('mira_token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }, []);

  const fetchAssignments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/assignments`, {
        headers: getHeaders(),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch assignments');
      }

      setAssignments(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      console.error('Failed to fetch assignments:', err);
      setError(err instanceof Error ? err.message : 'Failed to load assignments');
    } finally {
      setIsLoading(false);
    }
  }, [getHeaders]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch(`/api/users`, { headers: getHeaders() });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch users');
      }
      setUsers(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      console.error('Failed to fetch users:', err);
    }
  }, [getHeaders]);

  const createAssignment = useCallback(
    async (assetId: string, userId: string, notes: string) => {
      const response = await fetch('/api/assignments', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ assetId, userId, notes }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create assignment');
      }
      await fetchAssignments();
    },
    [getHeaders, fetchAssignments],
  );

  const confirmAssignment = useCallback(
    async (id: string) => {
      const response = await fetch(`/api/assignments/${id}/confirm`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to confirm assignment');
      }
      await fetchAssignments();
    },
    [getHeaders, fetchAssignments],
  );

  useEffect(() => {
    fetchAssignments();
    fetchUsers();
  }, [fetchAssignments, fetchUsers]);

  return {
    assignments,
    users,
    isLoading,
    error,
    refresh: fetchAssignments,
    createAssignment,
    confirmAssignment,
  };
}
