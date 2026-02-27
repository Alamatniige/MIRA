export interface UtilizationData {
  label: string;
  value: number;
  max: number;
}

export interface InventorySummaryRow {
  category: string;
  total: number;
  active: number;
  maintenance: number;
  disposed: number;
}
