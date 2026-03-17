'use client';

import { useState, useEffect, useCallback } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAssets } from '@/hooks/useAssets';
import type { AssetFloor, AssetRoom } from '@/types/mira';
import { Pencil, Trash2, Check, X, Plus } from 'lucide-react';
import { toast } from 'sonner';

type Tab = 'floors' | 'rooms';

export interface AddLocationModalProps {
  open: boolean;
  onClose: () => void;
  /** Called after a new floor or room is created — use to pre-select in the parent modal. */
  onSaved: (type: 'room' | 'floor', name: string, floorName?: string) => void;
  /** Called after any successful mutation so the parent can refresh its own data copy. */
  onRefresh?: () => void;
  /** Which tab to open on. Defaults to 'floors'. */
  initialTab?: Tab;
}

const getAuthHeaders = (): HeadersInit => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('mira_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export function AddLocationModal({
  open,
  onClose,
  onSaved,
  onRefresh,
  initialTab = 'floors',
}: AddLocationModalProps) {
  const {
    assetFloors,
    assetRooms,
    fetchRoomsAndFloors,
    updateFloor,
    deleteFloor,
    updateRoom,
    deleteRoom,
    computeAutoPosition,
  } = useAssets();

  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  // Sync active tab when modal opens or initialTab changes
  useEffect(() => {
    if (open) setActiveTab(initialTab);
  }, [open, initialTab]);

  // ── Floor form state ────────────────────────────────────────────────────
  const [floorName, setFloorName] = useState('');
  const [floorLevel, setFloorLevel] = useState('');

  // Floor inline-edit state
  const [editFloorId, setEditFloorId] = useState<number | null>(null);
  const [editFloorName, setEditFloorName] = useState('');
  const [editFloorLevel, setEditFloorLevel] = useState('');

  // Floor delete confirm state
  const [deletingFloorId, setDeletingFloorId] = useState<number | null>(null);

  // ── Room form state ─────────────────────────────────────────────────────
  const [roomName, setRoomName] = useState('');
  const [roomFloorId, setRoomFloorId] = useState('');

  // Room inline-edit state
  const [editRoomId, setEditRoomId] = useState<number | null>(null);
  const [editRoomName, setEditRoomName] = useState('');
  const [editRoomFloorId, setEditRoomFloorId] = useState('');

  // Room delete confirm state
  const [deletingRoomId, setDeletingRoomId] = useState<number | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  const afterMutation = useCallback(async () => {
    await fetchRoomsAndFloors();
    onRefresh?.();
  }, [fetchRoomsAndFloors, onRefresh]);

  // ── Floor CRUD ──────────────────────────────────────────────────────────
  const handleAddFloor = useCallback(async () => {
    const name = floorName.trim();
    if (!name) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/assets/floors', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name,
          level: floorLevel !== '' ? parseInt(floorLevel, 10) : null,
        }),
      });
      if (!res.ok) {
        const d = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(d?.message || 'Failed to create floor');
      }
      await afterMutation();
      setFloorName('');
      setFloorLevel('');
      toast.success(`Floor "${name}" created`);
      onSaved('floor', name);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to create floor');
    } finally {
      setIsSaving(false);
    }
  }, [floorName, floorLevel, afterMutation, onSaved]);

  const handleUpdateFloor = useCallback(async () => {
    if (editFloorId == null) return;
    const name = editFloorName.trim();
    if (!name) return;
    setIsSaving(true);
    try {
      await updateFloor(editFloorId, {
        name,
        level: editFloorLevel !== '' ? parseInt(editFloorLevel, 10) : null,
      });
      setEditFloorId(null);
      onRefresh?.();
      toast.success('Floor updated');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to update floor');
    } finally {
      setIsSaving(false);
    }
  }, [editFloorId, editFloorName, editFloorLevel, updateFloor, onRefresh]);

  const handleDeleteFloor = useCallback(
    async (id: number) => {
      setIsSaving(true);
      try {
        await deleteFloor(id);
        setDeletingFloorId(null);
        onRefresh?.();
        toast.success('Floor deleted');
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Failed to delete floor');
      } finally {
        setIsSaving(false);
      }
    },
    [deleteFloor, onRefresh],
  );

  // ── Room CRUD ───────────────────────────────────────────────────────────
  const handleAddRoom = useCallback(async () => {
    const name = roomName.trim();
    if (!name) return;
    setIsSaving(true);
    try {
      const floorIdNum = roomFloorId !== '' ? parseInt(roomFloorId, 10) : null;
      const pos = computeAutoPosition(floorIdNum);

      const res = await fetch('/api/assets/rooms', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name, floorId: floorIdNum, ...pos }),
      });
      if (!res.ok) {
        const d = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(d?.message || 'Failed to create room');
      }
      const floorName =
        roomFloorId !== ''
          ? (assetFloors.find((f) => f.id === parseInt(roomFloorId, 10))?.name ?? '')
          : '';
      await afterMutation();
      setRoomName('');
      setRoomFloorId('');
      toast.success(`Room "${name}" created`);
      onSaved('room', name, floorName);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to create room');
    } finally {
      setIsSaving(false);
    }
  }, [roomName, roomFloorId, assetFloors, computeAutoPosition, afterMutation, onSaved]);

  const handleUpdateRoom = useCallback(async () => {
    if (editRoomId == null) return;
    const name = editRoomName.trim();
    if (!name) return;
    setIsSaving(true);
    try {
      const floorIdNum = editRoomFloorId !== '' ? parseInt(editRoomFloorId, 10) : null;
      await updateRoom(editRoomId, { name, floorId: floorIdNum });
      setEditRoomId(null);
      onRefresh?.();
      toast.success('Room updated');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to update room');
    } finally {
      setIsSaving(false);
    }
  }, [editRoomId, editRoomName, editRoomFloorId, updateRoom, onRefresh]);

  const handleDeleteRoom = useCallback(
    async (id: number) => {
      setIsSaving(true);
      try {
        await deleteRoom(id);
        setDeletingRoomId(null);
        onRefresh?.();
        toast.success('Room deleted');
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Failed to delete room');
      } finally {
        setIsSaving(false);
      }
    },
    [deleteRoom, onRefresh],
  );

  const selectClass =
    'w-full h-9 rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-[#09090b] text-sm px-2 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-ring/50';

  const smallSelectClass =
    'h-7 rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-[#09090b] text-xs px-2 text-slate-700 dark:text-slate-200 focus:outline-none';

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Manage Locations"
      description="Add, edit, or delete floors and rooms used for asset placement."
      className="max-w-2xl"
    >
      {/* Tab bar */}
      <div className="flex gap-0 border-b border-slate-100 dark:border-white/10 mb-4 -mt-1">
        {(['floors', 'rooms'] as Tab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-teal-600 text-teal-700 dark:border-teal-400 dark:text-teal-300'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Floors tab ─────────────────────────────────────────────────── */}
      {activeTab === 'floors' && (
        <div className="space-y-4">
          {/* Add-new form */}
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">
                Floor name
              </label>
              <Input
                placeholder="e.g. Ground Floor"
                value={floorName}
                onChange={(e) => setFloorName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddFloor();
                }}
              />
            </div>
            <div className="w-28">
              <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">
                Level (opt.)
              </label>
              <Input
                type="number"
                placeholder="0"
                value={floorLevel}
                onChange={(e) => setFloorLevel(e.target.value)}
              />
            </div>
            <Button size="sm" onClick={handleAddFloor} disabled={isSaving || !floorName.trim()}>
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>

          {/* Floor list */}
          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
            {assetFloors.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">No floors yet.</p>
            )}
            {[...(assetFloors as AssetFloor[])]
              .sort((a, b) => a.id - b.id)
              .map((floor) => (
                <div
                  key={floor.id}
                  className="rounded-lg border border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] px-3 py-2"
                >
                  {editFloorId === floor.id ? (
                    <div className="flex gap-2 items-center">
                      <Input
                        className="flex-1 h-7 text-sm"
                        value={editFloorName}
                        onChange={(e) => setEditFloorName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUpdateFloor();
                          if (e.key === 'Escape') setEditFloorId(null);
                        }}
                        autoFocus
                      />
                      <Input
                        type="number"
                        className="w-20 h-7 text-sm"
                        placeholder="Level"
                        value={editFloorLevel}
                        onChange={(e) => setEditFloorLevel(e.target.value)}
                      />
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        onClick={handleUpdateFloor}
                        disabled={isSaving}
                      >
                        <Check className="h-3.5 w-3.5 text-teal-600" />
                      </Button>
                      <Button size="icon-xs" variant="ghost" onClick={() => setEditFloorId(null)}>
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ) : deletingFloorId === floor.id ? (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="flex-1 text-slate-600 dark:text-slate-300">
                        Delete <strong>{floor.name}</strong>?
                      </span>
                      <Button
                        size="xs"
                        variant="destructive"
                        disabled={isSaving}
                        onClick={() => handleDeleteFloor(floor.id)}
                      >
                        Delete
                      </Button>
                      <Button size="xs" variant="ghost" onClick={() => setDeletingFloorId(null)}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="flex-1 text-sm text-slate-700 dark:text-slate-200">
                        {floor.name}
                      </span>
                      {floor.level != null && (
                        <span className="text-xs text-slate-400 bg-slate-100 dark:bg-white/10 rounded px-1.5 py-0.5">
                          Level {floor.level}
                        </span>
                      )}
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        onClick={() => {
                          setEditFloorId(floor.id);
                          setEditFloorName(floor.name);
                          setEditFloorLevel(floor.level != null ? String(floor.level) : '');
                        }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        onClick={() => setDeletingFloorId(floor.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ── Rooms tab ──────────────────────────────────────────────────── */}
      {activeTab === 'rooms' && (
        <div className="space-y-4">
          {/* Add-new form */}
          <div className="space-y-2 border border-slate-100 dark:border-white/10 rounded-xl p-3 bg-slate-50/50 dark:bg-white/[0.02]">
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">
                  Room name
                </label>
                <Input
                  placeholder="e.g. Server Room"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddRoom();
                  }}
                />
              </div>
              <div className="w-44">
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">
                  Floor (optional)
                </label>
                <select
                  value={roomFloorId}
                  onChange={(e) => setRoomFloorId(e.target.value)}
                  className={selectClass}
                >
                  <option value="">— no floor —</option>
                  {(assetFloors as AssetFloor[]).map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Button size="sm" onClick={handleAddRoom} disabled={isSaving || !roomName.trim()}>
                <Plus className="h-4 w-4" /> Add Room
              </Button>
            </div>
          </div>

          {/* Room list */}
          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
            {assetRooms.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">No rooms yet.</p>
            )}
            {[...(assetRooms as AssetRoom[])]
              .sort((a, b) => a.id - b.id)
              .map((room) => {
                const floorLabel = assetFloors.find((f) => f.id === room.floorId)?.name;
                return (
                  <div
                    key={room.id}
                    className="rounded-lg border border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] px-3 py-2"
                  >
                    {editRoomId === room.id ? (
                      <div className="space-y-2">
                        <div className="flex gap-2 items-center">
                          <Input
                            className="flex-1 h-7 text-sm"
                            value={editRoomName}
                            onChange={(e) => setEditRoomName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Escape') setEditRoomId(null);
                            }}
                            autoFocus
                          />
                          <select
                            value={editRoomFloorId}
                            onChange={(e) => setEditRoomFloorId(e.target.value)}
                            className={`w-36 ${smallSelectClass}`}
                          >
                            <option value="">No floor</option>
                            {(assetFloors as AssetFloor[]).map((f) => (
                              <option key={f.id} value={f.id}>
                                {f.name}
                              </option>
                            ))}
                          </select>
                          <Button
                            size="icon-xs"
                            variant="ghost"
                            onClick={handleUpdateRoom}
                            disabled={isSaving}
                          >
                            <Check className="h-3.5 w-3.5 text-teal-600" />
                          </Button>
                          <Button
                            size="icon-xs"
                            variant="ghost"
                            onClick={() => setEditRoomId(null)}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ) : deletingRoomId === room.id ? (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="flex-1 text-slate-600 dark:text-slate-300">
                          Delete <strong>{room.name}</strong>?
                        </span>
                        <Button
                          size="xs"
                          variant="destructive"
                          disabled={isSaving}
                          onClick={() => handleDeleteRoom(room.id)}
                        >
                          Delete
                        </Button>
                        <Button size="xs" variant="ghost" onClick={() => setDeletingRoomId(null)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="flex-1 text-sm text-slate-700 dark:text-slate-200">
                          {room.name}
                        </span>
                        {floorLabel && (
                          <span className="text-xs text-slate-400 bg-slate-100 dark:bg-white/10 rounded px-1.5 py-0.5">
                            {floorLabel}
                          </span>
                        )}
                        <Button
                          size="icon-xs"
                          variant="ghost"
                          onClick={() => {
                            setEditRoomId(room.id);
                            setEditRoomName(room.name);
                            setEditRoomFloorId(room.floorId != null ? String(room.floorId) : '');
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon-xs"
                          variant="ghost"
                          onClick={() => setDeletingRoomId(room.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-red-500" />
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </Modal>
  );
}
