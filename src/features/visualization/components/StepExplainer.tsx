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

  // ── FINISHED STATE ──
  if (isFinished) {
    const sortedArray = frame?.array ?? [];

    return (
      <div
        style={{
          borderRadius: "12px",
          padding: "1.25rem",
          background: "rgba(16, 185, 129, 0.06)",
          border: "1px solid rgba(16, 185, 129, 0.25)",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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
              Completed in {totalFrames - 1} steps using {totalFrames - 1}{" "}
              operations.
            </p>
          </div>
        </div>

        {/* Sorted result */}
        {sortedArray.length > 0 && (
          <div
            style={{
              padding: "0.85rem 1rem",
              borderRadius: "8px",
              background: "rgba(7, 7, 26, 0.6)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
            }}
          >
            {/* Label */}
            <p
              style={{
                fontSize: "0.58rem",
                fontFamily: "var(--font-mono)",
                color: "#10b981",
                letterSpacing: "0.1em",
                marginBottom: "0.6rem",
              }}
            >
              SORTED RESULT
            </p>

            {/* Array values */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontSize: "0.8rem",
                  fontFamily: "var(--font-mono)",
                  color: "#334155",
                  marginRight: "2px",
                }}
              >
                [
              </span>

              {sortedArray.map((val, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "#10b981",
                      padding: "0.15rem 0.4rem",
                      borderRadius: "4px",
                      background: "rgba(16, 185, 129, 0.1)",
                      border: "1px solid rgba(16, 185, 129, 0.2)",
                    }}
                  >
                    {val}
                  </span>
                  {i < sortedArray.length - 1 && (
                    <span
                      style={{
                        color: "#334155",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.75rem",
                      }}
                    >
                      ,
                    </span>
                  )}
                </span>
              ))}

              <span
                style={{
                  fontSize: "0.8rem",
                  fontFamily: "var(--font-mono)",
                  color: "#334155",
                  marginLeft: "2px",
                }}
              >
                ]
              </span>
            </div>

            {/* Stats row */}
            <div
              style={{
                display: "flex",
                gap: "1.5rem",
                marginTop: "0.75rem",
                paddingTop: "0.75rem",
                borderTop: "1px solid rgba(16,185,129,0.1)",
                flexWrap: "wrap",
              }}
            >
              {[
                {
                  label: "ELEMENTS",
                  value: sortedArray.length,
                  color: "#10b981",
                },
                { label: "MIN", value: sortedArray[0], color: "#818cf8" },
                {
                  label: "MAX",
                  value: sortedArray[sortedArray.length - 1],
                  color: "#818cf8",
                },
                { label: "STEPS", value: totalFrames - 1, color: "#fbbf24" },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <p
                    style={{
                      fontSize: "0.55rem",
                      fontFamily: "var(--font-mono)",
                      color: "#475569",
                      letterSpacing: "0.08em",
                      marginBottom: "2px",
                    }}
                  >
                    {label}
                  </p>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      fontFamily: "var(--font-mono)",
                      fontWeight: 600,
                      color,
                    }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hint */}
        <p
          style={{
            fontSize: "0.68rem",
            fontFamily: "var(--font-mono)",
            color: "#334155",
            textAlign: "center",
          }}
        >
          Press ⟳ Replay to watch again · Randomize for a new array · Change
          algorithm from Dashboard
        </p>
      </div>
    );
  }

  // ── RUNNING STATE ──
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

      {/* Array state preview */}
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
