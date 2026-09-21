"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AlgorithmKey } from "@/types/sorting";
import { useSortingStore } from "@/store";
import { ALGORITHM_INFO, ALGORITHM_KEYS } from "@/lib/constants";
import { useSortingEngine } from "@/features/sorting/hooks/useSortingEngine";
import { usePreferencesStore } from "@/store";
import { Bars2D } from "@/features/renderer/components/Bars2D";
import { PlaybackControls } from "@/features/visualization/components/PlaybackControls";
import { MetricsPanel } from "@/features/visualization/components/MetricsPanel";

export default function VisualizePage() {
  const params = useParams();
  const algorithmKey = params.algorithm as AlgorithmKey;
  const isValid = ALGORITHM_KEYS.includes(algorithmKey);
  const info = isValid ? ALGORITHM_INFO[algorithmKey] : null;

  const engine = useSortingEngine();
  const { isFavorite, toggleFavorite } = usePreferencesStore();

  // Derive sorted indices by scanning backwards from current frame
  // to find the most recent MARK_SORTED event.
  // Pure derivation — no refs, no setState, no side effects.
  const sortedIndices = useMemo(() => {
    const frames = engine.frames;
    for (let i = engine.currentFrameIndex; i >= 0; i--) {
      if (frames[i]?.event.type === "MARK_SORTED") {
        return new Set<number>(frames[i].event.indices);
      }
    }
    return new Set<number>();
  }, [engine.frames, engine.currentFrameIndex]);

  // Set algorithm when URL param changes
  useEffect(() => {
    if (isValid && algorithmKey !== engine.algorithm) {
      engine.handleAlgorithmChange(algorithmKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithmKey, isValid]);

  // Randomize array on first client mount so user sees random data
  // This runs after hydration — safe, no mismatch
  useEffect(() => {
    useSortingStore.getState().generateNewArray();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 404 fallback
  if (!isValid || !info) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <p style={{ fontFamily: "var(--font-mono)", color: "#f43f5e" }}>
          Algorithm not found: {algorithmKey}
        </p>
        <Link href="/dashboard" className="btn-primary">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const isNLogN = info.timeComplexity.average.includes("log");
  const favorite = isFavorite(algorithmKey);

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      {/* ── Sticky sub-header ── */}
      <div
        style={{
          position: "sticky",
          top: "60px",
          zIndex: 40,
          padding: "0.85rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(7, 7, 26, 0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(99, 102, 241, 0.1)",
        }}
      >
        {/* Left: breadcrumb + name */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link
            href="/dashboard"
            style={{
              color: "#475569",
              fontSize: "0.82rem",
              fontFamily: "var(--font-geist)",
              textDecoration: "none",
              transition: "color 0.2s",
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
            {info.name}
          </h1>

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

        {/* Right: favorite */}
        <button
          onClick={() => toggleFavorite(algorithmKey)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            color: favorite ? "#f43f5e" : "#475569",
            fontSize: "0.85rem",
            fontFamily: "var(--font-geist)",
            padding: "0.4rem 0.7rem",
            borderRadius: "7px",
            transition: "color 0.2s, background 0.2s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "rgba(244,63,94,0.08)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <span style={{ fontSize: "1rem" }}>{favorite ? "♥" : "♡"}</span>
          {favorite ? "Favorited" : "Favorite"}
        </button>
      </div>

      {/* ── Main content ── */}
      <div
        style={{
          flex: 1,
          padding: "1.5rem 2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Visualization area */}
        <div
          style={{
            height: "340px",
            borderRadius: "16px",
            background: "rgba(13, 13, 43, 0.65)",
            border: "1px solid rgba(99, 102, 241, 0.12)",
            padding: "1rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Status badge */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              fontSize: "0.58rem",
              fontFamily: "var(--font-mono)",
              padding: "0.2rem 0.55rem",
              borderRadius: "20px",
              background: "rgba(7, 7, 26, 0.85)",
              border: "1px solid rgba(99, 102, 241, 0.15)",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              color: engine.isPlaying
                ? "#10b981"
                : engine.isFinished
                  ? "#818cf8"
                  : "#475569",
              zIndex: 1,
            }}
          >
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: engine.isPlaying
                  ? "#10b981"
                  : engine.isFinished
                    ? "#818cf8"
                    : "#475569",
                boxShadow: engine.isPlaying ? "0 0 5px #10b981" : "none",
              }}
            />
            {engine.isPlaying
              ? "RUNNING"
              : engine.isFinished
                ? "COMPLETE"
                : "READY"}
          </div>

          {/* 2D bars */}
          <div style={{ height: "100%" }}>
            <Bars2D
              frame={engine.currentFrame}
              originalArray={engine.originalArray}
              sortedIndices={sortedIndices}
            />
          </div>
        </div>

        {/* Playback controls */}
        <PlaybackControls
          isPlaying={engine.isPlaying}
          isFinished={engine.isFinished}
          speed={engine.speed}
          arraySize={engine.arraySize}
          currentFrameIndex={engine.currentFrameIndex}
          totalFrames={engine.totalFrames}
          handlePlay={engine.handlePlay}
          handlePause={engine.handlePause}
          handleReset={engine.handleReset}
          handleRandomize={engine.handleRandomize}
          setSpeed={engine.setSpeed}
          seek={engine.seek}
          handleSizeChange={engine.handleSizeChange}
        />

        {/* Bottom panels */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {/* Metrics */}
          <MetricsPanel
            currentFrame={engine.currentFrame}
            currentFrameIndex={engine.currentFrameIndex}
            totalFrames={engine.totalFrames}
            speed={engine.speed}
          />

          {/* Educational panel */}
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
                marginBottom: "0.75rem",
              }}
            >
              ABOUT THIS ALGORITHM
            </p>

            <p
              style={{
                fontSize: "0.78rem",
                lineHeight: 1.7,
                color: "#94a3b8",
                fontFamily: "var(--font-geist)",
                marginBottom: "1rem",
              }}
            >
              {info.description}
            </p>

            {/* Complexity */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.4rem",
                marginBottom: "0.75rem",
              }}
            >
              {[
                { label: "Best case", val: info.timeComplexity.best },
                { label: "Average case", val: info.timeComplexity.average },
                { label: "Worst case", val: info.timeComplexity.worst },
                { label: "Space", val: info.spaceComplexity },
              ].map(({ label, val }) => {
                const good =
                  val.includes("n log n") ||
                  val === "O(n)" ||
                  val === "O(1)" ||
                  val === "O(log n)";
                return (
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
                        fontSize: "0.7rem",
                        fontFamily: "var(--font-mono)",
                        color: "#475569",
                      }}
                    >
                      {label}
                    </span>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontFamily: "var(--font-mono)",
                        padding: "0.15rem 0.5rem",
                        borderRadius: "4px",
                        color: good
                          ? "#10b981"
                          : val.includes("n²")
                            ? "#f59e0b"
                            : "#8b5cf6",
                        background: good
                          ? "rgba(16,185,129,0.1)"
                          : val.includes("n²")
                            ? "rgba(245,158,11,0.1)"
                            : "rgba(139,92,246,0.1)",
                      }}
                    >
                      {val}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Property badges */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <span
                style={{
                  fontSize: "0.62rem",
                  fontFamily: "var(--font-mono)",
                  padding: "0.2rem 0.55rem",
                  borderRadius: "4px",
                  color: info.stable ? "#10b981" : "#475569",
                  background: info.stable
                    ? "rgba(16,185,129,0.1)"
                    : "rgba(71,85,105,0.1)",
                }}
              >
                {info.stable ? "✓ Stable" : "✗ Unstable"}
              </span>
              <span
                style={{
                  fontSize: "0.62rem",
                  fontFamily: "var(--font-mono)",
                  padding: "0.2rem 0.55rem",
                  borderRadius: "4px",
                  color: info.inPlace ? "#22d3ee" : "#475569",
                  background: info.inPlace
                    ? "rgba(34,211,238,0.1)"
                    : "rgba(71,85,105,0.1)",
                }}
              >
                {info.inPlace ? "✓ In-place" : "✗ Extra memory"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
