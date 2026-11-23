import { SortEvent, SortFrame, SortMetrics, SortState } from '@/types/sorting';

export function selectionSort(inputArray: number[]): SortFrame[] {
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

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;

    for (let j = i + 1; j < n; j++) {
      metrics.comparisons++;

      // The flag reflects the result of THIS comparison, so it
      // jumps the moment a smaller value is found.
      const newMin = array[j] < array[minIndex] ? j : minIndex;
      push(
        { type: 'COMPARE', indices: [j, minIndex] },
        { i, j, minIndex: newMin, minId: ids[newMin] }
      );
      minIndex = newMin;
    }

    if (minIndex !== i) {
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
      [ids[i], ids[minIndex]] = [ids[minIndex], ids[i]];
      metrics.swaps++;
      push(
        { type: 'SWAP', indices: [i, minIndex] },
        { i, minIndex: i, minId: ids[i] }
      );
    }

    sortedIndices.push(i);
    push({ type: 'MARK_SORTED', indices: [...sortedIndices] }, { i });
  }

  sortedIndices.push(n - 1);
  push({ type: 'MARK_SORTED', indices: [...sortedIndices] }, { i: n - 1 });

  return frames;
}