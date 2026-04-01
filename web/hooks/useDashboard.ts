import { useState, useEffect, useCallback, useMemo } from 'react';

type DashboardResponse<T> = {
  data: T;
  error?: string;
  status: number;
};

export type DashboardStats = {
  totalAssets: number;
  activeAssets: number;
  assignedAssets: number;
  underMaintenance: number;
  unassignedAssets: number;
  activePercentage: number;
};

export type RoomStat = {
  label: string;
  value: number;
  width: string;
};

export type ActivityItem = {
  id: string;
  tag: string;
  assetName: string;
  assignee: string;
  department: string;
  status: string;
  statusVariant: 'success' | 'warning' | 'muted' | 'default';
  date: string;
  initials: string;
};

const getHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('mira_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/dashboard/stats', { headers: getHeaders() });
      const result: DashboardResponse<DashboardStats> = await response.json();
      if (!response.ok || result.error) {
        throw new Error(result.error || 'Failed to fetch dashboard stats');
      }
      setStats(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, error, refresh: fetchStats };
}

export function useDashboardRooms() {
  const [rooms, setRooms] = useState<RoomStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/dashboard/rooms', { headers: getHeaders() });
      const result: DashboardResponse<RoomStat[]> = await response.json();
      if (!response.ok || result.error) {
        throw new Error(result.error || 'Failed to fetch dashboard rooms');
      }
      setRooms(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return { rooms, isLoading, error, refresh: fetchRooms };
}

export function useDashboardActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivity = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/dashboard/activity', { headers: getHeaders() });
      const result: DashboardResponse<ActivityItem[]> = await response.json();
      if (!response.ok || result.error) {
        throw new Error(result.error || 'Failed to fetch activity');
      }
      setActivities(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  return { activities, isLoading, error, refresh: fetchActivity };
}
