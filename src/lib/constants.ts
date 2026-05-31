import { AlgorithmInfo, AlgorithmKey } from '@/types/sorting';

export const ALGORITHM_INFO: Record<AlgorithmKey, AlgorithmInfo> = {
  bubble: {
    key: 'bubble',
    name: 'Bubble Sort',
    description:
      'Repeatedly steps through the list comparing adjacent elements and swapping them if out of order. Simple but slow — each pass bubbles the largest unseen value to its final position.',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: true,
    inPlace: true,
  },
  selection: {
    key: 'selection',
    name: 'Selection Sort',
    description:
      'Scans the unsorted portion for the minimum element, then places it at the boundary. Makes exactly n-1 swaps regardless of input — useful when write operations are expensive.',
    timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: false,
    inPlace: true,
  },
  insertion: {
    key: 'insertion',
    name: 'Insertion Sort',
    description:
      'Builds a sorted array one element at a time by inserting each new element into its correct position. Extremely efficient on nearly-sorted data and the algorithm of choice for small arrays.',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: true,
    inPlace: true,
  },
  merge: {
    key: 'merge',
    name: 'Merge Sort',
    description:
      'Divide and conquer: recursively splits the array in half until single elements remain, then merges sorted halves. Guarantees O(n log n) in all cases at the cost of O(n) extra memory.',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
    },
    spaceComplexity: 'O(n)',
    stable: true,
    inPlace: false,
  },
  quick: {
    key: 'quick',
    name: 'Quick Sort',
    description:
      'Selects a pivot, partitions elements smaller to its left and larger to its right, then recurses. Fastest in practice due to excellent cache performance — the backbone of most real-world sort implementations.',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(log n)',
    stable: false,
    inPlace: true,
  },
  heap: {
    key: 'heap',
    name: 'Heap Sort',
    description:
      'Builds a max-heap, then repeatedly extracts the maximum and rebuilds the heap. Guarantees O(n log n) with O(1) space — but poor cache performance makes it slower than Quick Sort in practice.',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
    },
    spaceComplexity: 'O(1)',
    stable: false,
    inPlace: true,
  },
};

export const ALGORITHM_KEYS: AlgorithmKey[] = [
  'bubble',
  'selection',
  'insertion',
  'merge',
  'quick',
  'heap',
];

// Animation timing
export const BASE_DELAY_MS = 300;       // Delay between frames at 1x speed
export const SPEED_MULTIPLIERS = [0.25, 0.5, 1, 2, 4] as const;
export const DEFAULT_SPEED = 1;

// Array defaults
export const DEFAULT_ARRAY_SIZE = 20;
export const MIN_ARRAY_SIZE = 5;
export const MAX_ARRAY_SIZE = 80;