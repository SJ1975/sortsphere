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
  const type = frame?.event.type;

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

  if (algorithm === "selection") {
    if (state?.i === undefined) {
      return {
        title: "Selection Sort",
        hint: "Scan for the smallest value, then move it to the front.",
      };
    }
    const minVal =
      state.minId !== undefined ? originalArray[state.minId] : undefined;
    let hint = "The sorted zone grows by one.";
    if (type === "COMPARE") {
      hint = `Scanning the unsorted part. Cyan flag = smallest so far (${minVal}).`;
    } else if (type === "SWAP") {
      hint = `The smallest value ${minVal} moves to the front of the unsorted zone.`;
    }
    return { title: `Round ${state.i + 1}`, hint };
  }

  if (algorithm === "quick") {
    if (state?.pivotId === undefined) {
      return {
        title: "Quick Sort",
        hint: "Pick a pivot, then split the other values around it.",
      };
    }
    const pivot = originalArray[state.pivotId];
    let hint = `Pivot ${pivot} is in its final place. Each side is sorted on its own.`;
    if (type === "PARTITION") {
      hint = `Pivot ${pivot} chosen. Smaller values go left, larger go right.`;
    } else if (type === "COMPARE") {
      hint = `Is the scanned value ≤ ${pivot}? The cyan line marks the pivot height.`;
    } else if (type === "SWAP") {
      hint =
        frame?.event.indices[1] === state.high
          ? "The pivot drops into its final position."
          : `A value ≤ ${pivot} moves into the cyan zone.`;
    }
    return { title: `Pivot ${pivot}`, hint };
  }

  if (algorithm === "merge") {
    if (type === "SPLIT") {
      return {
        title: `Splitting [${state?.low}..${state?.high}]`,
        hint: "Cut the group in half. Keep splitting until every group is one element.",
      };
    }
    if (type === "MARK_SORTED") {
      return {
        title: "Merged!",
        hint: "Every group has been merged back into one sorted row.",
      };
    }
    if (state?.phase === "merge" && state.low !== undefined) {
      let hint = "Both sorted halves lift into the back row, ready to merge.";
      if (type === "COMPARE") {
        hint =
          "Compare the front value of each half (amber). The smaller one goes first.";
      } else if (type === "OVERWRITE") {
        hint = "The smaller value drops forward into the row (purple).";
      }
      return { title: `Merging [${state.low}..${state.high}]`, hint };
    }
    return {
      title: "Merge Sort",
      hint: "Split in half, sort each half, then merge the halves back together.",
    };
  }

  if (algorithm === "heap") {
    if (state?.phase === "build") {
      return {
        title: "Phase 1 · Build the max-heap",
        hint: "Sift each parent down until it is larger than both of its children.",
      };
    }
    if (state?.phase === "extract") {
      return {
        title: "Phase 2 · Extract the largest",
        hint: "The root swaps to the end of the array, then the heap is repaired.",
      };
    }
    return {
      title: "Heap Sort",
      hint: "The tree above shows the same values as the bars below.",
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
        maxWidth: 270,
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
