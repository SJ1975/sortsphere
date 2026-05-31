'use client';

import { useCallback, useEffect } from 'react';
import { useSortingStore, useVisualizationStore, usePreferencesStore } from '@/store';
import { AlgorithmKey } from '@/types/sorting';
import { SortingEngine } from '@/features/sorting/engine';
import { MIN_ARRAY_SIZE, MAX_ARRAY_SIZE } from '@/lib/constants';

export function useSortingEngine() {
  const sorting = useSortingStore();
  const visualization = useVisualizationStore();
  const preferences = usePreferencesStore();

  // Current frame being displayed
  const currentFrame = sorting.frames[visualization.currentFrameIndex];
  const totalFrames = sorting.frames.length;
  const isFinished = visualization.currentFrameIndex >= totalFrames - 1;

  // ── Start or resume playback ──
  const handlePlay = useCallback(() => {
    if (isFinished) {
      // If already at end, reset first then play
      visualization.reset();
    }
    visualization.play(totalFrames, () => {
      // Called when animation finishes
      console.log('Animation complete');
    });
  }, [isFinished, totalFrames, visualization]);

  // ── Pause playback ──
  const handlePause = useCallback(() => {
    visualization.pause();
  }, [visualization]);

  // ── Reset to beginning ──
  const handleReset = useCallback(() => {
    visualization.reset();
  }, [visualization]);

  // ── Generate a new random array ──
  const handleRandomize = useCallback(() => {
    visualization.reset();
    sorting.generateNewArray();
  }, [visualization, sorting]);

  // ── Change algorithm ──
  const handleAlgorithmChange = useCallback(
    (algorithm: AlgorithmKey) => {
      visualization.reset();
      sorting.setAlgorithm(algorithm);
      preferences.setLastAlgorithm(algorithm);
    },
    [visualization, sorting, preferences]
  );

  // ── Change array size ──
  const handleSizeChange = useCallback(
    (size: number) => {
      const clampedSize = Math.min(MAX_ARRAY_SIZE, Math.max(MIN_ARRAY_SIZE, size));
      visualization.reset();
      sorting.setArraySize(clampedSize);
    },
    [visualization, sorting]
  );

  // ── Handle custom array input ──
  const handleCustomInput = useCallback(
    (input: string) => {
      const parsed = SortingEngine.parseCustomInput(input, MAX_ARRAY_SIZE);
      if (parsed) {
        visualization.reset();
        sorting.setCustomArray(parsed);
      }
      return parsed !== null; // Return true if input was valid
    },
    [visualization, sorting]
  );

  // Cleanup: stop animation if component unmounts
  useEffect(() => {
    return () => {
      visualization.pause();
    };
  }, [visualization]);

  return {
    // State
    algorithm: sorting.algorithm,
    frames: sorting.frames,
    currentFrame,
    currentFrameIndex: visualization.currentFrameIndex,
    totalFrames,
    isPlaying: visualization.isPlaying,
    isFinished,
    speed: visualization.speed,
    arraySize: sorting.arraySize,
    originalArray: sorting.originalArray,

    // Playback actions
    handlePlay,
    handlePause,
    handleReset,
    handleRandomize,

    // Configuration actions
    handleAlgorithmChange,
    handleSizeChange,
    handleCustomInput,
    setSpeed: visualization.setSpeed,
    seek: visualization.seek,
  };
}