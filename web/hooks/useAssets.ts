import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Asset, AssetType, AssetRoom, AssetFloor } from '@/types/mira';

type AssetMutationPayload = {
  assetName: string;
  assetTypeName?: string;
  serialNumber: string;
  specification: string;
  roomName?: string;
  roomExtra?: { floorId?: number | null; x?: number; y?: number; width?: number; height?: number };
  floorName?: string;
  floorExtra?: { level?: number };
  tag: string;
  currentStatus: string;
};

type CreateAssetPayload = AssetMutationPayload & {
  imageFiles?: File[];
};

type UpdateAssetPayload = AssetMutationPayload & {
  id: string;
  assetTypeId?: number | null;
  roomId?: number | null;
  floorId?: number | null;
  existingImages?: string[];
  newImageFiles?: File[];
};

const getErrorMessage = (err: unknown, fallback: string) => {
  if (err instanceof Error) {
    return err.message;
  }
  return fallback;
};

const normalizeName = (value: string) => value.trim().toLowerCase();

const normalizeStatus = (value: string | null | undefined) =>
  (value || '')
    .trim()
    .toLowerCase()
    .replace(/[_\s-]+/g, ' ');

type AssetAssignmentStatus = 'Assigned' | 'Unassigned' | 'Unavailable';
type AssetConditionStatus = 'Good' | 'Under Review' | 'Under Maintenance' | 'Unknown';

const getAssignmentStatus = (asset: Asset): AssetAssignmentStatus => {
  const status = (asset.assignmentStatus || '').trim();
  if (status === 'Approved' || status === 'Pending') return 'Assigned';
  if (status === 'Unavailable') return 'Unavailable';
  return 'Unassigned';
};

const getConditionStatus = (asset: Asset): AssetConditionStatus => {
  const status = normalizeStatus(asset.currentStatus);

  if (status === 'under maintenance' || status === 'maintenance') {
    return 'Under Maintenance';
  }

  if (status === 'under review') {
    return 'Under Review';
  }

  if (status === 'good' || status === 'available') {
    return 'Good';
  }

  return status ? 'Unknown' : 'Good';
};

const toApiConditionStatus = (value: string | null | undefined): string => {
  const status = normalizeStatus(value);

  if (status === 'under maintenance' || status === 'maintenance') {
    return 'Under Maintenance';
  }

  if (status === 'under review') {
    return 'Under Review';
  }

  if (status === 'good' || status === 'available' || status === '') {
    return 'Good';
  }

  return (value || '').trim();
};

const getAvailabilityBucket = (asset: Asset): 'available' | 'unavailable' | 'underMaintenance' => {
  const assignStatus = (asset.assignmentStatus || '').trim();

  if (assignStatus === 'Approved' || assignStatus === 'Pending') {
    return 'unavailable';
  }

  if (assignStatus === 'Unavailable') {
    const condition = getConditionStatus(asset);
    if (condition === 'Under Maintenance') {
      return 'underMaintenance';
    }
    return 'unavailable';
  }

  return 'available';
};

const getAvailabilityStatus = (asset: Asset): 'Available' | 'Unavailable' | 'Under Maintenance' => {
  const bucket = getAvailabilityBucket(asset);
  if (bucket === 'underMaintenance') {
    return 'Under Maintenance';
  }
  if (bucket === 'unavailable') {
    return 'Unavailable';
  }
  return 'Available';
};

