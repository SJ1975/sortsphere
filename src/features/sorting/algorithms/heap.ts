import { SortFrame, SortMetrics } from '@/types/sorting';

export function heapSort(inputArray: number[]): SortFrame[] {
  const frames: SortFrame[] = [];
  const array = [...inputArray];
  const n = array.length;
  const metrics: SortMetrics = { comparisons: 0, swaps: 0 };
  const sortedIndices: number[] = [];

  // Heapify subtree rooted at index i
  // n = current heap size (shrinks as - extract maximums)
  function heapify(arr: number[], heapSize: number, i: number): void {
    let largest = i;           // Assume root is largest
    const left = 2 * i + 1;   // Left child index
    const right = 2 * i + 2;  // Right child index

    // COMPARE: is left child larger than root?
    if (left < heapSize) {
      metrics.comparisons++;
      frames.push({
        array: [...arr],
        event: { type: 'COMPARE', indices: [left, largest] },
        metrics: { ...metrics },
      });
      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }

    // COMPARE: is right child larger than current largest?
    if (right < heapSize) {
      metrics.comparisons++;
      frames.push({
        array: [...arr],
        event: { type: 'COMPARE', indices: [right, largest] },
        metrics: { ...metrics },
      });
      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }

    // If root is not largest, swap and continue heapifying
    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      metrics.swaps++;
      frames.push({
        array: [...arr],
        event: { type: 'SWAP', indices: [i, largest] },
        metrics: { ...metrics },
      });
      heapify(arr, heapSize, largest);
    }
  }

  // Phase 1: Build max-heap (rearrange array)
  // Start from last non-leaf node and go up
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(array, n, i);
  }

  // Phase 2: Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    // SWAP: move current root (max) to end
    [array[0], array[i]] = [array[i], array[0]];
    metrics.swaps++;
    frames.push({
      array: [...array],
      event: { type: 'SWAP', indices: [0, i] },
      metrics: { ...metrics },
    });

    // This element is now in its sorted position
    sortedIndices.push(i);
    frames.push({
      array: [...array],
      event: { type: 'MARK_SORTED', indices: [...sortedIndices] },
      metrics: { ...metrics },
    });

    // Heapify the reduced heap
    heapify(array, i, 0);
  }

  // First element is also sorted
  sortedIndices.push(0);
  frames.push({
    array: [...array],
    event: { type: 'MARK_SORTED', indices: [...sortedIndices] },
    metrics: { ...metrics },
  });

  return frames;
}