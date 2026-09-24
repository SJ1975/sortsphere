"use client";

import { useMemo } from "react";
import { SortFrame } from "@/types/sorting";
import { SortBar } from "./SortBar";
import { getBarColor } from "../config/materials";

interface SortBarsProps {
  frame: SortFrame | undefined;
  originalArray: number[];
  sortedIndices: Set<number>;
}

// Total scene width — all bars fill this range
const SCENE_WIDTH = 36;
// Maximum bar height in 3D units
const MAX_HEIGHT = 10;

export function SortBars({
  frame,
  originalArray,
  sortedIndices,
}: SortBarsProps) {
  const array = frame?.array ?? originalArray;
  const event = frame?.event;
  const n = array.length;
  const maxVal = useMemo(() => Math.max(...array, 1), [array]);

  // Recompute layout only when array length changes
  const layout = useMemo(() => {
    const slotWidth = SCENE_WIDTH / n;
    const barWidth = Math.max(slotWidth * 0.78, 0.12);
    const barDepth = Math.max(barWidth * 0.75, 0.1);
    const startX = -(SCENE_WIDTH / 2) + slotWidth / 2;
    return { slotWidth, barWidth, barDepth, startX };
  }, [n]);

  return (
    <group>
      {array.map((val, i) => {
        const height = Math.max((val / maxVal) * MAX_HEIGHT, 0.08);
        const color = getBarColor(i, event, sortedIndices);
        const x = layout.startX + i * layout.slotWidth;

        return (
          <SortBar
            key={i}
            x={x}
            targetHeight={height}
            targetColor={color}
            barWidth={layout.barWidth}
            barDepth={layout.barDepth}
          />
        );
      })}
    </group>
  );
}