const parseJson = async <T>(response: Response): Promise<T | null> => {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
};

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetsTypes, setAssetTypes] = useState<AssetType[]>([]);
  const [assetRooms, setAssetRooms] = useState<AssetRoom[]>([]);
  const [assetFloors, setAssetFloors] = useState<AssetFloor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = useCallback(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('mira_token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }, []);

  const fetchAssets = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/assets`, {
        headers: getHeaders(),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch assets');
      }

      setAssets(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      console.error('Failed to fetch assets:', err);
      setError(getErrorMessage(err, 'Failed to load assets'));
    } finally {
      setIsLoading(false);
    }
  }, [getHeaders]);

  const fetchAssetTypes = useCallback(async () => {
    try {
      const response = await fetch(`/api/assets/types`, { headers: getHeaders() });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch asset types');
      }
      setAssetTypes(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      console.error('Failed to fetch asset types:', err);
      setAssetTypes([]);
    }
  }, [getHeaders]);

  const fetchRoomsAndFloors = useCallback(async () => {
    try {
      const [rRes, fRes] = await Promise.all([
        fetch(`/api/assets/rooms`, { headers: getHeaders() }),
        fetch(`/api/assets/floors`, { headers: getHeaders() }),
      ]);
      const rData = await rRes.json();
      const fData = await fRes.json();

      if (!rRes.ok || !fRes.ok) {
        throw new Error('Failed to fetch rooms/floors');
      }

      setAssetRooms(Array.isArray(rData) ? rData : []);
      setAssetFloors(Array.isArray(fData) ? fData : []);
    } catch (err: unknown) {
      console.error('Failed to fetch rooms/floors:', err);
      setAssetRooms([]);
      setAssetFloors([]);
    }
  }, [getHeaders]);

  const resolveOrCreateType = useCallback(
    async (name: string): Promise<number | null> => {
      const trimmedName = name.trim();
      if (!trimmedName) {
        return null;
      }

      const existing = assetsTypes.find(
        (t) => normalizeName(t.name) === normalizeName(trimmedName),
      );
      if (existing) {
        return existing.id;
      }

      const response = await fetch(`/api/assets/types`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name: trimmedName }),
      });
      const data = await parseJson<AssetType & { message?: string }>(response);

      if (!response.ok || !data?.id) {
        throw new Error(data?.message || 'Failed to create asset type');
      }

      setAssetTypes((prev) => {
        if (prev.some((item) => item.id === data.id)) {
          return prev;
        }
        return [...prev, data];
      });

      return data.id;
    },
    [assetsTypes, getHeaders],
  );

  const resolveOrCreateRoom = useCallback(
    async (
      name: string,
      extra?: { floorId?: number | null; x?: number; y?: number; width?: number; height?: number },
    ): Promise<number | null> => {
      const trimmedName = name.trim();
      if (!trimmedName) {
        return null;
      }

      const existing = assetRooms.find((r) => normalizeName(r.name) === normalizeName(trimmedName));
      if (existing) {
        return existing.id;
      }

      const response = await fetch(`/api/assets/rooms`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name: trimmedName, ...extra }),
      });
      const data = await parseJson<AssetRoom & { message?: string }>(response);

      if (!response.ok || !data?.id) {
        throw new Error(data?.message || 'Failed to create room');
      }

      setAssetRooms((prev) => {
        if (prev.some((item) => item.id === data.id)) {
          return prev;
        }
        return [...prev, data];
      });

      return data.id;
    },
    [assetRooms, getHeaders],
  );

  const resolveOrCreateFloor = useCallback(
    async (name: string, extra?: { level?: number }): Promise<number | null> => {
      const trimmedName = name.trim();
      if (!trimmedName) {
        return null;
      }

      const existing = assetFloors.find(
        (f) => normalizeName(f.name) === normalizeName(trimmedName),
      );
      if (existing) {
        return existing.id;
      }

      const response = await fetch(`/api/assets/floors`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name: trimmedName, ...extra }),
      });
      const data = await parseJson<AssetFloor & { message?: string }>(response);

      if (!response.ok || !data?.id) {
        throw new Error(data?.message || 'Failed to create floor');
      }

      setAssetFloors((prev) => {
        if (prev.some((item) => item.id === data.id)) {
          return prev;
        }
        return [...prev, data];
      });

      return data.id;
    },
    [assetFloors, getHeaders],
  );

  const uploadAssetImages = useCallback(async (files: File[] = []): Promise<string[]> => {
    if (!files.length) {
      return [];
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('mira_token') : null;
    const imageData = new FormData();
    files.forEach((file) => {
      imageData.append('images', file);
    });

    const response = await fetch(`/api/assets/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: imageData,
    });
    const data = await parseJson<{ imageUrls?: string[]; message?: string; error?: string }>(
      response,
    );

    if (!response.ok) {
      throw new Error(data?.message || data?.error || 'Failed to upload asset images');
    }

    return data?.imageUrls || [];
  }, []);

  const createAsset = useCallback(
    async (payload: CreateAssetPayload): Promise<Asset> => {
      const typeId = await resolveOrCreateType(payload.assetTypeName || '');
      const roomId = await resolveOrCreateRoom(payload.roomName || '', payload.roomExtra);
      const floorId = await resolveOrCreateFloor(payload.floorName || '', payload.floorExtra);
      const imageUrls = await uploadAssetImages(payload.imageFiles || []);

      const response = await fetch(`/api/assets`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          assetName: payload.assetName,
          assetType: typeId,
          serialNumber: payload.serialNumber,
          specification: payload.specification,
          room: roomId,
          floor: floorId,
          tag: payload.tag,
          currentStatus: toApiConditionStatus(payload.currentStatus || 'Good'),
          image: imageUrls,
        }),
      });

      const data = await parseJson<{ asset?: Asset; message?: string } | Asset>(response);

      if (!response.ok) {
        const message = (data && 'message' in data && data.message) || 'Failed to save asset';
        throw new Error(message);
      }

      const createdAsset = (data && 'asset' in data ? data.asset : data) as Asset | undefined;
      if (!createdAsset) {
        throw new Error('Asset was created but no asset payload was returned');
      }

      await Promise.all([fetchAssets(), fetchAssetTypes(), fetchRoomsAndFloors()]);
      return createdAsset;
    },
    [
      fetchAssetTypes,
      fetchAssets,
      fetchRoomsAndFloors,
      getHeaders,
      resolveOrCreateFloor,
      resolveOrCreateRoom,
      resolveOrCreateType,
      uploadAssetImages,
    ],
  );

  const updateAsset = useCallback(
    async (payload: UpdateAssetPayload): Promise<Asset> => {
      const typeId = payload.assetTypeName
        ? await resolveOrCreateType(payload.assetTypeName)
        : (payload.assetTypeId ?? null);
      const roomId = payload.roomName
        ? await resolveOrCreateRoom(payload.roomName, payload.roomExtra)
        : (payload.roomId ?? null);
      const floorId = payload.floorName
        ? await resolveOrCreateFloor(payload.floorName, payload.floorExtra)
        : (payload.floorId ?? null);
      const newImageUrls = await uploadAssetImages(payload.newImageFiles || []);

      const response = await fetch(`/api/assets/${payload.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          assetName: payload.assetName,
          assetType: typeId,
          serialNumber: payload.serialNumber,
          specification: payload.specification,
          room: roomId,
          floor: floorId,
          tag: payload.tag,
          currentStatus: toApiConditionStatus(payload.currentStatus),
          image: [...(payload.existingImages || []), ...newImageUrls],
        }),
      });

      const data = await parseJson<{ asset?: Asset; message?: string } | Asset>(response);

      if (!response.ok) {
        const message = (data && 'message' in data && data.message) || 'Failed to update asset';
        throw new Error(message);
      }

      const updatedAsset = (data && 'asset' in data ? data.asset : data) as Asset | undefined;
      if (!updatedAsset) {
        throw new Error('Asset was updated but no asset payload was returned');
      }

      await Promise.all([fetchAssets(), fetchAssetTypes(), fetchRoomsAndFloors()]);
      return updatedAsset;
    },
    [
      fetchAssetTypes,
      fetchAssets,
      fetchRoomsAndFloors,
      getHeaders,
      resolveOrCreateFloor,
      resolveOrCreateRoom,
      resolveOrCreateType,
      uploadAssetImages,
    ],
  );

  const deleteAsset = useCallback(
    async (id: string): Promise<void> => {
      const response = await fetch(`/api/assets/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        const data = await parseJson<{ message?: string }>(response);
        throw new Error(data?.message || 'Failed to delete asset');
      }

      await fetchAssets();
    },
    [fetchAssets, getHeaders],
  );

  const computeAutoPosition = useCallback(
    (floorId: number | null): { x: number; y: number; width: number; height: number } => {
      const COLS = 5;
      const W = 120;
      const H = 80;
      const GAP = 20;
      const roomsOnFloor = assetRooms.filter((r) => r.floorId === floorId);
      const count = roomsOnFloor.length;
      const col = count % COLS;
      const row = Math.floor(count / COLS);
      return {
        x: GAP + col * (W + GAP),
        y: GAP + row * (H + GAP),
        width: W,
        height: H,
      };
    },
    [assetRooms],
  );

  const updateRoom = useCallback(
    async (
      id: number,
      payload: {
        name?: string;
        floorId?: number | null;
        x?: number;
        y?: number;
        width?: number;
        height?: number;
      },
    ): Promise<AssetRoom> => {
      const response = await fetch(`/api/assets/rooms/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await parseJson<AssetRoom & { message?: string }>(response);
      if (!response.ok || !data?.id) {
        throw new Error(data?.message || 'Failed to update room');
      }
      await fetchRoomsAndFloors();
      return data;
    },
    [fetchRoomsAndFloors, getHeaders],
  );

  const deleteRoom = useCallback(
    async (id: number): Promise<void> => {
      const response = await fetch(`/api/assets/rooms/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!response.ok) {
        const data = await parseJson<{ message?: string }>(response);
        throw new Error(data?.message || 'Failed to delete room');
      }
      await fetchRoomsAndFloors();
    },
    [fetchRoomsAndFloors, getHeaders],
  );

  const updateFloor = useCallback(
    async (id: number, payload: { name?: string; level?: number | null }): Promise<AssetFloor> => {
      const response = await fetch(`/api/assets/floors/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await parseJson<AssetFloor & { message?: string }>(response);
      if (!response.ok || !data?.id) {
        throw new Error(data?.message || 'Failed to update floor');
      }
      await fetchRoomsAndFloors();
      return data;
    },
    [fetchRoomsAndFloors, getHeaders],
  );

  const deleteFloor = useCallback(
    async (id: number): Promise<void> => {
      const response = await fetch(`/api/assets/floors/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!response.ok) {
        const data = await parseJson<{ message?: string }>(response);
        throw new Error(data?.message || 'Failed to delete floor');
      }
      await fetchRoomsAndFloors();
    },
    [fetchRoomsAndFloors, getHeaders],
  );

  const generateNextTag = useCallback(
    (assetList?: Asset[]) => {
      const source = assetList || assets;
      let maxNum = 0;
      source.forEach((asset) => {
        if (asset.tag?.toUpperCase().startsWith('AS-')) {
          const num = parseInt(asset.tag.slice(3), 10);
          if (!Number.isNaN(num) && num > maxNum) {
            maxNum = num;
          }
        }
      });
      return `AS-${(maxNum + 1).toString().padStart(2, '0')}`;
    },
    [assets],
  );

  useEffect(() => {
    fetchAssets();
    fetchAssetTypes();
    fetchRoomsAndFloors();
  }, [fetchAssets, fetchAssetTypes, fetchRoomsAndFloors]);

  const filterOptions = useMemo(() => {
    return {
      statuses: Array.from(new Set(assets.map((a) => getAvailabilityStatus(a)))) as string[],
      assignmentStatuses: Array.from(
        new Set(assets.map((a) => getAssignmentStatus(a))),
      ) as string[],
      conditionStatuses: Array.from(new Set(assets.map((a) => getConditionStatus(a)))) as string[],
      categories:
        assetsTypes.length > 0
          ? assetsTypes.map((t) => t.name)
          : Array.from(
              new Set(assets.map((a) => a.assetTypeRel?.name).filter(Boolean) as string[]),
            ),
      rooms: Array.from(new Set(assets.map((a) => a.roomRel?.name).filter(Boolean) as string[])),
      floors: Array.from(new Set(assets.map((a) => a.floorRel?.name).filter(Boolean) as string[])),
    };
  }, [assets, assetsTypes]);

  const availabilityStats = useMemo(() => {
    return assets.reduce(
      (acc, asset) => {
        const bucket = getAvailabilityBucket(asset);
        if (bucket === 'available') {
          acc.available += 1;
        } else if (bucket === 'underMaintenance') {
          acc.underMaintenance += 1;
        } else {
          acc.unavailable += 1;
        }
        return acc;
      },
      { available: 0, unavailable: 0, underMaintenance: 0 },
    );
  }, [assets]);

  const assignmentStats = useMemo(() => {
    return assets.reduce(
      (acc, asset) => {
        const status = getAssignmentStatus(asset);
        if (status === 'Assigned') {
          acc.assigned += 1;
        } else if (status === 'Unassigned') {
          acc.unassigned += 1;
        } else {
          acc.unavailable += 1;
        }
        return acc;
      },
      { assigned: 0, unassigned: 0, unavailable: 0 },
    );
  }, [assets]);

  const availableAssets = useMemo(
    () =>
      assets.filter(
        (a) =>
          getAssignmentStatus(a) === 'Unassigned' && getConditionStatus(a) !== 'Under Maintenance',
      ),
    [assets],
  );

  const conditionStats = useMemo(() => {
    return assets.reduce(
      (acc, asset) => {
        const condition = getConditionStatus(asset);
        if (condition === 'Good') {
          acc.good += 1;
        } else if (condition === 'Under Review') {
          acc.underReview += 1;
        } else if (condition === 'Under Maintenance') {
          acc.underMaintenance += 1;
        } else {
          acc.unknown += 1;
        }

        return acc;
      },
      { good: 0, underReview: 0, underMaintenance: 0, unknown: 0 },
    );
  }, [assets]);

  return {
    assets,
    assetsTypes,
    assetRooms,
    assetFloors,
    isLoading,
    error,
    refresh: fetchAssets,
    fetchRoomsAndFloors,
    createAsset,
    updateAsset,
    deleteAsset,
    uploadAssetImages,
    resolveOrCreateType,
    resolveOrCreateRoom,
    resolveOrCreateFloor,
    computeAutoPosition,
    updateRoom,
    deleteRoom,
    updateFloor,
    deleteFloor,
    generateNextTag,
    getAvailabilityStatus,
    getAssignmentStatus,
    getConditionStatus,
    availableAssets,

    // Stats and Filters
    assigned: assignmentStats.assigned,
    unassigned: assignmentStats.unassigned,
    unavailable: assignmentStats.unavailable,
    total: assets.length,
    available: availabilityStats.available,
    underMaintenance: conditionStats.underMaintenance,
    goodCondition: conditionStats.good,
    underReviewCondition: conditionStats.underReview,
    unknownCondition: conditionStats.unknown,
    filterOptions,
  };
}
