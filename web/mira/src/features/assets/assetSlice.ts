// Asset state slice - placeholder for future state management
import type { Asset } from "@/types/asset.types";

export interface AssetState {
  items: Asset[];
  loading: boolean;
}

export const initialAssetState: AssetState = {
  items: [],
  loading: false,
};
