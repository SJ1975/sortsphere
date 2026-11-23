import { AlgorithmKey } from '@/types/sorting';

// Max array size at which each algorithm's own 3D scene stays readable.
// Heap is 15 because 15 nodes fill a 4-level tree exactly.
export const MAX_3D_SIZE: Partial<Record<AlgorithmKey, number>> = {
  bubble: 30,
  insertion: 30,
  selection: 30,
  quick: 24,
  merge: 16,
  heap: 15,
};

export function getMax3DSize(algorithm: string): number | undefined {
  return MAX_3D_SIZE[algorithm as AlgorithmKey];
}