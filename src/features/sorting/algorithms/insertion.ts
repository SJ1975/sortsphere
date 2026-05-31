import { SortFrame, SortMetrics } from '@/types/sorting';

export function insertionSort(inputArray: number[]): SortFrame[] {
  const frames: SortFrame[] = [];
  const array = [...inputArray];
  const n = array.length;
  const metrics: SortMetrics = { comparisons: 0, swaps: 0 };
  const sortedIndices: number[] = [0]; // First element is trivially sorted

  // Mark first element as sorted immediately
  frames.push({
    array: [...array],
    event: { type: 'MARK_SORTED', indices: [...sortedIndices] },
    metrics: { ...metrics },
  });

  for (let i = 1; i < n; i++) {
    const key = array[i];   // Element i.e. currently inserting
    let j = i - 1;

    // COMPARE: is the current element smaller than the sorted portion?
    metrics.comparisons++;
    frames.push({
      array: [...array],
      event: { type: 'COMPARE', indices: [i, j] },
      metrics: { ...metrics },
    });

    // Shift sorted elements right to make room for key
    while (j >= 0 && array[j] > key) {
      // OVERWRITE: shift element right
      array[j + 1] = array[j];
      metrics.swaps++;
      frames.push({
        array: [...array],
        event: { type: 'OVERWRITE', indices: [j + 1], values: [array[j + 1]] },
        metrics: { ...metrics },
      });

      j--;

      // Compare with next element in sorted portion
      if (j >= 0) {
        metrics.comparisons++;
        frames.push({
          array: [...array],
          event: { type: 'COMPARE', indices: [j + 1, j] },
          metrics: { ...metrics },
        });
      }
    }

    // OVERWRITE: place key in its correct position
    array[j + 1] = key;
    metrics.swaps++;
    frames.push({
      array: [...array],
      event: { type: 'OVERWRITE', indices: [j + 1], values: [key] },
      metrics: { ...metrics },
    });

    // Everything up to i is now sorted
    sortedIndices.push(i);
    frames.push({
      array: [...array],
      event: { type: 'MARK_SORTED', indices: [...sortedIndices] },
      metrics: { ...metrics },
    });
  }

  return frames;
}