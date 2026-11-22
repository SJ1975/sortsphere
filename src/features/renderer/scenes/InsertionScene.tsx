"use client";

import { useMemo } from "react";
import { Stage } from "./shared/Stage";
import { Bar3D } from "./shared/Bar3D";
import { GlideBox } from "./shared/GlideBox";
import { SceneProps } from "./shared/types";
import { barHeight, getIds, makeLayout, positionsOf } from "./shared/layout";
import { getBarColor } from "../config/materials";

export function InsertionScene({
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
  const keyId = frame?.state?.keyId;
  const hole = frame?.state?.hole;
  const holding = keyId !== undefined && hole !== undefined;

  // Sorted "hand" platform on the left
  const sortedList = Array.from(sortedIndices).filter((i) => i < n);
  const zoneEnd = sortedList.length ? Math.max(...sortedList) : 0;

  return (
    <Stage width={layout.width} autoRotate={autoRotate}>
      {/* Sorted hand */}
      {sortedList.length > 0 && (
        <GlideBox
          targetX={(layout.xOf(0) + layout.xOf(zoneEnd)) / 2}
          width={(zoneEnd + 1) * layout.slot}
          y={-0.18}
          height={0.3}
          depth={layout.barDepth + 1}
          color="#10b981"
          opacity={0.55}
          emissive={0.6}
        />
      )}

      {/* Gap marker where the lifted element will drop */}
      {holding && (
        <GlideBox
          targetX={layout.xOf(hole)}
          width={layout.slot * 0.92}
          y={-0.02}
          height={0.06}
          depth={layout.barDepth + 0.6}
          color="#fbbf24"
          opacity={0.25}
          emissive={1.2}
          edges
        />
      )}

      {originalArray.map((value, id) => {
        const isKey = holding && keyId === id;
        const index = isKey ? (hole as number) : positions[id];

        return (
          <Bar3D
            key={id}
            targetX={layout.xOf(index)}
            // The held element is pulled out of the row, toward the viewer
            targetY={isKey ? 1.4 : 0}
            targetZ={isKey ? 2.6 : 0}
            height={barHeight(value, maxVal)}
            width={layout.barWidth}
            depth={layout.barDepth}
            color={isKey ? "#fbbf24" : getBarColor(index, event, sortedIndices)}
            active={isKey || (!!event && event.indices.includes(index))}
            label={n <= 30 ? String(value) : undefined}
          />
        );
      })}
    </Stage>
  );
}
