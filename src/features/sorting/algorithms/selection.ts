import { SortFrame, SortMetrics } from '@/types/sorting';

export function selectionSort(inputArray: number[]): SortFrame[] {
  const frames: SortFrame[] = [];
  const array = [...inputArray];
  const n = array.length;
  const metrics: SortMetrics = { comparisons: 0, swaps: 0 };
  const sortedIndices: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;

    // Search for the minimum element in the unsorted portion
    for (let j = i + 1; j < n; j++) {

      // COMPARE: is this element smaller than our current minimum?
      metrics.comparisons++;
      frames.push({
        array: [...array],
        event: { type: 'COMPARE', indices: [j, minIndex] },
        metrics: { ...metrics },
      });

      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }

    // SWAP: move minimum to its correct position
    if (minIndex !== i) {
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
      metrics.swaps++;
      frames.push({
        array: [...array],
        event: { type: 'SWAP', indices: [i, minIndex] },
        metrics: { ...metrics },
      });
    }

    // This index is now in its final sorted position
    sortedIndices.push(i);
    frames.push({
      array: [...array],
      event: { type: 'MARK_SORTED', indices: [...sortedIndices] },
      metrics: { ...metrics },
    });
  }

  // Last element is also sorted
  sortedIndices.push(n - 1);
  frames.push({
    array: [...array],
    event: { type: 'MARK_SORTED', indices: [...sortedIndices] },
    metrics: { ...metrics },
  });

  return frames;
}