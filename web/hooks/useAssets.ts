import { useState, useEffect, useCallback, useMemo } from "react";
import type { Asset, AssetType } from "@/types/mira";

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetsTypes, setAssetTypes] = useState<AssetType[]>([]);
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
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/assets/types`, {
        headers: getHeaders(),
      });
      const data = await response.json();
      setAssetTypes(data || []);

    } catch (err: any) {
      console.error("Failed to fetch asset types:", err);
      setError(err.message || "Failed to load asset types");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
    fetchAssetTypes();
  }, [fetchAssets, fetchAssetTypes]);

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
    isLoading,
    error,
    refresh: fetchAssets,
    total: assets.length,
    active: assets.filter((a) => a.currentStatus === "ACTIVE").length,
    available: assets.filter((a) => a.currentStatus === "AVAILABLE").length,
    underMaintenance: assets.filter((a) => a.currentStatus === "UNDER_MAINTENANCE").length,
    filterOptions,
  };
}

