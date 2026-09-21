"use client";

import { SPEED_MULTIPLIERS } from "@/lib/constants";

type SpeedMultiplier = (typeof SPEED_MULTIPLIERS)[number];

interface PlaybackControlsProps {
  isPlaying: boolean;
  isFinished: boolean;
  speed: number;
  arraySize: number;
  currentFrameIndex: number;
  totalFrames: number;
  handlePlay: () => void;
  handlePause: () => void;
  handleReset: () => void;
  handleRandomize: () => void;
  setSpeed: (s: SpeedMultiplier) => void;
  seek: (i: number) => void;
  handleSizeChange: (s: number) => void;
}

export function PlaybackControls({
  isPlaying,
  isFinished,
  speed,
  arraySize,
  currentFrameIndex,
  totalFrames,
  handlePlay,
  handlePause,
  handleReset,
  handleRandomize,
  setSpeed,
  seek,
  handleSizeChange,
}: PlaybackControlsProps) {
  const progress =
    totalFrames > 1 ? (currentFrameIndex / (totalFrames - 1)) * 100 : 0;

  return (
    <div
      style={{
        borderRadius: "12px",
        padding: "1.25rem",
        background: "rgba(13, 13, 43, 0.65)",
        border: "1px solid rgba(99, 102, 241, 0.12)",
        display: "flex",
        flexDirection: "column",
        gap: "0.9rem",
      }}
    >
      {/* Progress bar — clickable to scrub */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.4rem",
          }}
        >
          <span
            style={{
              fontSize: "0.6rem",
              fontFamily: "var(--font-mono)",
              color: "#475569",
              letterSpacing: "0.08em",
            }}
          >
            PROGRESS
          </span>
          <span
            style={{
              fontSize: "0.6rem",
              fontFamily: "var(--font-mono)",
              color: "#475569",
            }}
          >
            {currentFrameIndex} / {Math.max(0, totalFrames - 1)}
          </span>
        </div>
        <div
          style={{
            height: "5px",
            background: "rgba(99, 102, 241, 0.1)",
            borderRadius: "4px",
            cursor: "pointer",
            position: "relative",
          }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            seek(Math.floor(pct * (totalFrames - 1)));
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
              borderRadius: "4px",
              transition: "width 0.05s linear",
            }}
          />
        </div>
      </div>

      {/* Controls row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        {/* Left: playback buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {/* Randomize */}
          <button
            onClick={handleRandomize}
            style={ghostBtn}
            title="New random array"
          >
            ⟳
          </button>

          {/* Reset */}
          <button onClick={handleReset} style={ghostBtn} title="Back to start">
            ⏮
          </button>

          {/* Play / Pause */}
          <button
            onClick={isPlaying ? handlePause : handlePlay}
            style={{ ...primaryBtn, minWidth: "90px" }}
          >
            {isPlaying ? "⏸ Pause" : isFinished ? "⟳ Replay" : "▶ Play"}
          </button>
        </div>

        {/* Right: speed + size */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.25rem",
            flexWrap: "wrap",
          }}
        >
          {/* Speed */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={labelStyle}>SPEED</span>
            <div style={{ display: "flex", gap: "3px" }}>
              {SPEED_MULTIPLIERS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  style={{
                    padding: "0.2rem 0.45rem",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.68rem",
                    fontFamily: "var(--font-mono)",
                    background:
                      speed === s
                        ? "rgba(99,102,241,0.3)"
                        : "rgba(99,102,241,0.06)",
                    color: speed === s ? "#818cf8" : "#475569",
                    transition: "all 0.15s ease",
                  }}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Array size */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={labelStyle}>SIZE</span>
            <span
              style={{
                fontSize: "0.72rem",
                fontFamily: "var(--font-mono)",
                color: "#818cf8",
                minWidth: "22px",
              }}
            >
              {arraySize}
            </span>
            <input
              type="range"
              min={5}
              max={80}
              value={arraySize}
              disabled={isPlaying}
              onChange={(e) => handleSizeChange(parseInt(e.target.value))}
              style={{
                width: "80px",
                accentColor: "#6366f1",
                cursor: isPlaying ? "not-allowed" : "pointer",
                opacity: isPlaying ? 0.5 : 1,
              }}
            />
          </div>
        </div>
      </div>

      {/* Color legend */}
      <div style={{ display: "flex", gap: "0.9rem", flexWrap: "wrap" }}>
        {[
          { color: "#6366f1", label: "Idle" },
          { color: "#fbbf24", label: "Comparing" },
          { color: "#f43f5e", label: "Swapping" },
          { color: "#a78bfa", label: "Writing" },
          { color: "#22d3ee", label: "Pivot" },
          { color: "#8b5cf6", label: "Merging" },
          { color: "#10b981", label: "Sorted" },
        ].map(({ color, label }) => (
          <div
            key={label}
            style={{ display: "flex", alignItems: "center", gap: "5px" }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "2px",
                background: color,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: "0.62rem",
                fontFamily: "var(--font-mono)",
                color: "#475569",
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: "0.6rem",
  fontFamily: "var(--font-mono)",
  color: "#475569",
  letterSpacing: "0.08em",
};

const ghostBtn: React.CSSProperties = {
  background: "rgba(99,102,241,0.06)",
  border: "1px solid rgba(99,102,241,0.15)",
  borderRadius: "7px",
  padding: "0.45rem 0.7rem",
  cursor: "pointer",
  color: "#94a3b8",
  fontSize: "1rem",
  transition: "all 0.15s ease",
};

const primaryBtn: React.CSSProperties = {
  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  border: "none",
  borderRadius: "7px",
  padding: "0.5rem 1.2rem",
  cursor: "pointer",
  color: "white",
  fontWeight: 600,
  fontSize: "0.85rem",
  fontFamily: "var(--font-geist)",
  transition: "all 0.15s ease",
  boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
};
