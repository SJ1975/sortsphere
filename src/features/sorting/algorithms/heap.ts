import { SortEvent, SortFrame, SortMetrics, SortState } from '@/types/sorting';

export function heapSort(inputArray: number[]): SortFrame[] {
  const frames: SortFrame[] = [];
  const array = [...inputArray];
  const ids = array.map((_, i) => i);
  const n = array.length;
  const metrics: SortMetrics = { comparisons: 0, swaps: 0 };
  const sortedIndices: number[] = [];

  const push = (event: SortEvent, state?: SortState) => {
    frames.push({
      array: [...array],
      ids: [...ids],
      event,
      metrics: { ...metrics },
      state,
    });
  };

  const swap = (a: number, b: number) => {
    [array[a], array[b]] = [array[b], array[a]];
    [ids[a], ids[b]] = [ids[b], ids[a]];
  };

  function heapify(
    heapSize: number,
    i: number,
    phase: 'build' | 'extract'
  ): void {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < heapSize) {
      metrics.comparisons++;
      push(
        { type: 'COMPARE', indices: [left, largest] },
        { phase, heapSize, i }
      );
      if (array[left] > array[largest]) largest = left;
    }

    if (right < heapSize) {
      metrics.comparisons++;
      push(
        { type: 'COMPARE', indices: [right, largest] },
        { phase, heapSize, i }
      );
      if (array[right] > array[largest]) largest = right;
    }

    if (largest !== i) {
      swap(i, largest);
      metrics.swaps++;
      push(
        { type: 'SWAP', indices: [i, largest] },
        { phase, heapSize, i: largest }
      );
      heapify(heapSize, largest, phase);
    }
  }

  // Phase 1: build the max-heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i, 'build');
  }

  // Phase 2: repeatedly move the maximum to the end
  for (let end = n - 1; end > 0; end--) {
    swap(0, end);
    metrics.swaps++;
    // heapSize is the size AFTER removal, so the moved node leaves the tree
    push(
      { type: 'SWAP', indices: [0, end] },
      { phase: 'extract', heapSize: end }
    );

    sortedIndices.push(end);
    push(
      { type: 'MARK_SORTED', indices: [...sortedIndices] },
      { phase: 'extract', heapSize: end }
    );

    heapify(end, 0, 'extract');
  }

  sortedIndices.push(0);
  push(
    { type: 'MARK_SORTED', indices: [...sortedIndices] },
    { phase: 'extract', heapSize: 0 }
  );

  return frames;
}