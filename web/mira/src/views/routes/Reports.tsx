import { GlassCard } from '@/components/GlassCard';
import { mockAssets } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/StatusBadge';
import { Download, BarChart3 } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const categoryData = [
  { name: 'Laptop', count: 4 },
  { name: 'Monitor', count: 2 },
  { name: 'Desktop', count: 1 },
  { name: 'Printer', count: 1 },
  { name: 'Phone', count: 1 },
  { name: 'Tablet', count: 1 },
  { name: 'Peripheral', count: 1 },
  { name: 'UPS', count: 1 },
];

const utilizationData = [
  { name: 'Assigned', value: 7, color: 'hsl(217, 91%, 60%)' },
  { name: 'Unassigned', value: 3, color: 'hsl(215, 16%, 75%)' },
  { name: 'Maintenance', value: 2, color: 'hsl(38, 92%, 50%)' },
];

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Asset inventory and utilization reports</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" /> Download Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6" hover={false}>
          <h2 className="font-semibold mb-4">Assets by Category</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(217, 91%, 60%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-6" hover={false}>
          <h2 className="font-semibold mb-4">Asset Utilization</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={utilizationData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4} strokeWidth={0}>
                {utilizationData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {utilizationData.map(item => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-6" hover={false}>
        <h2 className="font-semibold mb-4">Inventory Overview</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Purchase Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAssets.map(asset => (
              <TableRow key={asset.id}>
                <TableCell className="font-mono text-xs">{asset.id}</TableCell>
                <TableCell className="font-medium">{asset.name}</TableCell>
                <TableCell className="text-muted-foreground">{asset.category}</TableCell>
                <TableCell><StatusBadge status={asset.status} /></TableCell>
                <TableCell>{asset.assignedTo || <span className="text-muted-foreground italic">—</span>}</TableCell>
                <TableCell className="text-muted-foreground">{asset.purchaseDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </GlassCard>
    </div>
  );
}
