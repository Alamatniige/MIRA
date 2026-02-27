import { useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { StatusBadge } from '@/components/StatusBadge';
import { mockAssets } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { QrCode, Camera, Search } from 'lucide-react';

export default function QRScanner() {
  const [scanInput, setScanInput] = useState('');
  const [scannedAsset, setScannedAsset] = useState<typeof mockAssets[0] | null>(null);

  const handleScan = () => {
    const found = mockAssets.find(a => a.id.toLowerCase() === scanInput.toLowerCase() || a.serialNumber.toLowerCase() === scanInput.toLowerCase());
    setScannedAsset(found || null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">QR Code Scanner</h1>
        <p className="text-sm text-muted-foreground mt-1">Scan or enter asset ID to look up details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6" hover={false}>
          <h2 className="font-semibold mb-4">Camera Preview</h2>
          <div className="flex flex-col items-center justify-center rounded-xl bg-muted/30 border-2 border-dashed border-border/50 p-12 aspect-[4/3]">
            <Camera className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <p className="text-sm text-muted-foreground">Camera preview placeholder</p>
            <p className="text-xs text-muted-foreground mt-1">Use the input below to simulate scanning</p>
          </div>

          <div className="mt-4 flex gap-2">
            <div className="relative flex-1">
              <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Enter Asset ID or Serial Number..." value={scanInput} onChange={e => setScanInput(e.target.value)} className="pl-9" onKeyDown={e => e.key === 'Enter' && handleScan()} />
            </div>
            <Button onClick={handleScan} className="gap-2">
              <Search className="h-4 w-4" /> Scan
            </Button>
          </div>
        </GlassCard>

        <GlassCard className="p-6" hover={false}>
          <h2 className="font-semibold mb-4">Scan Result</h2>
          {scannedAsset ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">{scannedAsset.name}</h3>
                <StatusBadge status={scannedAsset.status} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Asset ID', scannedAsset.id],
                  ['Serial Number', scannedAsset.serialNumber],
                  ['Category', scannedAsset.category],
                  ['Location', scannedAsset.location],
                  ['Assigned To', scannedAsset.assignedTo || 'Unassigned'],
                  ['Warranty', scannedAsset.warrantyExpiry],
                ].map(([label, value]) => (
                  <div key={label} className="p-3 rounded-lg bg-muted/30">
                    <p className="text-[11px] text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <QrCode className="h-16 w-16 text-muted-foreground/20 mb-4" />
              <p className="text-sm">{scanInput ? 'No asset found. Try AST-001 or AST-003.' : 'Scan a QR code to view asset details'}</p>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
