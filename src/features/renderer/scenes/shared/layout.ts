import { SortFrame } from '@/types/sorting';

export const MAX_SCENE_WIDTH = 34;
export const MAX_BAR_HEIGHT = 9;

export interface SceneLayout {
  n: number;
  width: number;
  slot: number;
  barWidth: number;
  barDepth: number;
  xOf: (index: number) => number;
}

export function makeLayout(n: number): SceneLayout {
  const count = Math.max(n, 1);
  // Small arrays get a narrower stage so bars don't look lost
  const width = Math.min(MAX_SCENE_WIDTH, count * 2.4);
  const slot = width / count;
  const barWidth = Math.min(Math.max(slot * 0.72, 0.15), 1.6);
  const barDepth = Math.min(Math.max(barWidth, 0.6), 1.6);
  const startX = -width / 2 + slot / 2;

  return {
    n: count,
    width,
    slot,
    barWidth,
    barDepth,
    xOf: (index: number) => startX + index * slot,
  };
}

// ids[position] = element id. Falls back to identity if the frame has none.
export function getIds(
  frame: SortFrame | undefined,
  originalArray: number[]
): number[] {
  if (frame?.ids && frame.ids.length === originalArray.length) return frame.ids;
  return originalArray.map((_, i) => i);
}

// Inverse of ids: positions[id] = position.
// If an id appears twice (insertion sort's temporary gap), the later
// position wins, which is where the element actually is.
export function positionsOf(ids: number[]): number[] {
  const positions = new Array<number>(ids.length).fill(0);
  ids.forEach((id, index) => {
    positions[id] = index;
  });
  return positions;
}

export function barHeight(value: number, maxVal: number): number {
  return Math.max((value / maxVal) * MAX_BAR_HEIGHT, 0.2);
}