"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { AlgorithmKey } from "@/types/sorting";
import {
  ALGORITHM_INFO,
  ALGORITHM_KEYS,
  SPEED_MULTIPLIERS,
} from "@/lib/constants";
import { SortingEngine } from "@/features/sorting/engine";
import { useAlgorithmPlayer } from "@/features/visualization/hooks/useAlgorithmPlayer";
import { Bars2D } from "@/features/renderer/components/Bars2D";

type SpeedMultiplier = (typeof SPEED_MULTIPLIERS)[number];

// ── Initial shared array ──
const INITIAL_ARRAY = SortingEngine.generateArray(20);

export default function ComparePage() {
  const [arraySize, setArraySize] = useState(20);
  const [syncSpeed, setSyncSpeed] = useState(1);

  // Two independent players
  const playerA = useAlgorithmPlayer({
    algorithm: "bubble",
    initialArray: INITIAL_ARRAY,
  });
  const playerB = useAlgorithmPlayer({
    algorithm: "merge",
    initialArray: INITIAL_ARRAY,
  });

  // ── Sync controls ──
  const handleSyncPlay = useCallback(() => {
    playerA.play();
    playerB.play();
  }, [playerA, playerB]);

  const handleSyncPause = useCallback(() => {
    playerA.pause();
    playerB.pause();
  }, [playerA, playerB]);

  const handleSyncReset = useCallback(() => {
    playerA.reset();
    playerB.reset();
  }, [playerA, playerB]);

  const handleSyncRandomize = useCallback(() => {
    const newArray = SortingEngine.generateArray(arraySize);
    playerA.updateArray(newArray);
    playerB.updateArray(newArray);
  }, [arraySize, playerA, playerB]);

  const handleSyncSize = useCallback(
    (size: number) => {
      setArraySize(size);
      const newArray = SortingEngine.generateArray(size);
      playerA.updateArray(newArray);
      playerB.updateArray(newArray);
    },
    [playerA, playerB],
  );

  const handleSyncSpeed = useCallback(
    (speed: SpeedMultiplier) => {
      setSyncSpeed(speed);
      playerA.setSpeed(speed);
      playerB.setSpeed(speed);
    },
    [playerA, playerB],
  );

  const isAnyone = playerA.isPlaying || playerB.isPlaying;
  const bothFinished = playerA.isFinished && playerB.isFinished;

  return (
    <div
      style={{
        height: "calc(100vh - 60px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* ── Sub-header ── */}
      <div
        style={{
          flexShrink: 0,
          padding: "0.75rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(7, 7, 26, 0.98)",
          borderBottom: "1px solid rgba(99, 102, 241, 0.1)",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link
            href="/dashboard"
            style={{
              color: "#475569",
              fontSize: "0.82rem",
              fontFamily: "var(--font-geist)",
              textDecoration: "none",
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = "#f1f5f9")}
            onMouseOut={(e) => (e.currentTarget.style.color = "#475569")}
          >
            ← Dashboard
          </Link>
          <span style={{ color: "#2a2a4a" }}>|</span>
          <h1
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 700,
              fontSize: "1rem",
              color: "#f1f5f9",
            }}
          >
            Compare Mode
          </h1>
          <span
            style={{
              fontSize: "0.62rem",
              fontFamily: "var(--font-mono)",
              padding: "0.18rem 0.55rem",
              borderRadius: "4px",
              color: "#22d3ee",
              background: "rgba(34,211,238,0.1)",
            }}
          >
            SIDE BY SIDE
          </span>
        </div>

        {/* Sync controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span
            style={{
              fontSize: "0.6rem",
              fontFamily: "var(--font-mono)",
              color: "#475569",
            }}
          >
            SYNC
          </span>
          <button
            onClick={handleSyncRandomize}
            disabled={isAnyone}
            style={ghostBtn}
          >
            ⟳ New Array
          </button>
          <button
            onClick={handleSyncReset}
            disabled={isAnyone}
            style={ghostBtn}
          >
            ⏮ Reset
          </button>
          <button
            onClick={isAnyone ? handleSyncPause : handleSyncPlay}
            style={primaryBtn}
          >
            {isAnyone
              ? "⏸ Pause Both"
              : bothFinished
                ? "⟳ Replay Both"
                : "▶ Play Both"}
          </button>
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div
        style={{ flex: 1, overflowY: "auto", padding: "1.25rem 1.5rem 2rem" }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {/* ── Shared controls ── */}
          <div
            style={{
              borderRadius: "12px",
              padding: "0.85rem 1.25rem",
              background: "rgba(13, 13, 43, 0.65)",
              border: "1px solid rgba(99, 102, 241, 0.12)",
              display: "flex",
              alignItems: "center",
              gap: "2rem",
              flexWrap: "wrap",
            }}
          >
            <p
              style={{
                fontSize: "0.6rem",
                fontFamily: "var(--font-mono)",
                color: "#475569",
                letterSpacing: "0.08em",
              }}
            >
              SHARED SETTINGS
            </p>

            {/* Speed */}
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <span style={labelStyle}>SPEED</span>
              <div style={{ display: "flex", gap: "3px" }}>
                {SPEED_MULTIPLIERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSyncSpeed(s)}
                    style={{
                      padding: "0.2rem 0.45rem",
                      borderRadius: "5px",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.68rem",
                      fontFamily: "var(--font-mono)",
                      background:
                        syncSpeed === s
                          ? "rgba(99,102,241,0.3)"
                          : "rgba(99,102,241,0.06)",
                      color: syncSpeed === s ? "#818cf8" : "#475569",
                    }}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <span style={labelStyle}>ARRAY SIZE</span>
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
                max={60}
                value={arraySize}
                disabled={isAnyone}
                onChange={(e) => handleSyncSize(parseInt(e.target.value))}
                style={{
                  width: "100px",
                  accentColor: "#6366f1",
                  cursor: isAnyone ? "not-allowed" : "pointer",
                  opacity: isAnyone ? 0.5 : 1,
                }}
              />
            </div>

            {/* Legend */}
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                flexWrap: "wrap",
                marginLeft: "auto",
              }}
            >
              {[
                { color: "#6366f1", label: "Idle" },
                { color: "#fbbf24", label: "Compare" },
                { color: "#f43f5e", label: "Swap" },
                { color: "#22d3ee", label: "Pivot" },
                { color: "#8b5cf6", label: "Merge" },
                { color: "#10b981", label: "Sorted" },
              ].map(({ color, label }) => (
                <div
                  key={label}
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <span
                    style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "2px",
                      background: color,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.6rem",
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

          {/* ── Two algorithm panels ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            {[
              { player: playerA, side: "A", defaultColor: "#6366f1" },
              { player: playerB, side: "B", defaultColor: "#22d3ee" },
            ].map(({ player, side, defaultColor }) => {
              const info = ALGORITHM_INFO[player.selectedAlgorithm];
              const isNLogN = info.timeComplexity.average.includes("log");
              const progress =
                player.totalFrames > 1
                  ? (player.currentIndex / (player.totalFrames - 1)) * 100
                  : 0;

              return (
                <div
                  key={side}
                  style={{
                    borderRadius: "16px",
                    background: "rgba(13, 13, 43, 0.65)",
                    border: `1px solid ${defaultColor}22`,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Panel header */}
                  <div
                    style={{
                      padding: "1rem 1.25rem",
                      borderBottom: `1px solid ${defaultColor}18`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: `${defaultColor}06`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      {/* Side label */}
                      <span
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "6px",
                          background: defaultColor,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          color: "white",
                          fontFamily: "var(--font-syne)",
                          flexShrink: 0,
                        }}
                      >
                        {side}
                      </span>

                      {/* Algorithm selector */}
                      <select
                        value={player.selectedAlgorithm}
                        onChange={(e) =>
                          player.changeAlgorithm(e.target.value as AlgorithmKey)
                        }
                        disabled={player.isPlaying}
                        style={{
                          background: "rgba(7, 7, 26, 0.8)",
                          border: `1px solid ${defaultColor}44`,
                          borderRadius: "7px",
                          color: "#f1f5f9",
                          fontFamily: "var(--font-syne)",
                          fontWeight: 600,
                          fontSize: "0.9rem",
                          padding: "0.3rem 0.6rem",
                          cursor: player.isPlaying ? "not-allowed" : "pointer",
                          outline: "none",
                        }}
                      >
                        {ALGORITHM_KEYS.map((key) => (
                          <option
                            key={key}
                            value={key}
                            style={{ background: "#0d0d2b" }}
                          >
                            {ALGORITHM_INFO[key].name}
                          </option>
                        ))}
                      </select>

                      {/* Complexity badge */}
                      <span
                        style={{
                          fontSize: "0.62rem",
                          fontFamily: "var(--font-mono)",
                          padding: "0.18rem 0.55rem",
                          borderRadius: "4px",
                          color: isNLogN ? "#10b981" : "#f59e0b",
                          background: isNLogN
                            ? "rgba(16,185,129,0.1)"
                            : "rgba(245,158,11,0.1)",
                        }}
                      >
                        {info.timeComplexity.average}
                      </span>
                    </div>

                    {/* Status */}
                    <span
                      style={{
                        fontSize: "0.58rem",
                        fontFamily: "var(--font-mono)",
                        padding: "0.2rem 0.6rem",
                        borderRadius: "20px",
                        background: "rgba(7, 7, 26, 0.8)",
                        border: "1px solid rgba(99,102,241,0.15)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        color: player.isPlaying
                          ? "#10b981"
                          : player.isFinished
                            ? "#818cf8"
                            : "#475569",
                      }}
                    >
                      <span
                        style={{
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          background: player.isPlaying
                            ? "#10b981"
                            : player.isFinished
                              ? "#818cf8"
                              : "#475569",
                          boxShadow: player.isPlaying
                            ? "0 0 5px #10b981"
                            : "none",
                        }}
                      />
                      {player.isPlaying
                        ? "RUNNING"
                        : player.isFinished
                          ? "COMPLETE"
                          : "READY"}
                    </span>
                  </div>

                  {/* Visualization */}
                  <div
                    style={{
                      height: "280px",
                      padding: "1rem",
                      position: "relative",
                    }}
                  >
                    <Bars2D
                      frame={player.currentFrame}
                      originalArray={player.frames[0]?.array ?? []}
                      sortedIndices={player.sortedIndices}
                      showValues={arraySize <= 25}
                    />
                  </div>

                  {/* Progress bar */}
                  <div style={{ padding: "0 1.25rem" }}>
                    <div
                      style={{
                        height: "4px",
                        background: "rgba(99,102,241,0.1)",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const pct = (e.clientX - rect.left) / rect.width;
                        player.seek(Math.floor(pct * (player.totalFrames - 1)));
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${progress}%`,
                          background: `linear-gradient(90deg, ${defaultColor}, ${defaultColor}aa)`,
                          borderRadius: "4px",
                          transition: "width 0.05s linear",
                        }}
                      />
                    </div>
                  </div>

                  {/* Individual controls */}
                  <div
                    style={{
                      padding: "0.85rem 1.25rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderTop: `1px solid ${defaultColor}12`,
                      marginTop: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <button
                        onClick={player.reset}
                        style={ghostBtn}
                        title="Reset"
                      >
                        ⏮
                      </button>
                      <button
                        onClick={player.isPlaying ? player.pause : player.play}
                        style={{
                          ...primaryBtn,
                          background: `linear-gradient(135deg, ${defaultColor}, ${defaultColor}cc)`,
                        }}
                      >
                        {player.isPlaying ? "⏸" : player.isFinished ? "⟳" : "▶"}
                      </button>
                    </div>

                    {/* Metrics */}
                    <div style={{ display: "flex", gap: "1.5rem" }}>
                      {[
                        {
                          label: "Comparisons",
                          value: player.currentFrame?.metrics.comparisons ?? 0,
                          color: "#fbbf24",
                        },
                        {
                          label: "Swaps",
                          value: player.currentFrame?.metrics.swaps ?? 0,
                          color: "#f43f5e",
                        },
                        {
                          label: "Frame",
                          value: `${player.currentIndex}/${player.totalFrames - 1}`,
                          color: defaultColor,
                        },
                      ].map(({ label, value, color }) => (
                        <div key={label} style={{ textAlign: "right" }}>
                          <p
                            style={{
                              fontSize: "0.55rem",
                              fontFamily: "var(--font-mono)",
                              color: "#475569",
                              marginBottom: "1px",
                            }}
                          >
                            {label.toUpperCase()}
                          </p>
                          <p
                            style={{
                              fontSize: "0.9rem",
                              fontFamily: "var(--font-mono)",
                              fontWeight: 700,
                              color,
                            }}
                          >
                            {value.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Winner panel — shows after both finish ── */}
          {bothFinished && (
            <div
              style={{
                borderRadius: "14px",
                padding: "1.25rem",
                background: "rgba(16, 185, 129, 0.06)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <span style={{ fontSize: "1.8rem" }}>🏆</span>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-syne)",
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: "#10b981",
                    }}
                  >
                    {(() => {
                      const stepsA = playerA.totalFrames - 1;
                      const stepsB = playerB.totalFrames - 1;
                      const nameA =
                        ALGORITHM_INFO[playerA.selectedAlgorithm].name;
                      const nameB =
                        ALGORITHM_INFO[playerB.selectedAlgorithm].name;
                      if (stepsA < stepsB)
                        return `${nameA} wins — ${stepsB - stepsA} fewer steps`;
                      if (stepsB < stepsA)
                        return `${nameB} wins — ${stepsA - stepsB} fewer steps`;
                      return "Tie — both algorithms took the same steps";
                    })()}
                  </p>
                  <p
                    style={{
                      fontSize: "0.78rem",
                      color: "#64748b",
                      fontFamily: "var(--font-geist)",
                    }}
                  >
                    {ALGORITHM_INFO[playerA.selectedAlgorithm].name}:{" "}
                    {playerA.totalFrames - 1} steps &nbsp;·&nbsp;
                    {ALGORITHM_INFO[playerB.selectedAlgorithm].name}:{" "}
                    {playerB.totalFrames - 1} steps
                  </p>
                </div>
              </div>
              <button onClick={handleSyncReset} style={primaryBtn}>
                Compare Again →
              </button>
            </div>
          )}
        </div>
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
  padding: "0.4rem 0.65rem",
  cursor: "pointer",
  color: "#94a3b8",
  fontSize: "0.85rem",
  transition: "all 0.15s ease",
};

const primaryBtn: React.CSSProperties = {
  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  border: "none",
  borderRadius: "7px",
  padding: "0.45rem 1rem",
  cursor: "pointer",
  color: "white",
  fontWeight: 600,
  fontSize: "0.82rem",
  fontFamily: "var(--font-geist)",
  transition: "all 0.15s ease",
  boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
};
