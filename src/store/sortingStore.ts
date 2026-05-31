import { create } from 'zustand';
import { AlgorithmKey, SortFrame } from '@/types/sorting';
import { SortingEngine } from '@/features/sorting/engine';
import { DEFAULT_ARRAY_SIZE } from '@/lib/constants';

interface SortingState {
  // Current state
  algorithm: AlgorithmKey;
  frames: SortFrame[];
  originalArray: number[];
  arraySize: number;
  isGenerating: boolean;  // True while computing frames (future: web worker)

  // Actions - functions that change state
  setAlgorithm: (algorithm: AlgorithmKey) => void;
  setArraySize: (size: number) => void;
  generateNewArray: () => void;
  setCustomArray: (array: number[]) => void;
  generateFrames: () => void;
}

export const useSortingStore = create<SortingState>((set, get) => {
  // Generate initial array on store creation
  const initialArray = SortingEngine.generateArray(DEFAULT_ARRAY_SIZE);
  const initialFrames = SortingEngine.generateFrames('bubble', initialArray);

  return {
    // Initial values
    algorithm: 'bubble',
    frames: initialFrames,
    originalArray: initialArray,
    arraySize: DEFAULT_ARRAY_SIZE,
    isGenerating: false,

    // Change which algorithm is selected
    setAlgorithm: (algorithm) => {
      const { originalArray } = get();
      const frames = SortingEngine.generateFrames(algorithm, originalArray);
      set({ algorithm, frames });
    },

    // Change how many bars are shown
    setArraySize: (size) => {
      const newArray = SortingEngine.generateArray(size);
      const { algorithm } = get();
      const frames = SortingEngine.generateFrames(algorithm, newArray);
      set({ arraySize: size, originalArray: newArray, frames });
    },

    // Shuffle and generate a fresh random array
    generateNewArray: () => {
      const { arraySize, algorithm } = get();
      const newArray = SortingEngine.generateArray(arraySize);
      const frames = SortingEngine.generateFrames(algorithm, newArray);
      set({ originalArray: newArray, frames });
    },

    // Use a custom array typed by the user
    setCustomArray: (array) => {
      const { algorithm } = get();
      const frames = SortingEngine.generateFrames(algorithm, array);
      set({
        originalArray: array,
        arraySize: array.length,
        frames,
      });
    },

    // Regenerate frames for current array + algorithm
    generateFrames: () => {
      const { algorithm, originalArray } = get();
      set({ isGenerating: true });
      const frames = SortingEngine.generateFrames(algorithm, originalArray);
      set({ frames, isGenerating: false });
    },
  };
});