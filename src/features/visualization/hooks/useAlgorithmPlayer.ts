'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { AlgorithmKey, SortFrame } from '@/types/sorting';
import { SortingEngine } from '@/features/sorting/engine';
import { BASE_DELAY_MS } from '@/lib/constants';

interface UseAlgorithmPlayerProps {
  algorithm: AlgorithmKey;
  initialArray: number[];
}

export function useAlgorithmPlayer({
  algorithm,
  initialArray,
}: UseAlgorithmPlayerProps) {
  const [frames, setFrames] = useState<SortFrame[]>(() =>
    SortingEngine.generateFrames(algorithm, initialArray)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmKey>(algorithm);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const arrayRef = useRef<number[]>(initialArray);

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Regenerate frames when algorithm changes
  const changeAlgorithm = useCallback((newAlgorithm: AlgorithmKey) => {
    clearTimer();
    setSelectedAlgorithm(newAlgorithm);
    setCurrentIndex(0);
    setIsPlaying(false);
    const newFrames = SortingEngine.generateFrames(newAlgorithm, arrayRef.current);
    setFrames(newFrames);
  }, []);

  // Update array (when parent syncs arrays)
  const updateArray = useCallback((newArray: number[]) => {
    clearTimer();
    arrayRef.current = newArray;
    setCurrentIndex(0);
    setIsPlaying(false);
    const newFrames = SortingEngine.generateFrames(selectedAlgorithm, newArray);
    setFrames(newFrames);
  }, [selectedAlgorithm]);

  const play = useCallback(() => {
    clearTimer();
    const totalFrames = frames.length;

    const id = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= totalFrames - 1) {
          clearInterval(id);
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, BASE_DELAY_MS / speed);

    intervalRef.current = id;
    setIsPlaying(true);
  }, [frames.length, speed]);

  const pause = useCallback(() => {
    clearTimer();
    setIsPlaying(false);
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setCurrentIndex(0);
    setIsPlaying(false);
  }, []);

  const seek = useCallback((index: number) => {
    clearTimer();
    setCurrentIndex(index);
    setIsPlaying(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimer();
  }, []);

  const currentFrame = frames[currentIndex];
  const isFinished = currentIndex >= frames.length - 1;
  const totalFrames = frames.length;

  // Compute sorted indices
  const sortedIndices = new Set<number>();
  for (let i = currentIndex; i >= 0; i--) {
    if (frames[i]?.event.type === 'MARK_SORTED') {
      frames[i].event.indices.forEach((idx) => sortedIndices.add(idx));
      break;
    }
  }

  return {
    frames,
    currentFrame,
    currentIndex,
    totalFrames,
    isPlaying,
    isFinished,
    speed,
    selectedAlgorithm,
    sortedIndices,
    play,
    pause,
    reset,
    seek,
    setSpeed,
    changeAlgorithm,
    updateArray,
  };
}