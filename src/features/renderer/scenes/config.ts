import { AlgorithmKey } from '@/types/sorting';

// Max array size at which each algorithm's own 3D scene stays readable.
// Algorithms not listed here still use the generic 3D scene (no cap).
// Later phases add selection, quick, merge and heap here.
export const MAX_3D_SIZE: Partial<Record<AlgorithmKey, number>> = {
  bubble: 30,
  insertion: 30,
};

export function getMax3DSize(algorithm: string): number | undefined {
  return MAX_3D_SIZE[algorithm as AlgorithmKey];
}