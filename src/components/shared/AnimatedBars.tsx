'use client';

import { useEffect, useRef, useState } from 'react';
import { SortingEngine } from '@/features/sorting/engine';
import { SortFrame } from '@/types/sorting';

const BAR_COUNT = 30;
const FRAME_DELAY_MS = 55; // How fast the animation plays in hero

export function AnimatedBars() {
  const [displayArray, setDisplayArray] = useState<number[]>(() =>
    // Initial placeholder bars (random heights before engine loads)
    Array.from({ length: BAR_COUNT }, (_, i) =>
      Math.floor(Math.sin((i / BAR_COUNT) * Math.PI * 2 + 1) * 40 + 50)
    )
  );
  const [highlights, setHighlights] = useState<Record<number, string>>({});

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const framesRef = useRef<SortFrame[]>([]);
  const frameIdxRef = useRef(0);

  useEffect(() => {
    let alive = true; // Prevents state updates after unmount

    const runCycle = () => {
      if (!alive) return;

      // Generate fresh random array and compute all frames upfront
      const arr = SortingEngine.generateArray(BAR_COUNT, 8, 100);
      framesRef.current = SortingEngine.generateFrames('bubble', arr);
      frameIdxRef.current = 0;

      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        if (!alive) return;

        const idx = frameIdxRef.current;
        const frames = framesRef.current;

        if (idx >= frames.length) {
          // Sort complete — clear and restart after a pause
          if (intervalRef.current) clearInterval(intervalRef.current);
          timeoutRef.current = setTimeout(runCycle, 1400);
          return;
        }

        const frame = frames[idx];
        setDisplayArray([...frame.array]);

        // Map event type to a color class name
        const newHighlights: Record<number, string> = {};
        switch (frame.event.type) {
          case 'COMPARE':
            frame.event.indices.forEach((i) => { newHighlights[i] = 'compare'; });
            break;
          case 'SWAP':
            frame.event.indices.forEach((i) => { newHighlights[i] = 'swap'; });
            break;
          case 'MARK_SORTED':
            frame.event.indices.forEach((i) => { newHighlights[i] = 'sorted'; });
            break;
          case 'PARTITION':
            frame.event.indices.forEach((i) => { newHighlights[i] = 'partition'; });
            break;
        }

        setHighlights(newHighlights);
        frameIdxRef.current++;
      }, FRAME_DELAY_MS);
    };

    runCycle();

    return () => {
      alive = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const maxVal = Math.max(...displayArray, 1);

  const getBarColor = (index: number): string => {
    switch (highlights[index]) {
      case 'compare':  return '#fbbf24'; // amber
      case 'swap':     return '#f43f5e'; // rose
      case 'sorted':   return '#10b981'; // emerald
      case 'partition':return '#22d3ee'; // cyan
      default:         return '#6366f1'; // indigo
    }
  };

  const getGlow = (index: number): string => {
    if (!highlights[index]) return 'none';
    return `0 0 8px ${getBarColor(index)}99`;
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '2px',
        height: '180px',
        width: '100%',
      }}
    >
      {displayArray.map((val, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${(val / maxVal) * 100}%`,
            backgroundColor: getBarColor(i),
            borderRadius: '3px 3px 0 0',
            transition: 'height 0.06s ease, background-color 0.08s ease',
            boxShadow: getGlow(i),
          }}
        />
      ))}
    </div>
  );
}