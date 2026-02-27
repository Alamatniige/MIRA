import { useState, useEffect } from "react";
import { fetchAssets } from "@/features/assets/assetService";
import type { Asset } from "@/types/asset.types";

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssets().then((data) => {
      setAssets(data);
      setLoading(false);
    });
  }, []);

  return { assets, loading };
}
