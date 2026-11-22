"use client";

import { AlgorithmKey, SortFrame } from "@/types/sorting";

interface SceneHudProps {
  algorithm: AlgorithmKey;
  frame: SortFrame | undefined;
  originalArray: number[];
  maxSize?: number;
}

function getLines(
  algorithm: AlgorithmKey,
  frame: SortFrame | undefined,
  originalArray: number[],
): { title: string; hint: string } {
  const state = frame?.state;

  if (algorithm === "bubble") {
    const pass = state?.pass;
    return {
      title: pass === undefined ? "Bubble Sort" : `Pass ${pass + 1}`,
      hint: "The largest value in the unsorted part bubbles to the right.",
    };
  }

  if (algorithm === "insertion") {
    if (state?.keyId !== undefined) {
      return {
        title: `Holding ${originalArray[state.keyId]}`,
        hint: "Larger elements slide right to open a gap for it.",
      };
    }
    return {
      title: "Insertion Sort",
      hint: "Each element is pulled out and dropped into the sorted hand.",
    };
  }

  return { title: "", hint: "" };
}

export function SceneHud({
  algorithm,
  frame,
  originalArray,
  maxSize,
}: SceneHudProps) {
  const { title, hint } = getLines(algorithm, frame, originalArray);
  if (!title) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: 12,
        pointerEvents: "none",
        padding: "0.5rem 0.75rem",
        borderRadius: 10,
        background: "rgba(7, 7, 26, 0.75)",
        border: "1px solid rgba(99, 102, 241, 0.18)",
        maxWidth: 260,
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-syne)",
          fontWeight: 700,
          fontSize: "0.85rem",
          color: "#f1f5f9",
        }}
      >
        {title}
      </p>
      <p
        style={{
          fontFamily: "var(--font-geist)",
          fontSize: "0.68rem",
          lineHeight: 1.45,
          color: "#94a3b8",
          marginTop: 2,
        }}
      >
        {hint}
      </p>
      {maxSize && (
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.55rem",
            color: "#475569",
            marginTop: 4,
            letterSpacing: "0.05em",
          }}
        >
          3D VIEW · UP TO {maxSize} ELEMENTS
        </p>
      )}
    </div>
  );
}
