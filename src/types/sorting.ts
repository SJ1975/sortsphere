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
  | 'SPLIT'
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

// Extra info an algorithm can attach to a frame so a 3D scene
// can show HOW the algorithm is working (pointers, held element, etc.)
export interface SortState {
  phase?: 'divide' | 'merge' | 'build' | 'extract';
  pass?: number;       // bubble: current pass
  i?: number;
  j?: number;
  keyId?: number;      // insertion: id of the element lifted out of the row
  hole?: number;       // insertion: position the lifted element will drop into
  minIndex?: number;
  minId?: number;
  pivotIndex?: number;
  pivotId?: number;
  low?: number;
  mid?: number;
  high?: number;
  heapSize?: number;
  //merge sort
  cuts?: number[];
  leftBuf?: number[];
  rightBuf?: number[];
  aId?: number;
  bId?: number;
  placedId?: number;
}

export interface SortFrame {
  array: number[];
  event: SortEvent;
  metrics: SortMetrics;
  ids?: number[];      // ids[position] = which original element sits there
  state?: SortState;
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