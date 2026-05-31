import { create } from 'zustand';
import { SPEED_MULTIPLIERS, BASE_DELAY_MS } from '@/lib/constants';

type SpeedMultiplier = typeof SPEED_MULTIPLIERS[number];

interface VisualizationState {
  currentFrameIndex: number;
  isPlaying: boolean;
  speed: SpeedMultiplier;
  intervalId: ReturnType<typeof setInterval> | null;

  play: (totalFrames: number, onFinish: () => void) => void;
  pause: () => void;
  reset: () => void;
  seek: (index: number) => void;
  nextFrame: () => void;
  prevFrame: () => void;
  setSpeed: (speed: SpeedMultiplier) => void;
}

export const useVisualizationStore = create<VisualizationState>((set, get) => ({
  currentFrameIndex: 0,
  isPlaying: false,
  speed: 1,
  intervalId: null,

  play: (totalFrames, onFinish) => {
    // Clear any existing interval first
    const existing = get().intervalId;
    if (existing) clearInterval(existing);

    const delay = BASE_DELAY_MS / get().speed;

    const id = setInterval(() => {
      const state = get();

      if (state.currentFrameIndex >= totalFrames - 1) {
        clearInterval(id);
        set({ isPlaying: false, intervalId: null });
        onFinish();
        return;
      }

      set((s) => ({ currentFrameIndex: s.currentFrameIndex + 1 }));
    }, delay);

    set({ isPlaying: true, intervalId: id });
  },

  pause: () => {
    const { intervalId } = get();
    if (intervalId) clearInterval(intervalId);
    set({ isPlaying: false, intervalId: null });
  },

  reset: () => {
    const { intervalId } = get();
    if (intervalId) clearInterval(intervalId);
    set({ currentFrameIndex: 0, isPlaying: false, intervalId: null });
  },

  seek: (index) => {
    const { intervalId } = get();
    if (intervalId) clearInterval(intervalId);
    set({ currentFrameIndex: index, isPlaying: false, intervalId: null });
  },

  nextFrame: () => {
    set((s) => ({ currentFrameIndex: s.currentFrameIndex + 1 }));
  },

  prevFrame: () => {
    set((s) => ({
      currentFrameIndex: Math.max(0, s.currentFrameIndex - 1),
    }));
  },

  setSpeed: (speed) => {
    const { intervalId } = get();
    if (intervalId) clearInterval(intervalId);
    set({ speed, isPlaying: false, intervalId: null });
  },
}));