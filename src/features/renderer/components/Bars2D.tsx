"use client";

import { useMemo } from "react";
import { SortFrame } from "@/types/sorting";

interface Bars2DProps {
  frame: SortFrame | undefined;
  originalArray: number[];
  sortedIndices?: Set<number>;
}

export function Bars2D({
  frame,
  originalArray,
  sortedIndices = new Set(),
}: Bars2DProps) {
  const array = frame?.array ?? originalArray;
  const event = frame?.event;

  const maxVal = useMemo(() => Math.max(...array, 1), [array]);

  const getColor = (index: number): string => {
    // Sorted always wins — green
    if (sortedIndices.has(index)) return "#10b981";
    if (event?.type === "MARK_SORTED" && event.indices.includes(index))
      return "#10b981";

    if (!event || !event.indices.includes(index)) return "#6366f1";

    switch (event.type) {
      case "COMPARE":
        return "#fbbf24";
      case "SWAP":
        return "#f43f5e";
      case "PARTITION":
        return "#22d3ee";
      case "MERGE":
        return "#8b5cf6";
      case "OVERWRITE":
        return "#a78bfa";
      default:
        return "#6366f1";
    }
  };

  const gap = array.length > 60 ? 1 : array.length > 35 ? 2 : 3;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        height: "100%",
        width: "100%",
        gap: `${gap}px`,
      }}
    >
      {array.map((val, i) => {
        const color = getColor(i);
        const isActive = event?.indices.includes(i);
        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${(val / maxVal) * 100}%`,
              minHeight: "2px",
              backgroundColor: color,
              borderRadius: "2px 2px 0 0",
              transition: "height 0.06s ease, background-color 0.08s ease",
              boxShadow: isActive ? `0 0 6px ${color}99` : "none",
            }}
          />
        );
      })}
    </div>
  );
}
