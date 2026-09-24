"use client";

import { useMemo } from "react";
import { SortFrame } from "@/types/sorting";

interface Bars2DProps {
  frame: SortFrame | undefined;
  originalArray: number[];
  sortedIndices?: Set<number>;
  showValues?: boolean;
}

export function Bars2D({
  frame,
  originalArray,
  sortedIndices = new Set(),
  showValues = true,
}: Bars2DProps) {
  const array = frame?.array ?? originalArray;
  const event = frame?.event;
  const maxVal = useMemo(() => Math.max(...array, 1), [array]);

  const getColor = (index: number): string => {
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
  // Show value labels only when bars are wide enough to read
  const canShowLabels = showValues && array.length <= 40;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        height: "100%",
        width: "100%",
        gap: `${gap}px`,
        paddingBottom: canShowLabels ? "20px" : "0",
        position: "relative",
      }}
    >
      {array.map((val, i) => {
        const color = getColor(i);
        const isActive = event?.indices.includes(i);
        const heightPct = (val / maxVal) * 100;

        return (
          <div
            key={i}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
              height: "100%",
              position: "relative",
            }}
          >
            {/* Bar */}
            <div
              style={{
                width: "100%",
                height: `${heightPct}%`,
                minHeight: "2px",
                backgroundColor: color,
                borderRadius: "2px 2px 0 0",
                transition: "height 0.06s ease, background-color 0.08s ease",
                boxShadow: isActive ? `0 0 8px ${color}88` : "none",
                position: "relative",
              }}
            >
              {/* Value label — shown on top of taller bars */}
              {canShowLabels && heightPct > 15 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-18px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: array.length <= 20 ? "0.6rem" : "0.48rem",
                    fontFamily: "var(--font-mono)",
                    color: isActive ? color : "#475569",
                    fontWeight: isActive ? 700 : 400,
                    whiteSpace: "nowrap",
                    transition: "color 0.08s ease",
                    pointerEvents: "none",
                  }}
                >
                  {val}
                </span>
              )}
            </div>

            {/* Index label at bottom */}
            {canShowLabels && array.length <= 20 && (
              <span
                style={{
                  position: "absolute",
                  bottom: "-18px",
                  fontSize: "0.48rem",
                  fontFamily: "var(--font-mono)",
                  color: "#2a2a4a",
                  pointerEvents: "none",
                }}
              >
                {i}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
