import { useState, useEffect, useCallback, useMemo } from "react";
import type { Asset, AssetType, AssetRoom, AssetFloor } from "@/types/mira";

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetsTypes, setAssetTypes] = useState<AssetType[]>([]);
  const [assetRooms, setAssetRooms] = useState<AssetRoom[]>([]);
  const [assetFloors, setAssetFloors] = useState<AssetFloor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = useCallback(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("mira_token") : null;
    return {
      "Content-Type": "application/json",
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
      setAssets(data || []);

    } catch (err: any) {
      console.error("Failed to fetch assets:", err);
      setError(err.message || "Failed to load assets");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAssetTypes = useCallback(async () => {
    try {
      const response = await fetch(`/api/assets/types`, { headers: getHeaders() });
      setAssetTypes((await response.json()) || []);
    } catch (err: any) {
      console.error("Failed to fetch asset types:", err);
    }
  }, [getHeaders]);

  const fetchRoomsAndFloors = useCallback(async () => {
    try {
      const [rRes, fRes] = await Promise.all([
        fetch(`/api/assets/rooms`, { headers: getHeaders() }),
        fetch(`/api/assets/floors`, { headers: getHeaders() })
      ]);
      setAssetRooms((await rRes.json()) || []);
      setAssetFloors((await fRes.json()) || []);
    } catch (err: any) {
      console.error("Failed to fetch rooms/floors:", err);
    }
  }, [getHeaders]);

  useEffect(() => {
    fetchAssets();
    fetchAssetTypes();
    fetchRoomsAndFloors();
  }, [fetchAssets, fetchAssetTypes, fetchRoomsAndFloors]);

  const filterOptions = useMemo(() => {
    return {
      statuses: Array.from(new Set(assets.map((a) => a.currentStatus).filter(Boolean))),
      categories: assetsTypes.length > 0
        ? assetsTypes.map((t) => t.name)
        : Array.from(new Set(assets.map((a) => a.assetTypeRel?.name).filter(Boolean) as string[])),
      rooms: Array.from(new Set(assets.map((a) => a.roomRel?.name).filter(Boolean) as string[])),
      floors: Array.from(new Set(assets.map((a) => a.floorRel?.name).filter(Boolean) as string[])),
    };
  }, [assets, assetsTypes]);

  return {
    assets,
    assetsTypes,
    assetRooms,
    assetFloors,
    isLoading,
    error,
    refresh: fetchAssets,
    total: assets.length,
    active: assets.filter((a) => a.currentStatus === "Active").length,
    available: assets.filter((a) => a.currentStatus === "Available").length,
    underMaintenance: assets.filter((a) => a.currentStatus === "Under Maintenance").length,
    filterOptions,
  };
}

