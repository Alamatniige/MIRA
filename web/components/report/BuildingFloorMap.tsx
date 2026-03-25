'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { FloorData } from './floorData';
import { Room } from './Room';
import dynamic from 'next/dynamic';
import { useFloorMap } from '@/hooks/useReports';
import { cn } from '@/lib/utils';
import { Layers, ZoomIn, ZoomOut, Maximize2, Move, Building2, MousePointer2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Konva from 'konva';

const VIEW_HEIGHT = 450;
const TOWER_WIDTH = 180;

const TOWER_VIRTUAL_HEIGHT = 400;


const Tower3D = dynamic(() => import('./Tower3D').then(m => m.Tower3D), {
  ssr: false,
  loading: () => <div className="w-full h-[400px] flex items-center justify-center bg-slate-50/5 dark:bg-white/5 animate-pulse rounded-3xl text-xs text-slate-400">Initializing 3D Environment...</div>
});

const FloorPlan3D = dynamic(() => import('./FloorPlan3D').then(m => m.FloorPlan3D), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-slate-50/5 dark:bg-white/5 animate-pulse rounded-3xl text-xs text-slate-400">Loading 3D Floor Plan...</div>
});

export function BuildingFloorMap() {
  const { floors, isLoading: floorsLoading } = useFloorMap();
  const [currentFloorIdx, setCurrentFloorIdx] = useState(0);
  const [isFloorSelected, setIsFloorSelected] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: VIEW_HEIGHT });
  const [sceneKey, setSceneKey] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleReset = useCallback(() => {
    setSceneKey(prev => prev + 1);
    setSelectedRoomId(null);
  }, []);

  // Measure container
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: VIEW_HEIGHT,
        });
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Detect dark mode
  useEffect(() => {
    const update = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const currentFloor = floors[currentFloorIdx];
  const selectedRoom = currentFloor?.rooms.find((r) => r.id === selectedRoomId);

  if (floorsLoading) {
    return (
      <div className="flex items-center justify-center border border-slate-200/60 bg-white/40 dark:border-white/5 dark:bg-[#09090b]/40 h-[500px]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
          <p className="text-xs text-slate-400">Loading floor map…</p>
        </div>
      </div>
    );
  }

  if (floors.length === 0) {
    return (
      <div className="flex items-center justify-center border border-slate-200/60 bg-white/40 dark:border-white/5 dark:bg-[#09090b]/40 h-[500px]">
        <p className="text-sm text-slate-400">
          No floors configured yet. Add floors and rooms from the Asset page.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      <div className="flex flex-col">
        {/* Main Side-by-Side Area */}
        <div className="flex flex-col lg:flex-row gap-0 items-stretch transition-all duration-1000 ease-in-out" ref={containerRef}>
          {/* Left: Tower View Elevator Side */}
          <div className={cn(
            "transition-all duration-1000 ease-in-out border-slate-200/50 dark:border-white/5 bg-linear-to-b from-transparent to-slate-50/50 dark:to-white/2 overflow-hidden",
            isFloorSelected ? "w-full lg:w-[240px] border-b lg:border-b-0 lg:border-r p-6" : "w-full flex-grow flex flex-col items-center justify-center p-12"
          )}>
            <div className={cn(
              "relative transition-all duration-1000 flex justify-center items-center overflow-hidden",
              isFloorSelected ? "h-[360px] w-full" : "h-[600px] w-full max-w-[800px]"
            )}>
              <Tower3D
                floors={floors}
                selectedFloorIdx={currentFloorIdx}
                onFloorSelect={(idx) => {
                  setCurrentFloorIdx(idx);
                  setIsFloorSelected(true);
                  setSelectedRoomId(null);
                }}
                isDarkMode={isDarkMode}
              />

              {isFloorSelected && (
                <div className="absolute top-4 right-4 z-10 animate-in fade-in slide-in-from-top-2 duration-500">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="rounded-full h-8 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 bg-white/50 dark:bg-black/40 backdrop-blur-md border border-white/20 dark:border-white/5 shadow-xl hover:bg-teal-500 hover:text-white transition-all group"
                    onClick={() => setIsFloorSelected(false)}
                  >
                    <Maximize2 className="h-3 w-3 mr-1.5 group-hover:scale-110 transition-transform" />
                    Center View
                  </Button>
                </div>
              )}

              {!isFloorSelected && (
                <div className="absolute bottom-10 left-0 right-0 flex justify-center pointer-events-none animate-bounce">
                  <div className="px-6 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 backdrop-blur-md">
                    <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">
                      Select a floor to begin
                    </span>
                  </div>
                </div>
              )}
            </div>

            {isFloorSelected && (
              <div className="mt-6 p-4 rounded-2xl bg-teal-500/5 border border-teal-500/10 dark:bg-teal-500/10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">
                    Live Telemetry
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Floor {currentFloor?.level} active. Tracking{' '}
                  {currentFloor?.rooms.reduce((acc, r) => acc + (r.assetCount || 0), 0) ?? 0} assets.
                </p>
              </div>
            )}
          </div>

          {/* Right: Detailed Floor Plan */}
          {isFloorSelected && (
            <div className="relative flex-1 min-h-[450px] bg-slate-50/20 dark:bg-black/10 overflow-hidden animate-in fade-in slide-in-from-right-10 duration-1000">
              {/* Floating Plan Info */}
              <div className="absolute top-6 left-8 z-10 pointer-events-none">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400 text-[10px] font-bold uppercase tracking-wider">
                      {currentFloor?.label}
                    </span>

                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <MousePointer2 className="h-3 w-3" />
                    Select a room below to view specific logistics and asset health
                  </div>
                </div>
              </div>

              {/* Plan Stage - Now in 3D */}
              <div className="h-full w-full">
                <FloorPlan3D
                  key={`${currentFloorIdx}-${sceneKey}`}
                  rooms={currentFloor?.rooms ?? []}
                  selectedRoomId={selectedRoomId}
                  onRoomSelect={(id) => setSelectedRoomId(id)}
                  isDarkMode={isDarkMode}
                  width={dimensions.width - (dimensions.width > 1024 ? 240 : 0)}
                  height={VIEW_HEIGHT}
                />
              </div>

              {/* View Controls - Simplified for 3D (OrbitControls handle most) */}
              <div className="absolute top-6 right-8 z-10 flex flex-col gap-2">
                <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/20 shadow-xl">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-xl"
                    onClick={handleReset}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Selection Overlay */}
              {selectedRoom && (
                <div className="absolute bottom-10 left-10 right-10 z-10 animate-in slide-in-from-bottom-5 fade-in duration-500 pointer-events-none">
                  <div className="p-5 rounded-[2rem] bg-white/90 dark:bg-[#09090b]/90 border border-teal-500/20 backdrop-blur-2xl shadow-2xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-teal-500/10 flex items-center justify-center">
                        <Layers className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                          {selectedRoom.label}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Room ID: <span className="font-mono">{selectedRoom.id}</span> · Floor:{' '}
                          {currentFloor.level}
                        </p>
                      </div>
                    </div>
                    <div className="px-6 border-l border-slate-100 dark:border-white/5 flex flex-col items-end">
                      <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">
                        Active Devices
                      </span>
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">
                        {selectedRoom.assetCount || 0}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>


      </div>
    </div>
  );
}
