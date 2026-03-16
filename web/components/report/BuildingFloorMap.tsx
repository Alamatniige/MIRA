"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Stage, Layer, Rect, Line, Group, Text, Circle } from "react-konva";
import { floors } from "./floorData";
import { Room } from "./Room";
import { cn } from "@/lib/utils";
import { Layers, ZoomIn, ZoomOut, Maximize2, Move, Building2, MousePointer2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Konva from "konva";

const VIEW_HEIGHT = 450;
const TOWER_WIDTH = 180;
const PLAN_WIDTH = 500;
const GRID_SIZE = 20;

const TOWER_VIRTUAL_HEIGHT = 400;
const PLAN_VIRTUAL_HEIGHT = 300;

// Side view of the tower
const TowerElevation = ({
  selectedFloorIdx,
  onFloorSelect,
  isDarkMode
}: {
  selectedFloorIdx: number,
  onFloorSelect: (idx: number) => void,
  isDarkMode: boolean
}) => {
  const floorHeight = 50;
  const buildingWidth = 100;
  const startX = 40;
  const startY = 320; // Building grows upwards

  return (
    <Group x={startX} y={0}>
      {/* Ground / Foundation */}
      <Rect
        x={-20}
        y={startY + 20}
        width={buildingWidth + 40}
        height={4}
        fill={isDarkMode ? "#27272a" : "#e2e8f0"}
        cornerRadius={2}
      />

      {/* Antenna */}
      <Line
        points={[buildingWidth / 2, startY - (floors.length * floorHeight), buildingWidth / 2, startY - (floors.length * floorHeight) - 30]}
        stroke={isDarkMode ? "#52525b" : "#94a3b8"}
        strokeWidth={2}
      />
      <Circle
        x={buildingWidth / 2}
        y={startY - (floors.length * floorHeight) - 30}
        radius={3}
        fill="#ef4444" // red blinky light
      />

      {/* Building Face */}
      <Rect
        x={0}
        y={startY - (floors.length * floorHeight)}
        width={buildingWidth}
        height={floors.length * floorHeight + 20}
        fill={isDarkMode ? "#18181b" : "#ffffff"}
        stroke={isDarkMode ? "#27272a" : "#e2e8f0"}
        strokeWidth={1}
        cornerRadius={[4, 4, 0, 0]}
      />

      {/* Floors */}
      {[...floors].reverse().map((floor, rIdx) => {
        const idx = floors.length - 1 - rIdx;
        const isSelected = selectedFloorIdx === idx;
        const yPos = startY - ((idx + 1) * floorHeight);

        return (
          <Group
            key={floor.level}
            y={yPos}
            onClick={() => onFloorSelect(idx)}
            onMouseEnter={(e) => {
              const container = e.target.getStage()?.container();
              if (container) container.style.cursor = "pointer";
            }}
            onMouseLeave={(e) => {
              const container = e.target.getStage()?.container();
              if (container) container.style.cursor = "default";
            }}
          >
            {/* Floor Slab / Box */}
            <Rect
              width={buildingWidth}
              height={floorHeight}
              fill={isSelected ? "rgba(20, 184, 166, 0.1)" : "transparent"}
              stroke={isSelected ? "#14b8a6" : "transparent"}
              strokeWidth={isSelected ? 2 : 0}
            />

            {/* Windows */}
            {[0, 1, 2].map(winIdx => (
              <Rect
                key={winIdx}
                x={12 + winIdx * 30}
                y={10}
                width={16}
                height={20}
                cornerRadius={2}
                fill={isSelected ? "#14b8a6" : isDarkMode ? "#27272a" : "#f1f5f9"}
                opacity={isSelected ? 0.8 : 1}
                shadowColor={isSelected ? "#14b8a6" : "transparent"}
                shadowBlur={10}
              />
            ))}

            {/* Floor Label */}
            <Text
              x={buildingWidth + 10}
              y={floorHeight / 2 - 6}
              text={floor.label}
              fontSize={10}
              fontFamily="Inter, sans-serif"
              fontStyle={isSelected ? "bold" : "normal"}
              fill={isSelected ? "#14b8a6" : isDarkMode ? "#94a3b8" : "#64748b"}
            />
          </Group>
        );
      })}
    </Group>
  );
};

export function BuildingFloorMap() {
  const [currentFloorIdx, setCurrentFloorIdx] = useState(0);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: VIEW_HEIGHT });

  const containerRef = useRef<HTMLDivElement>(null);
  const planStageRef = useRef<Konva.Stage>(null);

  // Measure container
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: VIEW_HEIGHT
        });
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Detect dark mode
  useEffect(() => {
    const update = () => setIsDarkMode(document.documentElement.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const currentFloor = floors[currentFloorIdx];
  const selectedRoom = currentFloor.rooms.find(r => r.id === selectedRoomId);

  const handleZoomIn = () => setScale(p => Math.min(p + 0.2, 3));
  const handleZoomOut = () => setScale(p => Math.max(p - 0.2, 0.5));
  const handleReset = () => {
    setScale(1);
    setStagePos({ x: 0, y: 0 });
  };

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = planStageRef.current;
    if (!stage) return;

    const oldScale = scale;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stagePos.x) / oldScale,
      y: (pointer.y - stagePos.y) / oldScale,
    };

    const newScale = e.evt.deltaY < 0 ? Math.min(oldScale + 0.1, 3) : Math.max(oldScale - 0.1, 0.5);

    setScale(newScale);
    setStagePos({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      <div className="flex flex-col gap-6 rounded-[2.5rem] border border-slate-200/60 bg-white/40 p-1 dark:border-white/5 dark:bg-[#09090b]/40 backdrop-blur-3xl overflow-hidden shadow-2xl">

        {/* Main Side-by-Side Area */}
        <div className="flex flex-col lg:flex-row gap-0 items-stretch" ref={containerRef}>

          {/* Left: Tower View Elevator Side */}
          <div className="w-full lg:w-[240px] border-b lg:border-b-0 lg:border-r border-slate-200/50 dark:border-white/5 p-6 bg-linear-to-b from-transparent to-slate-50/50 dark:to-white/2">
            <div className="flex items-center gap-3 mb-8">
              <div className="rounded-xl bg-teal-500/10 p-2 dark:bg-teal-500/20">
                <Building2 className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Tower Structure</h3>
                <p className="text-[10px] text-slate-500">MIRA Headquarters</p>
              </div>
            </div>

            <div className="relative h-[360px] flex justify-center">
              <Stage width={240} height={400}>
                <Layer>
                  <TowerElevation
                    selectedFloorIdx={currentFloorIdx}
                    onFloorSelect={(idx) => {
                      setCurrentFloorIdx(idx);
                      setSelectedRoomId(null);
                      handleReset();
                    }}
                    isDarkMode={isDarkMode}
                  />
                </Layer>
              </Stage>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-teal-500/5 border border-teal-500/10 dark:bg-teal-500/10">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase">Live Connectivity</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Floor {currentFloor.level} active. Tracking {currentFloor.rooms.reduce((acc, r) => acc + (r.assetCount || 0), 0)} assets.
              </p>
            </div>
          </div>

          {/* Right: Detailed Floor Plan */}
          <div className="relative flex-1 min-h-[450px] bg-slate-50/20 dark:bg-black/10 overflow-hidden">

            {/* Floating Plan Info */}
            <div className="absolute top-6 left-8 z-10 pointer-events-none">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400 text-[10px] font-bold uppercase tracking-wider">
                    {currentFloor.label}
                  </span>
                  <span className="text-xl font-bold text-slate-900 dark:text-white">Detailed Floor Map</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <MousePointer2 className="h-3 w-3" />
                  Select a room below to view specific logistics and asset health
                </div>
              </div>
            </div>

            {/* Plan Stage */}
            <div className="h-full w-full">
              <Stage
                width={dimensions.width - (dimensions.width > 1024 ? 240 : 0)}
                height={VIEW_HEIGHT}
                ref={planStageRef}
                onWheel={handleWheel}
                scaleX={scale}
                scaleY={scale}
                x={stagePos.x + (dimensions.width > 1024 ? 80 : dimensions.width / 2 - (PLAN_WIDTH * scale) / 2)}
                y={stagePos.y + (VIEW_HEIGHT / 2 - (PLAN_VIRTUAL_HEIGHT * scale) / 2)}
                draggable
                onDragStart={(e) => {
                  const container = e.target.getStage()?.container();
                  if (container) container.style.cursor = "grabbing";
                }}
                onDragEnd={(e) => {
                  setStagePos({ x: e.target.x(), y: e.target.y() });
                  const container = e.target.getStage()?.container();
                  if (container) container.style.cursor = "grab";
                }}
                style={{ cursor: "grab" }}
              >
                <Layer>
                  {/* Grid Lines */}
                  {Array.from({ length: 40 }).map((_, i) => (
                    <React.Fragment key={i}>
                      <Line
                        points={[i * GRID_SIZE, -100, i * GRID_SIZE, 500]}
                        stroke={isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}
                        strokeWidth={1}
                      />
                      <Line
                        points={[-100, i * GRID_SIZE, 800, i * GRID_SIZE]}
                        stroke={isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}
                        strokeWidth={1}
                      />
                    </React.Fragment>
                  ))}

                  {/* Rooms */}
                  {currentFloor.rooms.map((room) => (
                    <Room
                      key={room.id}
                      {...room}
                      isSelected={selectedRoomId === room.id}
                      onClick={(id) => setSelectedRoomId(id === selectedRoomId ? null : id)}
                    />
                  ))}
                </Layer>
              </Stage>
            </div>

            {/* View Controls */}
            <div className="absolute top-6 right-8 z-10 flex flex-col gap-2">
              <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/20 shadow-xl">
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-xl" onClick={handleZoomIn}><ZoomIn className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-xl" onClick={handleZoomOut}><ZoomOut className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-xl" onClick={handleReset}><Maximize2 className="h-4 w-4" /></Button>
                <div className="w-px h-4 bg-slate-200 dark:bg-white/10 mx-1" />
                <Button
                  size="icon"
                  variant={isPanning ? "default" : "ghost"}
                  className={cn("h-8 w-8 rounded-xl", isPanning && "bg-teal-500 text-white")}
                  onClick={() => setIsPanning(!isPanning)}
                >
                  <Move className="h-4 w-4" />
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
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">{selectedRoom.label}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Room ID: <span className="font-mono">{selectedRoom.id}</span> · Floor: {currentFloor.level}
                      </p>
                    </div>
                  </div>
                  <div className="px-6 border-l border-slate-100 dark:border-white/5 flex flex-col items-end">
                    <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">Active Devices</span>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">{selectedRoom.assetCount || 0}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Legend / Footer Footer */}
        <div className="px-10 py-5 bg-slate-100/30 dark:bg-white/1 dark:border-t dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-teal-500" />
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Selected Room</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full border-2 border-slate-200 dark:border-white/10" />
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Available Zone</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Gateway Uplink</span>
            </div>
          </div>
          <p className="text-[9px] font-medium text-slate-400 tracking-wider uppercase">
            MIRA Intelligence Protocol · Real-time Spatial Telemetry
          </p>
        </div>
      </div>
    </div>
  );
}
