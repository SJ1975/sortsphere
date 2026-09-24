"use client";

import { useState } from "react";
import { AlgorithmKey } from "@/types/sorting";
import { ALGORITHM_INFO } from "@/lib/constants";
import { COMPLEXITY_EXPLANATION } from "@/lib/pseudocode";

interface ComplexityExplainerProps {
  algorithmKey: AlgorithmKey;
}

export function ComplexityExplainer({
  algorithmKey,
}: ComplexityExplainerProps) {
  const [expanded, setExpanded] = useState(false);
  const info = ALGORITHM_INFO[algorithmKey];
  const explanation = COMPLEXITY_EXPLANATION[algorithmKey];

  return (
    <div
      style={{
        borderRadius: "12px",
        background: "rgba(13, 13, 43, 0.65)",
        border: "1px solid rgba(99, 102, 241, 0.12)",
        overflow: "hidden",
      }}
    >
      {/* Header — always visible */}
      <div style={{ padding: "1rem 1.25rem" }}>
        <p
          style={{
            fontSize: "0.6rem",
            fontFamily: "var(--font-mono)",
            color: "#475569",
            letterSpacing: "0.08em",
            marginBottom: "0.75rem",
          }}
        >
          COMPLEXITY ANALYSIS
        </p>

        {/* Complexity grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.5rem",
            marginBottom: "0.75rem",
          }}
        >
          {[
            { label: "Best", val: info.timeComplexity.best, type: "time" },
            {
              label: "Average",
              val: info.timeComplexity.average,
              type: "time",
            },
            { label: "Worst", val: info.timeComplexity.worst, type: "time" },
            { label: "Space", val: info.spaceComplexity, type: "space" },
          ].map(({ label, val }) => {
            const isGood =
              val.includes("n log n") ||
              val === "O(n)" ||
              val === "O(1)" ||
              val === "O(log n)";
            const isBad = val.includes("n²");
            const color = isGood ? "#10b981" : isBad ? "#f59e0b" : "#8b5cf6";
            const bg = isGood
              ? "rgba(16,185,129,0.08)"
              : isBad
                ? "rgba(245,158,11,0.08)"
                : "rgba(139,92,246,0.08)";
            return (
              <div
                key={label}
                style={{
                  padding: "0.5rem 0.75rem",
                  borderRadius: "8px",
                  background: bg,
                  border: `1px solid ${color}22`,
                }}
              >
                <p
                  style={{
                    fontSize: "0.55rem",
                    fontFamily: "var(--font-mono)",
                    color: "#475569",
                    marginBottom: "0.2rem",
                    letterSpacing: "0.06em",
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
                  {val}
                </p>
              </div>
            );
          })}
        </div>

        {/* Property badges */}
        <div
          style={{
            display: "flex",
            gap: "0.4rem",
            flexWrap: "wrap",
            marginBottom: "0.75rem",
          }}
        >
          <span
            style={{
              fontSize: "0.62rem",
              fontFamily: "var(--font-mono)",
              padding: "0.2rem 0.55rem",
              borderRadius: "4px",
              color: info.stable ? "#10b981" : "#f59e0b",
              background: info.stable
                ? "rgba(16,185,129,0.1)"
                : "rgba(245,158,11,0.1)",
            }}
          >
            {info.stable ? "✓ Stable sort" : "✗ Unstable sort"}
          </span>
          <span
            style={{
              fontSize: "0.62rem",
              fontFamily: "var(--font-mono)",
              padding: "0.2rem 0.55rem",
              borderRadius: "4px",
              color: info.inPlace ? "#22d3ee" : "#8b5cf6",
              background: info.inPlace
                ? "rgba(34,211,238,0.1)"
                : "rgba(139,92,246,0.1)",
            }}
          >
            {info.inPlace ? "✓ In-place (O(1) space)" : "✗ Needs extra memory"}
          </span>
        </div>

        {/* Why? toggle button */}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#6366f1",
            fontSize: "0.72rem",
            fontFamily: "var(--font-mono)",
            padding: 0,
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
          }}
        >
          {expanded ? "▼" : "▶"} Why is this the complexity?
        </button>
      </div>

      {/* Expanded explanation */}
      {expanded && (
        <div
          style={{
            padding: "0 1.25rem 1rem",
            borderTop: "1px solid rgba(99,102,241,0.08)",
            paddingTop: "0.75rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          {/* Intuition */}
          <div
            style={{
              padding: "0.75rem",
              borderRadius: "8px",
              background: "rgba(99,102,241,0.06)",
              border: "1px solid rgba(99,102,241,0.12)",
            }}
          >
            <p
              style={{
                fontSize: "0.6rem",
                fontFamily: "var(--font-mono)",
                color: "#6366f1",
                letterSpacing: "0.08em",
                marginBottom: "0.4rem",
              }}
            >
              INTUITION
            </p>
            <p
              style={{
                fontSize: "0.78rem",
                lineHeight: 1.65,
                color: "#94a3b8",
                fontFamily: "var(--font-geist)",
              }}
            >
              💡 {explanation.intuition}
            </p>
          </div>

          {/* Why */}
          <div>
            <p
              style={{
                fontSize: "0.6rem",
                fontFamily: "var(--font-mono)",
                color: "#475569",
                letterSpacing: "0.08em",
                marginBottom: "0.4rem",
              }}
            >
              MATHEMATICAL REASON
            </p>
            <p
              style={{
                fontSize: "0.78rem",
                lineHeight: 1.65,
                color: "#94a3b8",
                fontFamily: "var(--font-geist)",
              }}
            >
              {explanation.why}
            </p>
          </div>

          {/* Best vs Worst */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}
          >
            <div
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: "6px",
                background: "rgba(16,185,129,0.06)",
                border: "1px solid rgba(16,185,129,0.15)",
              }}
            >
              <p
                style={{
                  fontSize: "0.6rem",
                  fontFamily: "var(--font-mono)",
                  color: "#10b981",
                  marginBottom: "0.2rem",
                }}
              >
                BEST CASE
              </p>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#94a3b8",
                  fontFamily: "var(--font-geist)",
                }}
              >
                {explanation.bestCase}
              </p>
            </div>
            <div
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: "6px",
                background: "rgba(245,158,11,0.06)",
                border: "1px solid rgba(245,158,11,0.15)",
              }}
            >
              <p
                style={{
                  fontSize: "0.6rem",
                  fontFamily: "var(--font-mono)",
                  color: "#f59e0b",
                  marginBottom: "0.2rem",
                }}
              >
                WORST CASE
              </p>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#94a3b8",
                  fontFamily: "var(--font-geist)",
                }}
              >
                {explanation.worstCase}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
