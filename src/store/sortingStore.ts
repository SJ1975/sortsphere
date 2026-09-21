import { create } from 'zustand';
import { AlgorithmKey, SortFrame } from '@/types/sorting';
import { SortingEngine } from '@/features/sorting/engine';
import { DEFAULT_ARRAY_SIZE } from '@/lib/constants';

interface SortingState {
  algorithm: AlgorithmKey;
  frames: SortFrame[];
  originalArray: number[];
  arraySize: number;
  isGenerating: boolean;

  setAlgorithm: (algorithm: AlgorithmKey) => void;
  setArraySize: (size: number) => void;
  generateNewArray: () => void;
  setCustomArray: (array: number[]) => void;
  generateFrames: () => void;
}

// Deterministic initial array — same on server and client
// Avoids hydration mismatch from Math.random()
function makeInitialArray(size: number): number[] {
  return Array.from({ length: size }, (_, i) =>
    Math.round(((i + 1) / size) * 90 + 5)
  );
}

export const useSortingStore = create<SortingState>((set, get) => {
  const initialArray = makeInitialArray(DEFAULT_ARRAY_SIZE);
  const initialFrames = SortingEngine.generateFrames('bubble', initialArray);

  return {
    algorithm: 'bubble',
    frames: initialFrames,
    originalArray: initialArray,
    arraySize: DEFAULT_ARRAY_SIZE,
    isGenerating: false,

    setAlgorithm: (algorithm) => {
      const { originalArray } = get();
      const frames = SortingEngine.generateFrames(algorithm, originalArray);
      set({ algorithm, frames });
    },

    setArraySize: (size) => {
      const newArray = SortingEngine.generateArray(size);
      const { algorithm } = get();
      const frames = SortingEngine.generateFrames(algorithm, newArray);
      set({ arraySize: size, originalArray: newArray, frames });
    },

    generateNewArray: () => {
      const { arraySize, algorithm } = get();
      const newArray = SortingEngine.generateArray(arraySize);
      const frames = SortingEngine.generateFrames(algorithm, newArray);
      set({ originalArray: newArray, frames });
    },

    setCustomArray: (array) => {
      const { algorithm } = get();
      const frames = SortingEngine.generateFrames(algorithm, array);
      set({ originalArray: array, arraySize: array.length, frames });
    },

    generateFrames: () => {
      const { algorithm, originalArray } = get();
      set({ isGenerating: true });
      const frames = SortingEngine.generateFrames(algorithm, originalArray);
      set({ frames, isGenerating: false });
    },
  };
});