'use client';

import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Stars, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Room3D } from './Room3D';
import type { RoomData } from './floorData';

interface FloorPlan3DProps {
  rooms: RoomData[];
  selectedRoomId: string | null;
  onRoomSelect: (id: string | null) => void;
  isDarkMode: boolean;
  width: number;
  height: number;
}

export function FloorPlan3D({
  rooms,
  selectedRoomId,
  onRoomSelect,
  isDarkMode,
  width,
  height
}: FloorPlan3DProps) {
  // Calculate bounding box for centering
  const bounds = useMemo(() => {
    if (rooms.length === 0) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    rooms.forEach(r => {
      minX = Math.min(minX, r.x);
      maxX = Math.max(maxX, r.x + r.width);
      minY = Math.min(minY, r.y);
      maxY = Math.max(maxY, r.y + r.height);
    });
    return { minX, maxX, minY, maxY };
  }, [rooms]);

  const centerX = (bounds.minX + bounds.maxX) / 2 / 50;
  const centerZ = (bounds.minY + bounds.maxY) / 2 / 50;

  return (
    <div className="w-full h-full min-h-[450px] bg-slate-900/5 dark:bg-black/20 cursor-grab active:cursor-grabbing">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 15, 12]} fov={35} />
        <Suspense fallback={null}>
          <ambientLight intensity={isDarkMode ? 0.3 : 0.6} />
          <pointLight position={[10, 20, 10]} intensity={1} castShadow />
          <spotLight 
            position={[-15, 25, 15]} 
            angle={0.2} 
            penumbra={1} 
            intensity={1.5} 
            castShadow 
          />

          <group position={[-centerX, 0, -centerZ]}>
            {/* Grid Helper for technical look */}
            <gridHelper 
              args={[40, 40, isDarkMode ? '#1e293b' : '#e2e8f0', isDarkMode ? '#0f172a' : '#f1f5f9']} 
              position={[centerX, -0.1, centerZ]} 
            />

            {/* Base Floor Plate */}
            <mesh 
              rotation={[-Math.PI / 2, 0, 0]} 
              position={[centerX, -0.15, centerZ]}
              receiveShadow
            >
              <planeGeometry args={[40, 40]} />
              <meshStandardMaterial 
                color={isDarkMode ? '#020617' : '#ffffff'} 
                transparent 
                opacity={0.8}
                roughness={0.8}
              />
            </mesh>

            {/* Rooms */}
            {rooms.map((room) => (
              <Room3D
                key={room.id}
                {...room}
                isSelected={selectedRoomId === room.id}
                onClick={(id) => onRoomSelect(id === selectedRoomId ? null : id)}
                isDarkMode={isDarkMode}
              />
            ))}
          </group>

          <ContactShadows 
            position={[0, -0.2, 0]} 
            opacity={0.4} 
            scale={30} 
            blur={2.4} 
            far={10} 
          />

          <OrbitControls 
            makeDefault 
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 2.2}
            minDistance={5}
            maxDistance={25}
          />
          
          <Environment preset={isDarkMode ? 'night' : 'city'} />
          {isDarkMode && <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />}
        </Suspense>
      </Canvas>
    </div>
  );
}
