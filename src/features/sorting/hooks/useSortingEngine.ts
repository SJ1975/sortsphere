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

  const currentFrame = sorting.frames[visualization.currentFrameIndex];
  const totalFrames = sorting.frames.length;
  const isFinished = visualization.currentFrameIndex >= totalFrames - 1;

  const handlePlay = useCallback(() => {
    if (isFinished) {
      useVisualizationStore.getState().reset();
    }
    useVisualizationStore.getState().play(
      useSortingStore.getState().frames.length,
      () => { console.log('Animation complete'); }
    );
  }, [isFinished]);

  const handlePause = useCallback(() => {
    useVisualizationStore.getState().pause();
  }, []);

  const handleReset = useCallback(() => {
    useVisualizationStore.getState().reset();
  }, []);

  const handleRandomize = useCallback(() => {
    useVisualizationStore.getState().reset();
    useSortingStore.getState().generateNewArray();
  }, []);

  const handleAlgorithmChange = useCallback(
    (algorithm: AlgorithmKey) => {
      useVisualizationStore.getState().reset();
      useSortingStore.getState().setAlgorithm(algorithm);
      usePreferencesStore.getState().setLastAlgorithm(algorithm);
    },
    []
  );

  const handleSizeChange = useCallback((size: number) => {
    const clamped = Math.min(MAX_ARRAY_SIZE, Math.max(MIN_ARRAY_SIZE, size));
    useVisualizationStore.getState().reset();
    useSortingStore.getState().setArraySize(clamped);
  }, []);

  const handleCustomInput = useCallback((input: string) => {
    const parsed = SortingEngine.parseCustomInput(input, MAX_ARRAY_SIZE);
    if (parsed) {
      useVisualizationStore.getState().reset();
      useSortingStore.getState().setCustomArray(parsed);
    }
    return parsed !== null;
  }, []);

  // Cleanup on unmount only — empty deps prevents infinite loop
  // Using getState() so we don't depend on visualization object
  useEffect(() => {
    return () => {
      useVisualizationStore.getState().pause();
    };
  }, []); // empty array = runs cleanup only on unmount

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

    // Actions
    handlePlay,
    handlePause,
    handleReset,
    handleRandomize,
    handleAlgorithmChange,
    handleSizeChange,
    handleCustomInput,
    setSpeed: visualization.setSpeed,
    seek: visualization.seek,
  };
}