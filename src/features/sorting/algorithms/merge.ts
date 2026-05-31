import { SortFrame, SortMetrics } from '@/types/sorting';

export function mergeSort(inputArray: number[]): SortFrame[] {
  const frames: SortFrame[] = [];
  const array = [...inputArray];
  const metrics: SortMetrics = { comparisons: 0, swaps: 0 };

  function merge(arr: number[], left: number, mid: number, right: number): void {
    const leftArr = arr.slice(left, mid + 1);   // Copy left half
    const rightArr = arr.slice(mid + 1, right + 1); // Copy right half

    // MERGE: highlight the range being merged
    const mergeIndices = Array.from(
      { length: right - left + 1 },
      (_, i) => left + i
    );
    frames.push({
      array: [...arr],
      event: {
        type: 'MERGE',
        indices: mergeIndices,
        metadata: { mergeRange: [left, right] },
      },
      metrics: { ...metrics },
    });

    let i = 0;       // Left array pointer
    let j = 0;       // Right array pointer
    let k = left;    // Main array pointer

    while (i < leftArr.length && j < rightArr.length) {
      // COMPARE: which element is smaller?
      metrics.comparisons++;
      frames.push({
        array: [...arr],
        event: { type: 'COMPARE', indices: [left + i, mid + 1 + j] },
        metrics: { ...metrics },
      });

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }

      // OVERWRITE: write the chosen element into position
      metrics.swaps++;
      frames.push({
        array: [...arr],
        event: { type: 'OVERWRITE', indices: [k], values: [arr[k]] },
        metrics: { ...metrics },
      });
      k++;
    }

    // Copy remaining elements from left half
    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      metrics.swaps++;
      frames.push({
        array: [...arr],
        event: { type: 'OVERWRITE', indices: [k], values: [arr[k]] },
        metrics: { ...metrics },
      });
      i++;
      k++;
    }

    // Copy remaining elements from right half
    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      metrics.swaps++;
      frames.push({
        array: [...arr],
        event: { type: 'OVERWRITE', indices: [k], values: [arr[k]] },
        metrics: { ...metrics },
      });
      j++;
      k++;
    }
  }

  function divide(arr: number[], left: number, right: number): void {
    if (left >= right) return;                         // Base case: single element
    const mid = Math.floor((left + right) / 2);
    divide(arr, left, mid);                            // Sort left half
    divide(arr, mid + 1, right);                       // Sort right half
    merge(arr, left, mid, right);                      // Merge both halves
  }

  divide(array, 0, array.length - 1);

  // Mark everything sorted at the end
  frames.push({
    array: [...array],
    event: {
      type: 'MARK_SORTED',
      indices: Array.from({ length: array.length }, (_, i) => i),
    },
    metrics: { ...metrics },
  });

  return frames;
}