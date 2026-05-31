import { SortFrame, AlgorithmKey, SortAlgorithm } from '@/types/sorting';
import { bubbleSort } from '../algorithms/bubble';
import { selectionSort } from '../algorithms/selection';
import { insertionSort } from '../algorithms/insertion';
import { mergeSort } from '../algorithms/merge';
import { quickSort } from '../algorithms/quick';
import { heapSort } from '../algorithms/heap';

// Registry maps algorithm keys to their functions
// Adding a new algorithm = adding one line here
const ALGORITHM_REGISTRY: Record<AlgorithmKey, SortAlgorithm> = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
  merge: mergeSort,
  quick: quickSort,
  heap: heapSort,
};

export class SortingEngine {

  // Generate all animation frames for a given algorithm + array
  static generateFrames(algorithm: AlgorithmKey, array: number[]): SortFrame[] {
    const fn = ALGORITHM_REGISTRY[algorithm];
    if (!fn) throw new Error(`Unknown algorithm: ${algorithm}`);
    return fn([...array]); // Pass a copy - algorithms must not mutate input
  }

  // Generate a random array of given size
  static generateArray(size: number, min = 5, max = 100): number[] {
    return Array.from(
      { length: size },
      () => Math.floor(Math.random() * (max - min + 1)) + min
    );
  }

  // Parse user input like "5, 3, 8, 1, 9" into [5, 3, 8, 1, 9]
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

  // Get all registered algorithm keys
  static getAlgorithmKeys(): AlgorithmKey[] {
    return Object.keys(ALGORITHM_REGISTRY) as AlgorithmKey[];
  }
}