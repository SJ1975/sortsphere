import { SortFrame, SortMetrics } from '@/types/sorting';

export function quickSort(inputArray: number[]): SortFrame[] {
  const frames: SortFrame[] = [];
  const array = [...inputArray];
  const metrics: SortMetrics = { comparisons: 0, swaps: 0 };
  const sortedIndices: number[] = [];

  function partition(arr: number[], low: number, high: number): number {
    const pivot = arr[high];   // Last element is pivot

    // PARTITION: highlight the pivot
    frames.push({
      array: [...arr],
      event: {
        type: 'PARTITION',
        indices: [high],
        metadata: { pivotIndex: high },
      },
      metrics: { ...metrics },
    });

    let i = low - 1;   // Boundary of smaller elements

    for (let j = low; j < high; j++) {
      // COMPARE: is this element <= pivot?
      metrics.comparisons++;
      frames.push({
        array: [...arr],
        event: { type: 'COMPARE', indices: [j, high] },
        metrics: { ...metrics },
      });

      if (arr[j] <= pivot) {
        i++;
        if (i !== j) {
          // SWAP: move smaller element to left partition
          [arr[i], arr[j]] = [arr[j], arr[i]];
          metrics.swaps++;
          frames.push({
            array: [...arr],
            event: { type: 'SWAP', indices: [i, j] },
            metrics: { ...metrics },
          });
        }
      }
    }

    // SWAP: place pivot in its correct final position
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    metrics.swaps++;
    frames.push({
      array: [...arr],
      event: { type: 'SWAP', indices: [i + 1, high] },
      metrics: { ...metrics },
    });

    // Pivot is now in its sorted position
    const pivotFinalIndex = i + 1;
    sortedIndices.push(pivotFinalIndex);
    frames.push({
      array: [...arr],
      event: { type: 'MARK_SORTED', indices: [...sortedIndices] },
      metrics: { ...metrics },
    });

    return pivotFinalIndex;
  }

  function sort(arr: number[], low: number, high: number): void {
    if (low < high) {
      const pi = partition(arr, low, high);
      sort(arr, low, pi - 1);    // Sort left of pivot
      sort(arr, pi + 1, high);   // Sort right of pivot
    } else if (low === high) {
      // Single element partition - it's sorted
      if (!sortedIndices.includes(low)) {
        sortedIndices.push(low);
        frames.push({
          array: [...arr],
          event: { type: 'MARK_SORTED', indices: [...sortedIndices] },
          metrics: { ...metrics },
        });
      }
    }
  }

  sort(array, 0, array.length - 1);

  return frames;
}