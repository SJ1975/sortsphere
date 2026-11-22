import { SortFrame, AlgorithmKey, SortAlgorithm } from '@/types/sorting';
import { bubbleSort } from '../algorithms/bubble';
import { selectionSort } from '../algorithms/selection';
import { insertionSort } from '../algorithms/insertion';
import { mergeSort } from '../algorithms/merge';
import { quickSort } from '../algorithms/quick';
import { heapSort } from '../algorithms/heap';

const ALGORITHM_REGISTRY: Record<AlgorithmKey, SortAlgorithm> = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
  merge: mergeSort,
  quick: quickSort,
  heap: heapSort,
};

export class SortingEngine {
  static generateFrames(algorithm: AlgorithmKey, array: number[]): SortFrame[] {
    const fn = ALGORITHM_REGISTRY[algorithm];
    if (!fn) throw new Error(`Unknown algorithm: ${algorithm}`);
    const frames = fn([...array]);
    return SortingEngine.attachIds(algorithm, frames, array.length);
  }

  // Algorithms that already provide ids (bubble, insertion) are left alone.
  // For swap-only algorithms we derive ids by replaying the SWAP events.
  // Merge sort overwrites values instead of swapping, so it is skipped.
  private static attachIds(
    algorithm: AlgorithmKey,
    frames: SortFrame[],
    n: number
  ): SortFrame[] {
    if (algorithm === 'merge') return frames;
    if (frames.length === 0 || frames[0].ids) return frames;

    const ids = Array.from({ length: n }, (_, i) => i);
    return frames.map((frame) => {
      if (frame.event.type === 'SWAP' && frame.event.indices.length === 2) {
        const [a, b] = frame.event.indices;
        [ids[a], ids[b]] = [ids[b], ids[a]];
      }
      return { ...frame, ids: [...ids] };
    });
  }

  static generateArray(size: number, min = 5, max = 100): number[] {
    return Array.from(
      { length: size },
      () => Math.floor(Math.random() * (max - min + 1)) + min
    );
  }

  static parseCustomInput(input: string, maxSize: number): number[] | null {
    try {
      const values = input
        .split(',')
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !isNaN(n) && n >= 1 && n <= 999);

      if (values.length < 2) return null;
      return values.slice(0, maxSize);
    } catch {
      return null;
    }
  }

  static getAlgorithmKeys(): AlgorithmKey[] {
    return Object.keys(ALGORITHM_REGISTRY) as AlgorithmKey[];
  }
}