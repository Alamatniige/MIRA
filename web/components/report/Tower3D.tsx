'use client';

import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Text, Float, Merged } from '@react-three/drei';
import * as THREE from 'three';
import type { FloorData } from './floorData';

// Shared geometry for windows to boost performance
function WindowGrid({ isSelected, isDarkMode }: { isSelected: boolean; isDarkMode: boolean }) {
  const windowMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: isSelected ? '#5eead4' : isDarkMode ? '#27272a' : '#f1f5f9',
    emissive: isSelected ? '#14b8a6' : '#000000',
    emissiveIntensity: isSelected ? 2 : 0,
    roughness: 0,
    metalness: 0.8,
  }), [isSelected, isDarkMode]);

  const geometry = useMemo(() => new THREE.BoxGeometry(0.3, 0.25, 0.05), []);

  return (
    <group>
      {/* Front */}
      <mesh geometry={geometry} material={windowMaterial} position={[-0.6, 0, 1.26]} />
      <mesh geometry={geometry} material={windowMaterial} position={[0, 0, 1.26]} />
      <mesh geometry={geometry} material={windowMaterial} position={[0.6, 0, 1.26]} />
      {/* Back */}
      <mesh geometry={geometry} material={windowMaterial} position={[-0.6, 0, -1.26]} />
      <mesh geometry={geometry} material={windowMaterial} position={[0, 0, -1.26]} />
      <mesh geometry={geometry} material={windowMaterial} position={[0.6, 0, -1.26]} />
      {/* Left */}
      <mesh geometry={geometry} material={windowMaterial} position={[-1.26, 0, -0.6]} rotation={[0, Math.PI / 2, 0]} />
      <mesh geometry={geometry} material={windowMaterial} position={[-1.26, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      <mesh geometry={geometry} material={windowMaterial} position={[-1.26, 0, 0.6]} rotation={[0, Math.PI / 2, 0]} />
      {/* Right */}
      <mesh geometry={geometry} material={windowMaterial} position={[1.26, 0, -0.6]} rotation={[0, Math.PI / 2, 0]} />
      <mesh geometry={geometry} material={windowMaterial} position={[1.26, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      <mesh geometry={geometry} material={windowMaterial} position={[1.26, 0, 0.6]} rotation={[0, Math.PI / 2, 0]} />
    </group>
  );
}

function FloorMesh({ 
  floor, 
  index, 
  totalFloors, 
  isSelected, 
  onSelect, 
  isDarkMode 
}: { 
  floor: FloorData; 
  index: number; 
  totalFloors: number; 
  isSelected: boolean; 
  onSelect: () => void;
  isDarkMode: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const floorHeight = 0.5;
  const gap = 0.1;
  const yPos = (index - (totalFloors - 1) / 2) * (floorHeight + gap) + 0.5; // offset for base

  return (
    <group position={[0, yPos, 0]}>
      <Float speed={isSelected ? 3 : 1.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <group 
           onClick={(e) => { e.stopPropagation(); onSelect(); }}
           onPointerOver={() => setHovered(true)}
           onPointerOut={() => setHovered(false)}
        >
          {/* Main Floor Slab */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2.5, floorHeight, 2.5]} />
            <meshStandardMaterial
              color={isSelected ? '#14b8a6' : hovered ? (isDarkMode ? '#3f3f46' : '#f8fafc') : (isDarkMode ? '#111827' : '#ffffff')}
              transparent
              opacity={0.95}
              roughness={0.1}
              metalness={0.2}
            />
          </mesh>

          {/* Windows Detail */}
          <WindowGrid isSelected={isSelected} isDarkMode={isDarkMode} />
          
          {/* Interaction Glow */}
          {isSelected && (
            <mesh scale={[1.1, 1.1, 1.1]}>
               <boxGeometry args={[2.5, floorHeight, 2.5]} />
               <meshStandardMaterial 
                 color="#14b8a6" 
                 transparent 
                 opacity={0.1} 
                 emissive="#14b8a6" 
                 emissiveIntensity={0.5} 
               />
            </mesh>
          )}
        </group>
      </Float>
      
      {/* Floor Label */}
      <Text
        position={[2.5, 0, 0]}
        fontSize={0.22}
        color={isSelected ? '#14b8a6' : isDarkMode ? '#94a3b8' : '#64748b'}
        anchorX="left"
        fontWeight="bold"
      >
        {floor.label}
      </Text>
    </group>
  );
}

function BuildingStructure({ floors, isDarkMode }: { floors: FloorData[], isDarkMode: boolean }) {
  const totalFloors = floors.length;
  const floorHeight = 0.5;
  const gap = 0.1;
  const totalBuildingHeight = totalFloors * (floorHeight + gap);
  const baseY = -(totalBuildingHeight / 2);
  const topY = totalBuildingHeight / 2 + 0.5;

  const pillarColor = isDarkMode ? '#27272a' : '#cbd5e1';

  return (
    <group>
      {/* Base / Foundation */}
      <mesh position={[0, baseY - 0.25, 0]} receiveShadow>
        <boxGeometry args={[3.5, 0.5, 3.5]} />
        <meshStandardMaterial color={isDarkMode ? '#09090b' : '#e2e8f0'} metalness={0.5} roughness={0.2} />
      </mesh>
      <mesh position={[0, baseY - 0.6, 0]} receiveShadow>
        <boxGeometry args={[6, 0.2, 6]} />
        <meshStandardMaterial color={isDarkMode ? '#18181b' : '#f1f5f9'} />
      </mesh>

      {/* Vertical Pillars (Corners) */}
      <mesh position={[1.2, 0.5, 1.2]}>
        <boxGeometry args={[0.1, totalBuildingHeight + 1, 0.1]} />
        <meshStandardMaterial color={pillarColor} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-1.2, 0.5, 1.2]}>
        <boxGeometry args={[0.1, totalBuildingHeight + 1, 0.1]} />
        <meshStandardMaterial color={pillarColor} />
      </mesh>
      <mesh position={[1.2, 0.5, -1.2]}>
        <boxGeometry args={[0.1, totalBuildingHeight + 1, 0.1]} />
        <meshStandardMaterial color={pillarColor} />
      </mesh>
      <mesh position={[-1.2, 0.5, -1.2]}>
        <boxGeometry args={[0.1, totalBuildingHeight + 1, 0.1]} />
        <meshStandardMaterial color={pillarColor} />
      </mesh>

      {/* Roof & Antenna */}
      <group position={[0, topY, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2, 0.4, 2]} />
          <meshStandardMaterial color={isDarkMode ? '#27272a' : '#cbd5e1'} />
        </mesh>
        {/* Antenna Mast */}
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.02, 0.05, 1.2]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
        <Float speed={5} rotationIntensity={0} floatIntensity={0.5}>
          <mesh position={[0, 1.2, 0]}>
            <sphereGeometry args={[0.06]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={5} />
          </mesh>
        </Float>
      </group>

      {/* Central Core */}
      <mesh position={[0, 0.5, 0]} opacity={0.1} transparent>
         <boxGeometry args={[0.4, totalBuildingHeight + 1, 0.4]} />
         <meshStandardMaterial color={isDarkMode ? '#1e293b' : '#e2e8f0'} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

export function Tower3D({
  floors,
  selectedFloorIdx,
  onFloorSelect,
  isDarkMode,
}: {
  floors: FloorData[];
  selectedFloorIdx: number;
  onFloorSelect: (idx: number) => void;
  isDarkMode: boolean;
}) {
  return (
    <div className="w-full h-full min-h-[400px] cursor-grab active:cursor-grabbing">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [10, 8, 10], fov: 32 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={isDarkMode ? 0.3 : 0.6} />
          <pointLight position={[10, 15, 10]} intensity={1.5} castShadow />
          <spotLight 
            position={[-20, 30, 20]} 
            angle={0.15} 
            penumbra={1} 
            intensity={2} 
            castShadow 
          />
          
          <group position={[0, -0.5, 0]}>
            <BuildingStructure floors={floors} isDarkMode={isDarkMode} />
            {floors.map((floor, idx) => (
              <FloorMesh
                key={floor.level}
                floor={floor}
                index={idx}
                totalFloors={floors.length}
                isSelected={selectedFloorIdx === idx}
                onSelect={() => onFloorSelect(idx)}
                isDarkMode={isDarkMode}
              />
            ))}
          </group>

          <ContactShadows 
            position={[0, -2.5, 0]} 
            opacity={0.6} 
            scale={20} 
            blur={3} 
            far={4.5} 
          />
          
          <OrbitControls 
            enablePan={false} 
            minDistance={8} 
            maxDistance={15}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
            autoRotate={!selectedFloorIdx}
            autoRotateSpeed={0.3}
          />
          
          <Environment preset={isDarkMode ? 'night' : 'city'} />
        </Suspense>
      </Canvas>
    </div>
  );
}
