//Rulebook

// SORT EVENT TYPES
// Each event type maps to a color in the renderer:
//   COMPARE    → yellow  (looking at two elements)
//   SWAP       → red     (swapping two elements)
//   OVERWRITE  → purple  (writing a value - used in merge sort)
//   MARK_SORTED→ green   (element is in its final position)
//   PARTITION  → cyan    (pivot element in quick sort)
//   MERGE      → blue    (merge range highlight)
//   RESET      → default (clear all highlights)


export type SortEventType =
  | 'COMPARE'
  | 'SWAP'
  | 'OVERWRITE'
  | 'MARK_SORTED'
  | 'PARTITION'
  | 'MERGE'
  | 'RESET';


export interface SortEvent {
  type: SortEventType;
  indices: number[];           // Which positions are affected
  values?: number[];           // What values are at those positions
  metadata?: {
    pivotIndex?: number;       // For quick sort pivot
    mergeRange?: [number, number]; // For merge sort range
    label?: string;            // Optional debug label
  };
}

// Tracks algorithm performance metrics
export interface SortMetrics {
  comparisons: number;         // How many times we compared two elements
  swaps: number;               // How many times we swapped/wrote elements
}


export interface SortFrame {
  array: number[];             // Full array state at this moment
  event: SortEvent;            // What happened to produce this state
  metrics: SortMetrics;        // Running totals at this moment
}

// Sorting algorithms
export type AlgorithmKey =
  | 'bubble'
  | 'selection'
  | 'insertion'
  | 'merge'
  | 'quick'
  | 'heap';

// info for each algorithm
export interface AlgorithmInfo {
  key: AlgorithmKey;
  name: string;
  description: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  stable: boolean;             // Does it preserve order of equal elements?
  inPlace: boolean;            // Does it sort without extra memory?
}


// Input: array of numbers
// Output: array of frames
export type SortAlgorithm = (array: number[]) => SortFrame[];