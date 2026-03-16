"use client";

import React, { useState } from "react";
import { Group, Rect, Text, Circle } from "react-konva";

interface RoomProps {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
  assetCount?: number;
  onClick: (id: string) => void;
}

export const Room: React.FC<RoomProps> = ({
  id,
  label,
  x,
  y,
  width,
  height,
  isSelected,
  assetCount = 0,
  onClick,
}) => {
  const [hovered, setHovered] = useState(false);

  const active = isSelected || hovered;

  // Dark mode vs Light mode tokens (handled by props or derived from theme globally)
  // For simplicity, we'll use sleek modern colors that work in both or adapt subtly
  const fillColor = isSelected
    ? "rgba(20, 184, 166, 0.1)" // teal-500 @ 10%
    : hovered
    ? "rgba(248, 250, 252, 0.05)" // slate-50 @ 5%
    : "transparent";

  const strokeColor = isSelected
    ? "#14b8a6" // teal-500
    : hovered
    ? "#5eead4" // teal-300
    : "rgba(148, 163, 184, 0.2)"; // slate-400 @ 20%

  const strokeWidth = isSelected ? 2 : 1.2;

  const textColor = isSelected
    ? "#14b8a6" // teal-500
    : hovered
    ? "#5eead4" // teal-300
    : "#94a3b8"; // slate-400

  return (
    <Group
      x={x}
      y={y}
      onClick={() => onClick(id)}
      onMouseEnter={(e) => {
        setHovered(true);
        const container = e.target.getStage()?.container();
        if (container) container.style.cursor = "pointer";
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        const container = e.target.getStage()?.container();
        if (container) container.style.cursor = "default";
      }}
    >
      {/* Background with Selection Glow */}
      <Rect
        width={width}
        height={height}
        cornerRadius={8}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        shadowColor={isSelected ? "rgba(20, 184, 166, 0.3)" : "transparent"}
        shadowBlur={isSelected ? 15 : 0}
        shadowOpacity={0.4}
      />

      {/* Glassmorphism accent (subtle top highlights) */}
      <Rect
        x={0}
        y={0}
        width={width}
        height={height / 3}
        cornerRadius={[8, 8, 0, 0]}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: 0, y: height / 3 }}
        fillLinearGradientColorStops={[
          0, "rgba(255, 255, 255, 0.05)",
          1, "transparent"
        ]}
        listening={false}
      />

      {/* Label */}
      <Text
        width={width}
        height={height}
        text={label}
        align="center"
        verticalAlign="middle"
        fontSize={10}
        fontFamily="Inter, sans-serif"
        fontStyle="bold"
        fill={textColor}
        listening={false}
        letterSpacing={0.5}
      />

      {/* Asset Count Badge */}
      {assetCount > 0 && (
        <Group x={width - 20} y={height - 20}>
          <Circle
            radius={8}
            fill={isSelected ? "#14b8a6" : "rgba(148, 163, 184, 0.3)"}
            listening={false}
          />
          <Text
            x={-8}
            y={-4}
            width={16}
            text={assetCount.toString()}
            align="center"
            fontSize={8}
            fontFamily="Inter, sans-serif"
            fontStyle="bold"
            fill="#ffffff"
            listening={false}
          />
        </Group>
      )}

      {/* Corner ID */}
      <Text
        x={8}
        y={8}
        text={`#${id}`}
        fontSize={7}
        fontFamily="JetBrains Mono, monospace"
        fill="rgba(148, 163, 184, 0.4)"
        listening={false}
      />
    </Group>
  );
};
