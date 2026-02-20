import { GlassCard } from './GlassCard';
import { StatusBadge } from './StatusBadge';
import { Asset } from '@/types';
import { QrCode, MapPin, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface AssetCardProps {
  asset: Asset;
}

export function AssetCard({ asset }: AssetCardProps) {
  const navigate = useNavigate();

  return (
    <GlassCard className="p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-foreground text-sm">{asset.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{asset.category} · {asset.id}</p>
        </div>
        <StatusBadge status={asset.status} />
      </div>

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <MapPin className="h-3 w-3" />
        {asset.location}
      </div>

      <div className="flex items-center justify-center rounded-lg bg-muted/50 p-4">
        <QrCode className="h-12 w-12 text-muted-foreground/40" />
      </div>

      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => navigate(`/assets/${asset.id}`)}>
          View Details
        </Button>
        <Button size="sm" variant="outline" className="text-xs gap-1">
          <AlertTriangle className="h-3 w-3" />
          Report Issue
        </Button>
      </div>
    </GlassCard>
  );
}
