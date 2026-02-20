import type { AssetStatus } from "@/types/asset.types";

export const statusColors: Record<AssetStatus, string> = {
  active: "var(--status-active)",
  maintenance: "var(--status-maintenance)",
  issue: "var(--status-issue)",
  disposed: "var(--status-disposed)",
};

export function getStatusColor(status: AssetStatus): string {
  return statusColors[status];
}
