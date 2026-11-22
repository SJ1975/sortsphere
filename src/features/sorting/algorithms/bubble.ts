import { SortEvent, SortFrame, SortMetrics, SortState } from '@/types/sorting';

export function bubbleSort(inputArray: number[]): SortFrame[] {
  const frames: SortFrame[] = [];
  const array = [...inputArray];
  const ids = array.map((_, i) => i); // element identity travels with swaps
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

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      metrics.comparisons++;
      push({ type: 'COMPARE', indices: [j, j + 1] }, { pass: i, j });

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        [ids[j], ids[j + 1]] = [ids[j + 1], ids[j]];
        metrics.swaps++;
        push({ type: 'SWAP', indices: [j, j + 1] }, { pass: i, j });
      }
    }

    sortedIndices.push(n - 1 - i);
    push({ type: 'MARK_SORTED', indices: [...sortedIndices] }, { pass: i });
  }

  sortedIndices.push(0);
  push({ type: 'MARK_SORTED', indices: [...sortedIndices] }, { pass: n - 1 });

  return frames;
}