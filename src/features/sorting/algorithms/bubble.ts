import { SortFrame, SortMetrics } from '@/types/sorting';

export function bubbleSort(inputArray: number[]): SortFrame[] {
  const frames: SortFrame[] = [];
  const array = [...inputArray];
  const n = array.length;
  const metrics: SortMetrics = { comparisons: 0, swaps: 0 };
  const sortedIndices: number[] = [];   // Track which indices are confirmed sorted

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {

      //COMPARE: looking at two adjacent elements ──
      metrics.comparisons++;
      frames.push({
        array: [...array],
        event: { type: 'COMPARE', indices: [j, j + 1] },
        metrics: { ...metrics },
      });

      if (array[j] > array[j + 1]) {
        //SWAP: they are out of order, swap them - 
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        metrics.swaps++;
        frames.push({
          array: [...array],
          event: { type: 'SWAP', indices: [j, j + 1] },
          metrics: { ...metrics },
        });
      }
    }

    // After each pass, the last unsorted element is now in place
    const sortedIndex = n - 1 - i;
    sortedIndices.push(sortedIndex);
    frames.push({
      array: [...array],
      event: { type: 'MARK_SORTED', indices: [...sortedIndices] },
      metrics: { ...metrics },
    });
  }

  // The first element is also sorted now
  sortedIndices.push(0);
  frames.push({
    array: [...array],
    event: { type: 'MARK_SORTED', indices: [...sortedIndices] },
    metrics: { ...metrics },
  });

  return frames;
}