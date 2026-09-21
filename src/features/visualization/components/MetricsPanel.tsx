"use client";

import { SortFrame } from "@/types/sorting";

interface MetricsPanelProps {
  currentFrame: SortFrame | undefined;
  currentFrameIndex: number;
  totalFrames: number;
  speed: number;
}

export function MetricsPanel({
  currentFrame,
  currentFrameIndex,
  totalFrames,
  speed,
}: MetricsPanelProps) {
  const comparisons = currentFrame?.metrics.comparisons ?? 0;
  const swaps = currentFrame?.metrics.swaps ?? 0;
  const progress =
    totalFrames > 1
      ? Math.round((currentFrameIndex / (totalFrames - 1)) * 100)
      : 0;

  const metrics = [
    {
      label: "Comparisons",
      value: comparisons.toLocaleString(),
      color: "#fbbf24",
    },
    {
      label: "Swaps / Writes",
      value: swaps.toLocaleString(),
      color: "#f43f5e",
    },
    {
      label: "Frame",
      value: `${currentFrameIndex} / ${Math.max(0, totalFrames - 1)}`,
      color: "#818cf8",
    },
    { label: "Progress", value: `${progress}%`, color: "#10b981" },
    { label: "Playback speed", value: `${speed}×`, color: "#22d3ee" },
  ];

  return (
    <div
      style={{
        borderRadius: "12px",
        padding: "1.25rem",
        background: "rgba(13, 13, 43, 0.65)",
        border: "1px solid rgba(99, 102, 241, 0.12)",
      }}
    >
      <p
        style={{
          fontSize: "0.6rem",
          fontFamily: "var(--font-mono)",
          color: "#475569",
          letterSpacing: "0.08em",
          marginBottom: "1rem",
        }}
      >
        LIVE METRICS
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
        {metrics.map(({ label, value, color }) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "0.78rem",
                fontFamily: "var(--font-geist)",
                color: "#64748b",
              }}
            >
              {label}
            </span>
            <span
              style={{
                fontSize: "1rem",
                fontFamily: "var(--font-mono)",
                fontWeight: 600,
                color,
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
