"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AlgorithmKey } from "@/types/sorting";
import { ALGORITHM_INFO, ALGORITHM_KEYS } from "@/lib/constants";
import { useSortingEngine } from "@/features/sorting/hooks/useSortingEngine";
import { usePreferencesStore, useSortingStore } from "@/store";
import { Bars2D } from "@/features/renderer/components/Bars2D";
import { PlaybackControls } from "@/features/visualization/components/PlaybackControls";
import { MetricsPanel } from "@/features/visualization/components/MetricsPanel";
import { StepExplainer } from "@/features/visualization/components/StepExplainer";
import { PseudoCode } from "@/features/visualization/components/PseudoCode";
import { CustomInput } from "@/features/visualization/components/CustomInput";
import { ComplexityExplainer } from "@/features/visualization/components/ComplexityExplainer";

const Scene3D = dynamic(
  () => import("@/features/renderer/components/Scene").then((m) => m.Scene3D),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            color: "#475569",
            fontSize: "0.75rem",
          }}
        >
          Loading 3D scene...
        </p>
      </div>
    ),
  },
);

type ViewMode = "2d" | "3d";

export default function VisualizePage() {
  const params = useParams();
  const algorithmKey = params.algorithm as AlgorithmKey;
  const isValid = ALGORITHM_KEYS.includes(algorithmKey);
  const info = isValid ? ALGORITHM_INFO[algorithmKey] : null;

  const engine = useSortingEngine();
  const { isFavorite, toggleFavorite } = usePreferencesStore();
  const [viewMode, setViewMode] = useState<ViewMode>("3d");
  const [ready, setReady] = useState(false);

  const sortedIndices = useMemo(() => {
    if (!ready) return new Set<number>();
    const frames = engine.frames;
    for (let i = engine.currentFrameIndex; i >= 0; i--) {
      if (frames[i]?.event.type === "MARK_SORTED") {
        return new Set<number>(frames[i].event.indices);
      }
    }
    return new Set<number>();
  }, [engine.frames, engine.currentFrameIndex, ready]);

  useEffect(() => {
    if (isValid && algorithmKey !== engine.algorithm) {
      engine.handleAlgorithmChange(algorithmKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithmKey, isValid]);

  useEffect(() => {
    useSortingStore.getState().generateNewArray();
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    // ── OUTER: full height, flex column, NO overflow ──
    <div
      style={{
        height: "calc(100vh - 60px)", // subtract dashboard navbar height
        display: "flex",
        flexDirection: "column",
        overflow: "hidden", // prevent outer scroll
      }}
    >
      {/* ── Sub-header: STATIC at top, never moves ── */}
      <div
        style={{
          flexShrink: 0, // never shrinks
          padding: "0.75rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(7, 7, 26, 0.98)",
          borderBottom: "1px solid rgba(99, 102, 241, 0.1)",
          gap: "1rem",
          flexWrap: "wrap",
          zIndex: 10,
        }}
      >
        {/* Left */}
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

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              display: "flex",
              background: "rgba(99,102,241,0.06)",
              border: "1px solid rgba(99,102,241,0.15)",
              borderRadius: "8px",
              padding: "3px",
              gap: "2px",
            }}
          >
            {(["3d", "2d"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  padding: "0.3rem 0.8rem",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  fontWeight: viewMode === mode ? 600 : 400,
                  background:
                    viewMode === mode
                      ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                      : "transparent",
                  color: viewMode === mode ? "white" : "#64748b",
                  transition: "all 0.15s ease",
                }}
              >
                {mode.toUpperCase()}
              </button>
            ))}
          </div>

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
      </div>

      {/* ── CONTENT: scrolls independently below sub-header ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto", // only this area scrolls
          padding: "1.25rem 2rem 2rem",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "1.1rem",
          }}
        >
          {/* Custom input */}
          <CustomInput
            onSubmit={engine.handleCustomInput}
            onRandomize={engine.handleRandomize}
            isPlaying={engine.isPlaying}
          />

          {/* Visualization area */}
          <div
            style={{
              height: "360px",
              borderRadius: "16px",
              background:
                viewMode === "3d" ? "#07071a" : "rgba(13, 13, 43, 0.65)",
              border: "1px solid rgba(99, 102, 241, 0.12)",
              position: "relative",
              overflow: "hidden",
              flexShrink: 0,
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
                padding: "0.2rem 0.6rem",
                borderRadius: "20px",
                background: "rgba(7, 7, 26, 0.9)",
                border: "1px solid rgba(99, 102, 241, 0.2)",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                color: engine.isPlaying
                  ? "#10b981"
                  : engine.isFinished
                    ? "#818cf8"
                    : "#475569",
                zIndex: 10,
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

            {viewMode === "3d" &&
              !engine.isPlaying &&
              engine.currentFrameIndex === 0 && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 10,
                    fontSize: "0.58rem",
                    fontFamily: "var(--font-mono)",
                    color: "#334155",
                    padding: "0.2rem 0.7rem",
                    background: "rgba(7,7,26,0.7)",
                    borderRadius: "20px",
                    border: "1px solid rgba(99,102,241,0.1)",
                    pointerEvents: "none",
                  }}
                >
                  drag to orbit · scroll to zoom
                </div>
              )}

            {viewMode === "3d" ? (
              <Scene3D
                frame={engine.currentFrame}
                originalArray={engine.originalArray}
                sortedIndices={sortedIndices}
              />
            ) : (
              <div style={{ height: "100%", padding: "1.5rem 1rem 1rem" }}>
                <Bars2D
                  frame={engine.currentFrame}
                  originalArray={engine.originalArray}
                  sortedIndices={sortedIndices}
                  showValues={true}
                />
              </div>
            )}
          </div>

          {/* Step explainer */}
          {ready && (
            <StepExplainer
              frame={
                engine.currentFrameIndex === 0 ? undefined : engine.currentFrame
              }
              algorithmKey={algorithmKey}
              currentFrameIndex={engine.currentFrameIndex}
              totalFrames={engine.totalFrames}
              isPlaying={engine.isPlaying}
              isFinished={engine.isFinished}
            />
          )}

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
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.1rem",
            }}
          >
            <MetricsPanel
              currentFrame={engine.currentFrame}
              currentFrameIndex={engine.currentFrameIndex}
              totalFrames={engine.totalFrames}
              speed={engine.speed}
            />
            <ComplexityExplainer algorithmKey={algorithmKey} />
            <PseudoCode
              algorithmKey={algorithmKey}
              frame={
                engine.currentFrameIndex === 0 ? undefined : engine.currentFrame
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
