"use client";

import Link from "next/link";
import { AlgorithmKey } from "@/types/sorting";
import { ALGORITHM_INFO } from "@/lib/constants";

interface AlgorithmCardProps {
  algorithmKey: AlgorithmKey;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function AlgorithmCard({
  algorithmKey,
  isFavorite,
  onToggleFavorite,
}: AlgorithmCardProps) {
  const info = ALGORITHM_INFO[algorithmKey];
  const isNLogN = info.timeComplexity.average.includes("log");

  return (
    <div
      style={{
        borderRadius: "14px",
        padding: "1.4rem",
        background: "rgba(13, 13, 43, 0.7)",
        border: "1px solid rgba(99, 102, 241, 0.12)",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
        position: "relative",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.borderColor = "rgba(99,102,241,0.35)";
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 30px rgba(99,102,241,0.08)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.borderColor = "rgba(99,102,241,0.12)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div style={{ flex: 1 }}>
          {/* Tags row */}
          <div
            style={{
              display: "flex",
              gap: "0.35rem",
              marginBottom: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: "0.58rem",
                fontFamily: "var(--font-mono)",
                padding: "0.2rem 0.5rem",
                borderRadius: "4px",
                color: isNLogN ? "#10b981" : "#f59e0b",
                background: isNLogN
                  ? "rgba(16,185,129,0.1)"
                  : "rgba(245,158,11,0.1)",
              }}
            >
              {isNLogN ? "◉ FAST" : "◎ MEDIUM"}
            </span>
            {info.stable && (
              <span
                style={{
                  fontSize: "0.58rem",
                  fontFamily: "var(--font-mono)",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "4px",
                  color: "#8b5cf6",
                  background: "rgba(139,92,246,0.1)",
                }}
              >
                STABLE
              </span>
            )}
            {info.inPlace && (
              <span
                style={{
                  fontSize: "0.58rem",
                  fontFamily: "var(--font-mono)",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "4px",
                  color: "#22d3ee",
                  background: "rgba(34,211,238,0.1)",
                }}
              >
                IN-PLACE
              </span>
            )}
          </div>

          {/* Name */}
          <h3
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 700,
              fontSize: "1.1rem",
              color: "#f1f5f9",
            }}
          >
            {info.name}
          </h3>
        </div>

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite();
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "1.15rem",
            padding: "0.2rem 0.4rem",
            color: isFavorite ? "#f43f5e" : "#334155",
            transition: "color 0.2s, transform 0.15s",
            lineHeight: 1,
            flexShrink: 0,
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.25)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? "♥" : "♡"}
        </button>
      </div>

      {/* ── Description ── */}
      <p
        style={{
          fontSize: "0.78rem",
          lineHeight: 1.65,
          color: "#64748b",
          fontFamily: "var(--font-geist)",
        }}
      >
        {info.description.substring(0, 105)}...
      </p>

      {/* ── Complexity table ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
        {[
          { label: "Best", val: info.timeComplexity.best },
          { label: "Average", val: info.timeComplexity.average },
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
                  fontSize: "0.68rem",
                  fontFamily: "var(--font-mono)",
                  color: "#475569",
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontSize: "0.68rem",
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

      {/* ── Visualize button ── */}
      <Link
        href={`/visualize/${algorithmKey}`}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.35rem",
          padding: "0.6rem",
          borderRadius: "8px",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          color: "white",
          fontWeight: 600,
          fontSize: "0.85rem",
          fontFamily: "var(--font-geist)",
          textDecoration: "none",
          transition: "opacity 0.2s, transform 0.15s",
          boxShadow: "0 4px 16px rgba(99,102,241,0.28)",
          marginTop: "auto",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.opacity = "0.88";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.opacity = "1";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        Visualize →
      </Link>
    </div>
  );
}
