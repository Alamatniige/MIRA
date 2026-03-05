import { useState, useEffect, useCallback } from "react";
import type { Asset } from "@/types/mira";
import { apiClient } from "@/lib/api-client";

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient<{ data: Asset[] }>("/assets");
      setAssets(response.data || []);
    } catch (err: any) {
      console.error("Failed to fetch assets:", err);
      setError(err.message || "Failed to load assets");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  return {
    assets,
    isLoading,
    error,
    refresh: fetchAssets,
    total: assets.length,
    active: assets.filter((a) => a.status === "ACTIVE").length,
    available: assets.filter((a) => a.status === "AVAILABLE").length,
    underMaintenance: assets.filter((a) => a.status === "UNDER_MAINTENANCE")
      .length,
  };
}

