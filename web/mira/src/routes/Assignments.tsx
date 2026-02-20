import { useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { mockAssignments, mockUsers, mockAssets } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowLeftRight } from 'lucide-react';

export default function Assignments() {
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const perPage = 6;
  const totalPages = Math.ceil(mockAssignments.length / perPage);
  const paged = mockAssignments.slice((page - 1) * perPage, page * perPage);

  const statusColors: Record<string, string> = {
    Active: 'bg-emerald-100 text-emerald-700',
    Returned: 'bg-muted text-muted-foreground',
    Pending: 'bg-amber-100 text-amber-700',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Assignments</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage asset assignments</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="gap-2">
          <ArrowLeftRight className="h-4 w-4" /> Reassign
        </Button>
      </div>

      <GlassCard className="p-6" hover={false}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Date Assigned</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map(a => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.assetName}</TableCell>
                <TableCell>{a.assignedTo}</TableCell>
                <TableCell className="text-muted-foreground">{a.department}</TableCell>
                <TableCell className="text-muted-foreground">{a.dateAssigned}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[a.status]}`}>
                    {a.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground">Page {page} of {totalPages}</p>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <Button key={i} size="sm" variant={page === i + 1 ? 'default' : 'outline'} onClick={() => setPage(i + 1)} className="h-8 w-8 p-0">
                  {i + 1}
                </Button>
              ))}
            </div>
          </div>
        )}
      </GlassCard>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Reassign Asset</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label>Asset</Label>
              <Select><SelectTrigger><SelectValue placeholder="Select asset" /></SelectTrigger><SelectContent>{mockAssets.filter(a => a.status === 'Active').map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="space-y-2">
              <Label>Assign To</Label>
              <Select><SelectTrigger><SelectValue placeholder="Select user" /></SelectTrigger><SelectContent>{mockUsers.map(u => <SelectItem key={u.id} value={u.id}>{u.name} ({u.department})</SelectItem>)}</SelectContent></Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setModalOpen(false)}>Reassign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
