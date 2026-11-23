"use client";

import { useMemo } from "react";
import { Stage } from "./shared/Stage";
import { Bar3D } from "./shared/Bar3D";
import { GlideBox } from "./shared/GlideBox";
import { SceneProps } from "./shared/types";
import { barHeight, getIds, makeLayout, positionsOf } from "./shared/layout";

const GAP = 0.8; // width of the gap opened by each split
const BUFFER_Y = 1.9; // height of the back row
const BUFFER_Z = -3.8; // depth of the back row

export function MergeScene({
  frame,
  originalArray,
  sortedIndices,
  autoRotate,
}: SceneProps) {
  const n = originalArray.length;
  const layout = useMemo(() => makeLayout(n), [n]);
  const maxVal = useMemo(() => Math.max(...originalArray, 1), [originalArray]);

  const ids = getIds(frame, originalArray);
  const positions = positionsOf(ids);
  const event = frame?.event;
  const state = frame?.state;

  const cuts = state?.cuts ?? [];
  const low = state?.low;
  const mid = state?.mid;
  const high = state?.high;

  // x position of an array slot, including the gaps opened by splits
  const xAt = (p: number) => {
    let gapsLeft = 0;
    for (const c of cuts) if (c < p) gapsLeft++;
    return layout.xOf(p) + (gapsLeft - cuts.length / 2) * GAP;
  };

  // Elements waiting in the back row: id -> slot they hover behind
  const bufferPos = new Map<number, number>();
  if (low !== undefined && mid !== undefined) {
    state?.leftBuf?.forEach((id, t) => {
      if (id >= 0) bufferPos.set(id, low + t);
    });
    state?.rightBuf?.forEach((id, u) => {
      if (id >= 0) bufferPos.set(id, mid + 1 + u);
    });
  }

  // Floor tiles: one per group between cuts
  const sortedCuts = [...cuts].sort((a, b) => a - b);
  const starts = [0, ...sortedCuts.map((c) => c + 1)];
  const ends = [...sortedCuts, n - 1];

  const merging =
    state?.phase === "merge" &&
    low !== undefined &&
    high !== undefined &&
    event?.type !== "MARK_SORTED";
  const isSplit = event?.type === "SPLIT";
  const allSorted = sortedIndices.size >= n;

  const stageWidth = layout.width + (n - 1) * GAP;

  return (
    <Stage width={stageWidth} height={14} lookY={5} autoRotate={autoRotate}>
      {/* Group tiles */}
      {starts.map((start, s) => {
        const end = ends[s];
        return (
          <GlideBox
            key={`seg-${start}`}
            targetX={(xAt(start) + xAt(end)) / 2}
            width={(end - start + 1) * layout.slot}
            y={-0.18}
            height={0.3}
            depth={layout.barDepth + 1}
            color="#4338ca"
            opacity={0.38}
            emissive={0.4}
          />
        );
      })}

      {/* The range currently being merged */}
      {merging && (
        <GlideBox
          key="merge-range"
          targetX={(xAt(low as number) + xAt(high as number)) / 2}
          width={xAt(high as number) - xAt(low as number) + layout.slot}
          y={-0.12}
          height={0.32}
          depth={layout.barDepth + 1.4}
          color="#8b5cf6"
          opacity={0.5}
          emissive={0.8}
        />
      )}

      {allSorted && (
        <GlideBox
          key="done"
          targetX={0}
          width={n * layout.slot}
          y={-0.1}
          height={0.34}
          depth={layout.barDepth + 1.2}
          color="#10b981"
          opacity={0.55}
          emissive={0.7}
        />
      )}

      {originalArray.map((value, id) => {
        const bufPos = bufferPos.get(id);
        const inBuffer = bufPos !== undefined;
        const pos = inBuffer ? bufPos : positions[id];

        let color = "#6366f1";
        if (!inBuffer && sortedIndices.has(pos)) {
          color = "#10b981";
        } else if (
          event?.type === "COMPARE" &&
          (id === state?.aId || id === state?.bId)
        ) {
          color = "#fbbf24";
        } else if (event?.type === "OVERWRITE" && id === state?.placedId) {
          color = "#a78bfa";
        } else if (
          isSplit &&
          low !== undefined &&
          high !== undefined &&
          pos >= low &&
          pos <= high
        ) {
          color = "#8b5cf6";
        } else if (inBuffer) {
          color = "#8b8ff5";
        }

        const active =
          (event?.type === "COMPARE" &&
            (id === state?.aId || id === state?.bId)) ||
          (event?.type === "OVERWRITE" && id === state?.placedId);

        return (
          <Bar3D
            key={id}
            targetX={xAt(pos)}
            targetY={inBuffer ? BUFFER_Y : 0}
            targetZ={inBuffer ? BUFFER_Z : 0}
            height={barHeight(value, maxVal)}
            width={layout.barWidth}
            depth={layout.barDepth}
            color={color}
            active={active}
            label={String(value)}
          />
        );
      })}
    </Stage>
  );
}
