'use client';

import { useMemo } from 'react';
import { Stage } from './shared/Stage';
import { Bar3D } from './shared/Bar3D';
import { GlideBox } from './shared/GlideBox';
import { Marker3D } from './shared/Marker3D';
import { SceneProps } from './shared/types';
"use client";

import { useMemo } from "react";
import { Stage } from "./shared/Stage";
import { Bar3D } from "./shared/Bar3D";
import { GlideBox } from "./shared/GlideBox";
import { Marker3D } from "./shared/Marker3D";
import { SceneProps } from "./shared/types";
import {
  MAX_BAR_HEIGHT,
  barHeight,
  getIds,
  makeLayout,
  positionsOf,
} from './shared/layout';
import { getBarColor } from '../config/materials';

const MIN_COLOR = '#22d3ee';
} from "./shared/layout";
import { getBarColor } from "../config/materials";

const MIN_COLOR = "#22d3ee";

export function SelectionScene({
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

  const minId = state?.minId;
  const scanIndex = event?.type === 'COMPARE' ? state?.j : undefined;
  const scanIndex = event?.type === "COMPARE" ? state?.j : undefined;

  const sortedList = Array.from(sortedIndices).filter((i) => i < n);
  const zoneEnd = sortedList.length ? Math.max(...sortedList) : -1;

  const flagY =
    minId !== undefined
      ? barHeight(originalArray[minId], maxVal) + 1.7
      : 0;
    minId !== undefined ? barHeight(originalArray[minId], maxVal) + 1.7 : 0;

  return (
    <Stage width={layout.width} autoRotate={autoRotate}>
      {/* Sorted zone grows from the left */}
      {zoneEnd >= 0 && (
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

      {/* Flag over the smallest value found so far */}
      {minId !== undefined && !sortedIndices.has(positions[minId]) && (
        <Marker3D
          targetX={layout.xOf(positions[minId])}
          targetY={flagY}
          color={MIN_COLOR}
        />
      )}

      {originalArray.map((value, id) => {
        const index = positions[id];
        const isMin = minId === id && !sortedIndices.has(index);
        const color = isMin ? MIN_COLOR : getBarColor(index, event, sortedIndices);
        const color = isMin
          ? MIN_COLOR
          : getBarColor(index, event, sortedIndices);
        const scanned = scanIndex !== undefined && index === scanIndex;

        return (
          <Bar3D
            key={id}
            targetX={layout.xOf(index)}
            height={barHeight(value, maxVal)}
            width={layout.barWidth}
            depth={layout.barDepth}
            color={color}
            active={isMin || scanned}
            label={n <= 30 ? String(value) : undefined}
          />
        );
      })}
    </Stage>
  );
}
}
