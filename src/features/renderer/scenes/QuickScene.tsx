"use client";

import { useMemo } from "react";
import { Stage } from "./shared/Stage";
import { Bar3D } from "./shared/Bar3D";
import { GlideBox } from "./shared/GlideBox";
import { SceneProps } from "./shared/types";
import {
  MAX_BAR_HEIGHT,
  barHeight,
  getIds,
  makeLayout,
  positionsOf,
} from "./shared/layout";
import { getBarColor } from "../config/materials";

const PIVOT_COLOR = "#22d3ee";
const DIM_COLOR = "#2a2a63";

export function QuickScene({
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

  const range =
    state?.low !== undefined && state?.high !== undefined
      ? { low: state.low, high: state.high }
      : null;

  const pivotId = state?.pivotId;
  const pivotH =
    pivotId !== undefined ? barHeight(originalArray[pivotId], maxVal) : 0;
  const zoneEnd = state?.i;
  const scanIndex = event?.type === "COMPARE" ? state?.j : undefined;

  const rangeCenter = range
    ? (layout.xOf(range.low) + layout.xOf(range.high)) / 2
    : 0;
  const rangeWidth = range ? (range.high - range.low + 1) * layout.slot : 0;

  return (
    <Stage width={layout.width} autoRotate={autoRotate}>
      {/* Floor tile for the current sub-problem */}
      {range && (
        <GlideBox
          targetX={rangeCenter}
          width={rangeWidth}
          y={-0.18}
          height={0.3}
          depth={layout.barDepth + 1}
          color="#6366f1"
          opacity={0.4}
          emissive={0.5}
        />
      )}

      {/* Strip for the "≤ pivot" zone */}
      {range && zoneEnd !== undefined && zoneEnd >= range.low && (
        <GlideBox
          targetX={(layout.xOf(range.low) + layout.xOf(zoneEnd)) / 2}
          width={(zoneEnd - range.low + 1) * layout.slot}
          y={0.02}
          height={0.12}
          depth={layout.barDepth + 1.1}
          color={PIVOT_COLOR}
          opacity={0.55}
          emissive={1}
        />
      )}

      {/* Pivot height line: below = smaller, above = larger */}
      {range && pivotId !== undefined && (
        <GlideBox
          targetX={rangeCenter}
          width={rangeWidth}
          y={pivotH}
          height={0.06}
          depth={layout.barDepth + 1.2}
          color={PIVOT_COLOR}
          opacity={0.5}
          emissive={1.2}
        />
      )}

      {/* Scan beam */}
      {scanIndex !== undefined && (
        <GlideBox
          targetX={layout.xOf(scanIndex)}
          width={layout.slot * 0.92}
          y={(MAX_BAR_HEIGHT + 1.5) / 2 - 0.2}
          height={MAX_BAR_HEIGHT + 1.5}
          depth={layout.barDepth + 1.2}
          color="#fbbf24"
          opacity={0.08}
          emissive={0.4}
          edges
        />
      )}

      {originalArray.map((value, id) => {
        const index = positions[id];
        const isSorted = sortedIndices.has(index);
        const isPivot = pivotId === id && !isSorted;
        const outside =
          range !== null && (index < range.low || index > range.high);

        let color = getBarColor(index, event, sortedIndices);
        if (!isSorted && outside) color = DIM_COLOR;
        if (isPivot) color = PIVOT_COLOR;

        return (
          <Bar3D
            key={id}
            targetX={layout.xOf(index)}
            height={barHeight(value, maxVal)}
            width={layout.barWidth}
            depth={layout.barDepth}
            color={color}
            active={isPivot || (!!event && event.indices.includes(index))}
            label={n <= 30 ? String(value) : undefined}
          />
        );
      })}
    </Stage>
  );
}
