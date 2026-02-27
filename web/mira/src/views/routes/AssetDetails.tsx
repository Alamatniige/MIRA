import { useParams, useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/GlassCard';
import { StatusBadge } from '@/components/StatusBadge';
import { mockAssets, mockAssignmentHistory, mockConditionHistory } from '@/lib/mock-data';
import { ArrowLeft, MapPin, Calendar, Shield, Cpu, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AssetDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const asset = mockAssets.find(a => a.id === id);

  if (!asset) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Asset not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{asset.name}</h1>
          <p className="text-sm text-muted-foreground">{asset.id} · {asset.category}</p>
        </div>
        <StatusBadge status={asset.status} className="ml-auto" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 p-6" hover={false}>
          <h2 className="font-semibold mb-4">Asset Information</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Hash, label: 'Serial Number', value: asset.serialNumber },
              { icon: Cpu, label: 'Specifications', value: asset.specifications },
              { icon: MapPin, label: 'Location', value: asset.location },
              { icon: Calendar, label: 'Purchase Date', value: asset.purchaseDate },
              { icon: Shield, label: 'Warranty Expiry', value: asset.warrantyExpiry },
              { icon: Calendar, label: 'Assigned To', value: asset.assignedTo || 'Unassigned' },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <item.icon className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="text-[11px] text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard className="p-6" hover={false}>
            <h2 className="font-semibold mb-4">Assignment History</h2>
            <div className="relative pl-4 border-l-2 border-primary/20 space-y-4">
              {mockAssignmentHistory.map((entry, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-primary bg-background" />
                  <p className="text-xs text-muted-foreground">{entry.date}</p>
                  <p className="text-sm font-medium">{entry.action}</p>
                  <p className="text-xs text-muted-foreground">{entry.assignedTo}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6" hover={false}>
            <h2 className="font-semibold mb-4">Condition History</h2>
            <div className="space-y-3">
              {mockConditionHistory.map((entry, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">{entry.condition}</span>
                    <span className="text-[10px] text-muted-foreground">{entry.date}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{entry.notes}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
