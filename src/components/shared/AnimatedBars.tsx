"use client";

import { useEffect, useRef, useState } from "react";
import { SortingEngine } from "@/features/sorting/engine";
import { SortFrame } from "@/types/sorting";

const BAR_COUNT = 30;
const FRAME_DELAY_MS = 55;

export function AnimatedBars() {
  const [mounted, setMounted] = useState(false);
  const [displayArray, setDisplayArray] = useState<number[]>(
    // Deterministic placeholder — same on server and client
    Array.from({ length: BAR_COUNT }, (_, i) =>
      Math.round(((i + 1) / BAR_COUNT) * 90 + 5),
    ),
  );
  const [highlights, setHighlights] = useState<Record<number, string>>({});

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const framesRef = useRef<SortFrame[]>([]);
  const frameIdxRef = useRef(0);

  // Set mounted on client only
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return; // Don't run animation until client is ready

    let alive = true;

    const runCycle = () => {
      if (!alive) return;
      const arr = SortingEngine.generateArray(BAR_COUNT, 8, 100);
      framesRef.current = SortingEngine.generateFrames("bubble", arr);
      frameIdxRef.current = 0;

      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        if (!alive) return;

        const idx = frameIdxRef.current;
        const frames = framesRef.current;

        if (idx >= frames.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          timeoutRef.current = setTimeout(runCycle, 1400);
          return;
        }

        const frame = frames[idx];
        setDisplayArray([...frame.array]);

        const newHighlights: Record<number, string> = {};
        switch (frame.event.type) {
          case "COMPARE":
            frame.event.indices.forEach((i) => {
              newHighlights[i] = "compare";
            });
            break;
          case "SWAP":
            frame.event.indices.forEach((i) => {
              newHighlights[i] = "swap";
            });
            break;
          case "MARK_SORTED":
            frame.event.indices.forEach((i) => {
              newHighlights[i] = "sorted";
            });
            break;
          case "PARTITION":
            frame.event.indices.forEach((i) => {
              newHighlights[i] = "partition";
            });
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
  }, [mounted]); // Only depends on mounted — runs once after hydration

  const maxVal = Math.max(...displayArray, 1);

  const getBarColor = (index: number): string => {
    switch (highlights[index]) {
      case "compare":
        return "#fbbf24";
      case "swap":
        return "#f43f5e";
      case "sorted":
        return "#10b981";
      case "partition":
        return "#22d3ee";
      default:
        return "#6366f1";
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "2px",
        height: "180px",
        width: "100%",
      }}
    >
      {displayArray.map((val, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${(val / maxVal) * 100}%`,
            backgroundColor: getBarColor(i),
            borderRadius: "3px 3px 0 0",
            transition: mounted
              ? "height 0.06s ease, background-color 0.08s ease"
              : "none",
            boxShadow: highlights[i] ? `0 0 8px ${getBarColor(i)}99` : "none",
          }}
        />
      ))}
    </div>
  );
}
