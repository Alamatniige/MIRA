import { GlassCard } from '@/components/GlassCard';
import { StatusBadge } from '@/components/StatusBadge';
import { mockAssets, mockAssignments } from '@/lib/mock-data';
import { useRole } from '@/contexts/RoleContext';
import { Box, CheckCircle, Wrench, Trash2, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const stats = [
  { label: 'Total Assets', value: 12, icon: Box, color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Active', value: 8, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Under Maintenance', value: 2, icon: Wrench, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Disposed', value: 1, icon: Trash2, color: 'text-red-600', bg: 'bg-red-50' },
];

const pieData = [
  { name: 'Active', value: 8, color: 'hsl(152, 69%, 41%)' },
  { name: 'Maintenance', value: 2, color: 'hsl(38, 92%, 50%)' },
  { name: 'Disposed', value: 1, color: 'hsl(0, 84%, 60%)' },
  { name: 'Unassigned', value: 1, color: 'hsl(215, 16%, 75%)' },
];

export default function Dashboard() {
  const { role } = useRole();
  const recentAssignments = mockAssignments.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {role === 'IT Department' ? 'IT Asset Management Overview' : 'Welcome back, Sarah'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <GlassCard key={stat.label} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span>+2.5% from last month</span>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 p-6" hover={false}>
          <h2 className="font-semibold text-foreground mb-4">Recent Assignments</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentAssignments.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium text-sm">{a.assetName}</TableCell>
                  <TableCell className="text-sm">{a.assignedTo}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{a.department}</TableCell>
                  <TableCell>
                    <StatusBadge status={a.status === 'Active' ? 'Active' : a.status === 'Returned' ? 'Disposed' : 'Maintenance'} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </GlassCard>

        <GlassCard className="p-6" hover={false}>
          <h2 className="font-semibold text-foreground mb-4">Asset Status</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4} strokeWidth={0}>
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {pieData.map((item) => (
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
    </div>
  );
}
