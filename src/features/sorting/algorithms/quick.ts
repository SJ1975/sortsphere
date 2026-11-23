import { SortEvent, SortFrame, SortMetrics, SortState } from '@/types/sorting';

export function quickSort(inputArray: number[]): SortFrame[] {
  const frames: SortFrame[] = [];
  const array = [...inputArray];
  const ids = array.map((_, i) => i);
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

  function partition(low: number, high: number): number {
    const pivot = array[high];
    const pivotId = ids[high];

    push(
      { type: 'PARTITION', indices: [high], metadata: { pivotIndex: high } },
      { low, high, i: low - 1, pivotId, pivotIndex: high }
    );

    let i = low - 1;

    for (let j = low; j < high; j++) {
      metrics.comparisons++;

      // i shown here is where the "≤ pivot" zone ends after this step
      const small = array[j] <= pivot;
      push(
        { type: 'COMPARE', indices: [j, high] },
        { low, high, i: small ? i + 1 : i, j, pivotId, pivotIndex: high }
      );

      if (small) {
        i++;
        if (i !== j) {
          swap(i, j);
          metrics.swaps++;
          push(
            { type: 'SWAP', indices: [i, j] },
            { low, high, i, j, pivotId, pivotIndex: high }
          );
        }
      }
    }

    swap(i + 1, high);
    metrics.swaps++;
    push(
      { type: 'SWAP', indices: [i + 1, high] },
      { low, high, i, j: high, pivotId, pivotIndex: i + 1 }
    );

    const p = i + 1;
    sortedIndices.push(p);
    push(
      { type: 'MARK_SORTED', indices: [...sortedIndices] },
      { low, high, i, pivotId, pivotIndex: p }
    );

    return p;
  }

  function sort(low: number, high: number): void {
    if (low < high) {
      const p = partition(low, high);
      sort(low, p - 1);
      sort(p + 1, high);
    } else if (low === high && !sortedIndices.includes(low)) {
      sortedIndices.push(low);
      push({ type: 'MARK_SORTED', indices: [...sortedIndices] });
    }
  }

  sort(0, array.length - 1);
  return frames;
}