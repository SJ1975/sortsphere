"use client";

import { SortFrame } from "@/types/sorting";
import { AlgorithmKey } from "@/types/sorting";
import { PSEUDOCODE } from "@/lib/pseudocode";

interface PseudoCodeProps {
  algorithmKey: AlgorithmKey;
  frame: SortFrame | undefined;
}

export function PseudoCode({ algorithmKey, frame }: PseudoCodeProps) {
  const lines = PSEUDOCODE[algorithmKey];
  const currentEventType = frame?.event.type;

  return (
    <div
      style={{
        borderRadius: "12px",
        background: "rgba(13, 13, 43, 0.65)",
        border: "1px solid rgba(99, 102, 241, 0.12)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "0.75rem 1.25rem",
          borderBottom: "1px solid rgba(99, 102, 241, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
          PSEUDOCODE
        </p>
        <div style={{ display: "flex", gap: "5px" }}>
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#f43f5e",
              opacity: 0.6,
            }}
          />
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#fbbf24",
              opacity: 0.6,
            }}
          />
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#10b981",
              opacity: 0.6,
            }}
          />
        </div>
      </div>

      {/* Code lines */}
      <div style={{ padding: "0.75rem 0" }}>
        {lines.map((line, index) => {
          const isActive =
            currentEventType && line.highlightOn?.includes(currentEventType);
          const isSeparator = line.text.startsWith("──");

          if (isSeparator) {
            return (
              <div
                key={index}
                style={{
                  padding: "0.5rem 1.25rem",
                  borderTop: "1px solid rgba(99,102,241,0.08)",
                  marginTop: "0.25rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.6rem",
                    fontFamily: "var(--font-mono)",
                    color: "#334155",
                    letterSpacing: "0.1em",
                  }}
                >
                  {line.text}
                </span>
              </div>
            );
          }

          return (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "flex-start",
                padding: "0.22rem 1.25rem",
                paddingLeft: `${1.25 + line.indent * 1.1}rem`,
                background: isActive
                  ? "rgba(99, 102, 241, 0.12)"
                  : "transparent",
                borderLeft: isActive
                  ? "2px solid #6366f1"
                  : "2px solid transparent",
                transition: "background 0.1s ease",
                gap: "0.75rem",
              }}
            >
              {/* Line number */}
              <span
                style={{
                  fontSize: "0.6rem",
                  fontFamily: "var(--font-mono)",
                  color: "#2a2a4a",
                  minWidth: "16px",
                  userSelect: "none",
                  lineHeight: "1.6",
                }}
              >
                {index + 1}
              </span>

              {/* Code */}
              <span
                style={{
                  fontSize: "0.75rem",
                  fontFamily: "var(--font-mono)",
                  color: isActive ? "#f1f5f9" : "#64748b",
                  fontWeight: isActive ? 600 : 400,
                  transition: "color 0.1s ease",
                  lineHeight: 1.6,
                  flex: 1,
                }}
              >
                {line.text}
              </span>

              {/* Comment */}
              {isActive && line.comment && (
                <span
                  style={{
                    fontSize: "0.62rem",
                    fontFamily: "var(--font-mono)",
                    color: "#6366f1",
                    opacity: 0.8,
                    whiteSpace: "nowrap",
                  }}
                >
                  ← {line.comment}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
