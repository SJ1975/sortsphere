"use client";

import { useMemo } from "react";
import { Line } from "@react-three/drei";
import { Stage } from "./shared/Stage";
import { Bar3D } from "./shared/Bar3D";
import { GlideBox } from "./shared/GlideBox";
import { Node3D } from "./shared/Node3D";
import { SceneProps } from "./shared/types";
import { getIds, makeLayout, positionsOf } from "./shared/layout";
import { getBarColor } from "../config/materials";

const BAR_MAX = 5; // bars stay short so the tree has room above them
const LEVEL_H = 2.3;
const TREE_Z = -6;
const BASE_Y = 8.2; // height of the deepest tree level

export function HeapScene({
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
  const heapSize = frame?.state?.heapSize ?? n;

  const levels = 32 - Math.clz32(Math.max(n, 1)); // number of tree levels
  const treeWidth = Math.min(layout.width, 30);

  // Position of heap index i inside the tree
  const treeSlot = (index: number) => {
    const level = 31 - Math.clz32(index + 1);
    const slots = 2 ** level;
    const k = index - (slots - 1);
    return {
      x: ((k + 0.5) / slots - 0.5) * treeWidth,
      y: BASE_Y + (levels - 1 - level) * LEVEL_H,
    };
  };

  const viewHeight = BASE_Y + (levels - 1) * LEVEL_H + 2.5;

  const barH = (v: number) => Math.max((v / maxVal) * BAR_MAX, 0.2);
  const radiusOf = (v: number) => 0.38 + 0.5 * (v / maxVal);

  const sortedList = Array.from(sortedIndices).filter((i) => i < n);

  // Edges between each heap node and its parent
  const edges = [];
  for (let c = 1; c < heapSize; c++) {
    const p = (c - 1) >> 1;
    const a = treeSlot(p);
    const b = treeSlot(c);
    const lit =
      !!event &&
      (event.type === "COMPARE" || event.type === "SWAP") &&
      event.indices.includes(c) &&
      event.indices.includes(p);
    edges.push(
      <Line
        key={`edge-${c}`}
        points={[
          [a.x, a.y, TREE_Z],
          [b.x, b.y, TREE_Z],
        ]}
        color={
          lit ? (event?.type === "SWAP" ? "#f43f5e" : "#fbbf24") : "#3a3a8a"
        }
        lineWidth={lit ? 3 : 1.5}
      />,
    );
  }

  return (
    <Stage
      width={layout.width}
      height={viewHeight}
      lookY={viewHeight * 0.45}
      autoRotate={autoRotate}
    >
      {/* Sorted zone on the right of the row */}
      {sortedList.length > 0 && (
        <GlideBox
          targetX={
            (layout.xOf(Math.min(...sortedList)) +
              layout.xOf(Math.max(...sortedList))) /
            2
          }
          width={
            (Math.max(...sortedList) - Math.min(...sortedList) + 1) *
            layout.slot
          }
          y={-0.18}
          height={0.3}
          depth={layout.barDepth + 1}
          color="#10b981"
          opacity={0.55}
          emissive={0.6}
        />
      )}

      {edges}

      {/* Tree nodes: one per element, they move when values swap */}
      {originalArray.map((value, id) => {
        const pos = positions[id];
        const slot = treeSlot(pos);
        return (
          <Node3D
            key={`node-${id}`}
            targetX={slot.x}
            targetY={slot.y}
            targetZ={TREE_Z}
            radius={radiusOf(value)}
            color={getBarColor(pos, event, sortedIndices)}
            active={!!event && event.indices.includes(pos)}
            visible={pos < heapSize}
            label={String(value)}
          />
        );
      })}

      {/* Bars: the same data as an array */}
      {originalArray.map((value, id) => {
        const pos = positions[id];
        return (
          <Bar3D
            key={`bar-${id}`}
            targetX={layout.xOf(pos)}
            height={barH(value)}
            width={layout.barWidth}
            depth={layout.barDepth}
            color={getBarColor(pos, event, sortedIndices)}
            active={!!event && event.indices.includes(pos)}
            label={String(value)}
          />
        );
      })}
    </Stage>
  );
}
