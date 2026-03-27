import { useState, useEffect, useCallback } from 'react';
import type {
  DepartmentDistribution,
  MovementPoint,
  UtilizationSummary,
  FloorMap,
  IssueReport,
} from '@/types/mira';
import type { FloorData, RoomData } from '@/components/report/floorData';

const UTILIZATION_SUMMARY: UtilizationSummary = {
  utilizationRate: 0.84,
  activeAssetCount: 1032,
  totalAssetCount: 1248,
};

const DEPARTMENT_DISTRIBUTION: DepartmentDistribution[] = [
  { department: 'IT', assetCount: 320, percentage: 0.26 },
  { department: 'OPERATIONS', assetCount: 295, percentage: 0.24 },
  { department: 'FINANCE', assetCount: 220, percentage: 0.18 },
  { department: 'HR', assetCount: 175, percentage: 0.14 },
  { department: 'OTHER', assetCount: 238, percentage: 0.18 },
];

const MOVEMENT_TREND: MovementPoint[] = [
  { month: 'OCT', assignments: 42, returns: 18, maintenanceTransfers: 6 },
  { month: 'NOV', assignments: 48, returns: 22, maintenanceTransfers: 7 },
  { month: 'DEC', assignments: 51, returns: 20, maintenanceTransfers: 10 },
  { month: 'JAN', assignments: 57, returns: 24, maintenanceTransfers: 9 },
  { month: 'FEB', assignments: 60, returns: 26, maintenanceTransfers: 11 },
  { month: 'MAR', assignments: 64, returns: 28, maintenanceTransfers: 12 },
];

export function useReports() {
  return {
    utilization: UTILIZATION_SUMMARY,
    departmentDistribution: DEPARTMENT_DISTRIBUTION,
    movementTrend: MOVEMENT_TREND,
  };
}

// ---------------------------------------------------------------------------
// Helper: map API FloorMap[] → FloorData[] shape used by BuildingFloorMap
// ---------------------------------------------------------------------------
function toFloorData(data: FloorMap[]): FloorData[] {
  return data.map((floor) => ({
    level: floor.level,
    label: floor.floorName,
    rooms: floor.rooms.map(
      (room): RoomData => ({
        id: String(room.roomId),
        label: room.roomName,
        x: room.x,
        y: room.y,
        width: room.width,
        height: room.height,
        assetCount: room.assetCount,
      }),
    ),
  }));
}

// ---------------------------------------------------------------------------
// useFloorMap
// Fetches GET /api/reports/floor-map and returns FloorData[] for BuildingFloorMap.
// ---------------------------------------------------------------------------
export function useFloorMap() {
  const [floors, setFloors] = useState<FloorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = useCallback(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('mira_token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }, []);

  const fetchFloors = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/reports/floor-map', { headers: getHeaders() });
      if (!res.ok) throw new Error(`Failed to load floor map (${res.status})`);
      const data: FloorMap[] = await res.json();
      setFloors(toFloorData(data ?? []));
    } catch (err) {
      console.error('useFloorMap:', err);
      setError(err instanceof Error ? err.message : 'Failed to load floor map');
    } finally {
      setIsLoading(false);
    }
  }, [getHeaders]);

  useEffect(() => {
    fetchFloors();
  }, [fetchFloors]);

  return { floors, isLoading, error, refetch: fetchFloors };
}

// ---------------------------------------------------------------------------
// useIssueReports
// Fetches GET /api/reports and returns the enriched issue report list.
// ---------------------------------------------------------------------------
export function useIssueReports() {
  const [reports, setReports] = useState<IssueReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = useCallback(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('mira_token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }, []);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/reports', { headers: getHeaders() });
      if (!res.ok) throw new Error(`Failed to load reports (${res.status})`);
      const data: IssueReport[] = await res.json();
      setReports(data ?? []);
    } catch (err) {
      console.error('useIssueReports:', err);
      setError(err instanceof Error ? err.message : 'Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  }, [getHeaders]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { reports, isLoading, error, refetch: fetchReports };
}

// ---------------------------------------------------------------------------
// useUpdateReportStatus
// Updates a report's status via PUT /api/reports/[id].
// ---------------------------------------------------------------------------
export function useUpdateReportStatus() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const getHeaders = useCallback(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('mira_token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }, []);

  const updateStatus = async (reportId: string, status: string) => {
    setIsUpdating(true);
    setUpdateError(null);
    try {
      const res = await fetch(`/api/reports/${reportId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Failed to update status (${res.status})`);
      }

      return await res.json();
    } catch (err) {
      console.error('useUpdateReportStatus:', err);
      const msg = err instanceof Error ? err.message : 'Failed to update status';
      setUpdateError(msg);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateStatus, isUpdating, updateError };
}
