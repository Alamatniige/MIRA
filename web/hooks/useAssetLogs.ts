import { useState, useCallback, useEffect } from 'react';
import { AssetLog } from '@/types/mira';

export function useAssetLogs() {
  const [logs, setLogs] = useState<AssetLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('mira_token');
      const response = await fetch('/api/history/assets/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch asset logs');
      }

      const data = await response.json();
      setLogs(data || []);
    } catch (err: unknown) {
      setError((err as { message: string }).message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, isLoading, error, refresh: fetchLogs };
}
