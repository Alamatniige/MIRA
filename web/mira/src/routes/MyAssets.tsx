import { AssetCard } from '@/components/AssetCard';
import { mockAssets } from '@/lib/mock-data';

export default function MyAssets() {
  const myAssets = mockAssets.filter(a => a.assignedToId === 'USR-001');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Assets</h1>
        <p className="text-sm text-muted-foreground mt-1">Assets assigned to you</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {myAssets.map(asset => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>

      {myAssets.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No assets currently assigned to you.
        </div>
      )}
    </div>
  );
}
