'use client';

import React, { useState, useMemo } from 'react';
import { Text, Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { MousePointer2, Layers } from 'lucide-react';

interface Room3DProps {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
  assetCount?: number;
  onClick: (id: string) => void;
  isDarkMode: boolean;
}

export function Room3D({
  id,
  label,
  x,
  y,
  width,
  height,
  isSelected,
  assetCount = 0,
  onClick,
  isDarkMode
}: Room3DProps) {
  const [hovered, setHovered] = useState(false);
  
  // Convert 2D coordinates to 3D. 
  // Konva (0,0) is top-left. R3F (0,0) is center.
  // We'll handle overall centering in FloorPlan3D, but here we just place based on x,y.
  // In 3D, we'll use X and Z for the floor plane, and Y for height.
  const roomWidth = width / 50;  // Scale down for 3D units
  const roomHeight = height / 50;
  const roomX = x / 50 + roomWidth / 2;
  const roomZ = y / 50 + roomHeight / 2;

  const active = isSelected || hovered;

  const roomMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: isSelected ? '#14b8a6' : hovered ? (isDarkMode ? '#3f3f46' : '#f8fafc') : (isDarkMode ? '#1e293b' : '#ffffff'),
    transparent: true,
    opacity: isSelected ? 0.3 : hovered ? 0.15 : 0.05,
    roughness: 0.1,
    metalness: 0.2,
    emissive: isSelected ? '#14b8a6' : '#000000',
    emissiveIntensity: isSelected ? 0.5 : 0,
  }), [isSelected, hovered, isDarkMode]);

  const borderMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: isSelected ? '#5eead4' : hovered ? '#94a3b8' : isDarkMode ? '#334155' : '#e2e8f0',
    emissive: isSelected ? '#5eead4' : '#000000',
    emissiveIntensity: isSelected ? 1 : 0,
  }), [isSelected, hovered, isDarkMode]);

  return (
    <group 
      position={[roomX, 0, roomZ]} 
      onClick={(e) => { e.stopPropagation(); onClick(id); }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Floor Slab */}
      <mesh receiveShadow position={[0, -0.05, 0]}>
        <boxGeometry args={[roomWidth - 0.05, 0.1, roomHeight - 0.05]} />
        <primitive object={roomMaterial} />
      </mesh>

      {/* Outlined Border (Simulated with thin bars) */}
      <mesh position={[0, -0.05, roomHeight / 2]}>
        <boxGeometry args={[roomWidth, 0.11, 0.02]} />
        <primitive object={borderMaterial} />
      </mesh>
      <mesh position={[0, -0.05, -roomHeight / 2]}>
        <boxGeometry args={[roomWidth, 0.11, 0.02]} />
        <primitive object={borderMaterial} />
      </mesh>
      <mesh position={[roomWidth / 2, -0.05, 0]}>
        <boxGeometry args={[0.02, 0.11, roomHeight]} />
        <primitive object={borderMaterial} />
      </mesh>
      <mesh position={[-roomWidth / 2, -0.05, 0]}>
        <boxGeometry args={[0.02, 0.11, roomHeight]} />
        <primitive object={borderMaterial} />
      </mesh>

      {/* Label - Top down view labels */}
      <Text
        position={[0, 0.1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.15}
        color={isSelected ? '#14b8a6' : isDarkMode ? '#94a3b8' : '#64748b'}
        maxWidth={roomWidth * 0.8}
        textAlign="center"
        fontWeight="bold"
      >
        {label}
      </Text>

      {/* Room ID Tag */}
      <Text
        position={[-roomWidth / 2 + 0.1, 0.06, -roomHeight / 2 + 0.1]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.08}
        color={isDarkMode ? '#475569' : '#cbd5e1'}
        anchorX="left"
      >
        #{id}
      </Text>

      {/* Asset Markers */}
      {assetCount > 0 && (
        <group position={[roomWidth / 2 - 0.2, 0.1, roomHeight / 2 - 0.2]}>
          <Float speed={5} rotationIntensity={0} floatIntensity={0.5}>
             <mesh position={[0, 0.1, 0]}>
                <sphereGeometry args={[0.06]} />
                <meshStandardMaterial 
                  color={isSelected ? '#14b8a6' : '#94a3b8'} 
                  emissive={isSelected ? '#14b8a6' : '#000000'}
                  emissiveIntensity={isSelected ? 2 : 0}
                />
             </mesh>
          </Float>
          <Text
            position={[0, 0.3, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.1}
            color="white"
            fontWeight="bold"
          >
            {assetCount}
          </Text>
        </group>
      )}

      {/* Selection Glow */}
      {isSelected && (
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[roomWidth + 0.2, 0.01, roomHeight + 0.2]} />
          <meshStandardMaterial 
            color="#14b8a6" 
            transparent 
            opacity={0.1} 
            emissive="#14b8a6" 
            emissiveIntensity={2} 
          />
        </mesh>
      )}
    </group>
  );
}
