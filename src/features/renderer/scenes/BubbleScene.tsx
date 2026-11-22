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

export function BubbleScene({
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

  // The pair under the glass lens
  const pair =
    event &&
    (event.type === "COMPARE" || event.type === "SWAP") &&
    event.indices.length === 2
      ? event
      : null;

  // Sorted wall on the right
  const sortedList = Array.from(sortedIndices).filter((i) => i < n);
  const zoneStart = sortedList.length ? Math.min(...sortedList) : 0;
  const zoneEnd = sortedList.length ? Math.max(...sortedList) : 0;

  return (
    <Stage width={layout.width} autoRotate={autoRotate}>
      {/* Sorted wall */}
      {sortedList.length > 0 && (
        <GlideBox
          targetX={(layout.xOf(zoneStart) + layout.xOf(zoneEnd)) / 2}
          width={(zoneEnd - zoneStart + 1) * layout.slot}
          y={-0.18}
          height={0.3}
          depth={layout.barDepth + 1}
          color="#10b981"
          opacity={0.55}
          emissive={0.6}
        />
      )}

      {/* Glass lens around the pair being compared */}
      {pair && (
        <GlideBox
          targetX={
            (layout.xOf(pair.indices[0]) + layout.xOf(pair.indices[1])) / 2
          }
          width={layout.slot * 2}
          y={(MAX_BAR_HEIGHT + 1.5) / 2 - 0.2}
          height={MAX_BAR_HEIGHT + 1.5}
          depth={layout.barDepth + 1.4}
          color={pair.type === "SWAP" ? "#f43f5e" : "#fbbf24"}
          opacity={0.08}
          emissive={0.4}
          edges
        />
      )}

      {/* Bars — each is a persistent object that moves to its position */}
      {originalArray.map((value, id) => {
        const index = positions[id];
        return (
          <Bar3D
            key={id}
            targetX={layout.xOf(index)}
            height={barHeight(value, maxVal)}
            width={layout.barWidth}
            depth={layout.barDepth}
            color={getBarColor(index, event, sortedIndices)}
            active={!!pair && pair.indices.includes(index)}
            label={n <= 30 ? String(value) : undefined}
          />
        );
      })}
    </Stage>
  );
}
