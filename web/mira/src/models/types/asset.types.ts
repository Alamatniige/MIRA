export type AssetStatus = "active" | "maintenance" | "issue" | "disposed";

export interface Asset {
  id: string;
  name: string;
  category: string;
  location: string;
  assignedTo: string;
  status: AssetStatus;
}
