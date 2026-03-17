'use client';

import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './button';
import type { AssetRoom, AssetFloor } from '@/types/mira';

interface LocationSelectProps {
  rooms: AssetRoom[];
  floors: AssetFloor[];
  /** Currently selected room name. */
  value: string;
  onChange: (roomName: string, floorName: string) => void;
  /** Called when the `+` button is clicked. */
  onAddNew: () => void;
  placeholder?: string;
  className?: string;
}

export function LocationSelect({
  rooms,
  floors,
  value,
  onChange,
  onAddNew,
  placeholder = 'Search location...',
  className,
}: LocationSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const getFloorName = (room: AssetRoom) =>
    room.floorId ? (floors.find((f) => f.id === room.floorId)?.name ?? '') : '';

  const sorted = [...rooms].sort((a, b) => a.id - b.id);

  const filtered = sorted.filter((r) => {
    const q = query.toLowerCase();
    return r.name.toLowerCase().includes(q) || getFloorName(r).toLowerCase().includes(q);
  });

  const handleSelect = (room: AssetRoom) => {
    onChange(room.name, getFloorName(room));
    setOpen(false);
    setQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('', '');
    setQuery('');
    setOpen(false);
  };

  const inputClass = [
    'h-8 w-full rounded-lg border border-slate-200 dark:border-teal-800/30',
    'bg-white dark:bg-[#09090b] px-3 text-[12px] text-slate-700 dark:text-slate-200',
    'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary',
    'dark:focus:border-teal-500 transition-colors',
    value && !open ? 'pr-7' : 'pr-3',
    className ?? '',
  ].join(' ');

  return (
    <div ref={containerRef} className="relative flex gap-1.5">
      <div className="relative flex-1">
        <input
          className={inputClass}
          placeholder={value && !open ? value : placeholder}
          value={open ? query : value}
          onFocus={() => {
            setOpen(true);
            setQuery('');
          }}
          onChange={(e) => setQuery(e.target.value)}
        />

        {value && !open && (
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            onClick={handleClear}
            tabIndex={-1}
          >
            <X className="h-3 w-3" />
          </button>
        )}

        {open && (
          <div className="absolute z-50 left-0 right-0 top-full mt-1 max-h-48 overflow-y-auto rounded-lg border border-slate-200 dark:border-teal-800/30 bg-white dark:bg-[#09090b] shadow-lg">
            {filtered.length === 0 ? (
              <p className="px-3 py-2 text-[11px] text-slate-400">No locations found.</p>
            ) : (
              filtered.map((room) => {
                const floorName = getFloorName(room);
                return (
                  <button
                    key={room.id}
                    type="button"
                    className="flex w-full items-center justify-between px-3 py-1.5 text-[12px] hover:bg-slate-50 dark:hover:bg-white/5 text-left"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(room);
                    }}
                  >
                    <span className="text-slate-700 dark:text-slate-200">{room.name}</span>
                    {floorName && (
                      <span className="ml-3 shrink-0 text-[10px] text-slate-400">{floorName}</span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      <Button
        type="button"
        size="icon-xs"
        variant="outline"
        title="Manage locations"
        onClick={onAddNew}
      >
        +
      </Button>
    </div>
  );
}
