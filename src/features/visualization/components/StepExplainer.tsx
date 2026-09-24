"use client";

import { SortFrame } from "@/types/sorting";
import { AlgorithmKey } from "@/types/sorting";
import { explainStep, getAlgorithmPhase } from "../utils/stepExplainer";

interface StepExplainerProps {
  frame: SortFrame | undefined;
  algorithmKey: AlgorithmKey;
  currentFrameIndex: number;
  totalFrames: number;
  isPlaying: boolean;
  isFinished: boolean;
}

export function StepExplainer({
  frame,
  algorithmKey,
  currentFrameIndex,
  totalFrames,
  isPlaying,
  isFinished,
}: StepExplainerProps) {
  const explanation = explainStep(
    frame,
    algorithmKey,
    currentFrameIndex,
    totalFrames,
  );
  const phase = getAlgorithmPhase(
    algorithmKey,
    frame,
    currentFrameIndex,
    totalFrames,
  );

  const eventColor: Record<string, string> = {
    "👁": "#fbbf24",
    "🔄": "#f43f5e",
    "✍️": "#a78bfa",
    "✅": "#10b981",
    "📍": "#22d3ee",
    "🔗": "#8b5cf6",
    "▶": "#6366f1",
    "🔁": "#475569",
    "⚙️": "#475569",
  };

  const borderColor = eventColor[explanation.emoji] ?? "#6366f1";

  if (isFinished) {
    return (
      <div
        style={{
          borderRadius: "12px",
          padding: "1.25rem",
          background: "rgba(16, 185, 129, 0.06)",
          border: "1px solid rgba(16, 185, 129, 0.25)",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <span style={{ fontSize: "1.8rem" }}>🎉</span>
        <div>
          <p
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 700,
              fontSize: "1rem",
              color: "#10b981",
              marginBottom: "0.25rem",
            }}
          >
            Array sorted successfully!
          </p>
          <p
            style={{
              fontSize: "0.78rem",
              color: "#64748b",
              fontFamily: "var(--font-geist)",
            }}
          >
            The algorithm completed in {totalFrames - 1} steps. Press ⟳ Replay
            or Randomize to try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        borderRadius: "12px",
        padding: "1.1rem 1.25rem",
        background: "rgba(13, 13, 43, 0.65)",
        border: `1px solid ${borderColor}28`,
        borderLeft: `3px solid ${borderColor}`,
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        transition: "border-color 0.15s ease",
      }}
    >
      {/* Top row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span style={{ fontSize: "1.2rem", lineHeight: 1 }}>
            {explanation.emoji}
          </span>
          <p
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 700,
              fontSize: "0.95rem",
              color: "#f1f5f9",
            }}
          >
            {explanation.headline}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {isPlaying && (
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#10b981",
                boxShadow: "0 0 6px #10b981",
                animation: "pulse 1s infinite",
                display: "inline-block",
              }}
            />
          )}
          <span
            style={{
              fontSize: "0.6rem",
              fontFamily: "var(--font-mono)",
              color: "#475569",
              letterSpacing: "0.06em",
            }}
          >
            {phase}
          </span>
        </div>
      </div>

      {/* Explanation text */}
      <p
        style={{
          fontSize: "0.82rem",
          lineHeight: 1.65,
          color: "#94a3b8",
          fontFamily: "var(--font-geist)",
        }}
      >
        {explanation.detail}
      </p>

      {/* Array state preview — shows current values */}
      {frame && (
        <div
          style={{
            display: "flex",
            gap: "3px",
            flexWrap: "wrap",
            marginTop: "0.25rem",
          }}
        >
          {frame.array.slice(0, 30).map((val, i) => {
            const isHighlighted = frame.event.indices.includes(i);
            return (
              <span
                key={i}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6rem",
                  padding: "0.15rem 0.3rem",
                  borderRadius: "3px",
                  background: isHighlighted
                    ? `${borderColor}22`
                    : "rgba(99,102,241,0.06)",
                  color: isHighlighted ? borderColor : "#334155",
                  border: `1px solid ${isHighlighted ? borderColor + "44" : "transparent"}`,
                  transition: "all 0.08s ease",
                  fontWeight: isHighlighted ? 600 : 400,
                }}
              >
                {val}
              </span>
            );
          })}
          {frame.array.length > 30 && (
            <span
              style={{
                fontSize: "0.6rem",
                color: "#334155",
                fontFamily: "var(--font-mono)",
                alignSelf: "center",
              }}
            >
              +{frame.array.length - 30} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}
