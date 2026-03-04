export interface Assignment {
  id: string;
  assetId: string;
  userId: string;
  date: string;
  acknowledged: boolean;
}

export async function createAssignment(data: {
  assetId: string;
  userId: string;
  date: string;
  acknowledged: boolean;
}): Promise<Assignment> {
  // Placeholder - integrate with API
  return {
    id: crypto.randomUUID(),
    assetId: data.assetId,
    userId: data.userId,
    date: data.date,
    acknowledged: data.acknowledged,
  };
}
