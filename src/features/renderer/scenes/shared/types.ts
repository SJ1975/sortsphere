import { SortFrame } from '@/types/sorting';

export interface SceneProps {
  frame: SortFrame | undefined;
  originalArray: number[];
  sortedIndices: Set<number>;
  autoRotate?: boolean;
}