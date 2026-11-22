import { SortEvent, SortFrame, SortMetrics, SortState } from '@/types/sorting';

export function insertionSort(inputArray: number[]): SortFrame[] {
  const frames: SortFrame[] = [];
  const array = [...inputArray];
  const ids = array.map((_, i) => i);
  const n = array.length;
  const metrics: SortMetrics = { comparisons: 0, swaps: 0 };
  const sortedIndices: number[] = [0];

  const push = (event: SortEvent, state?: SortState) => {
    frames.push({
      array: [...array],
      ids: [...ids],
      event,
      metrics: { ...metrics },
      state,
    });
  };

  push({ type: 'MARK_SORTED', indices: [...sortedIndices] });

  for (let i = 1; i < n; i++) {
    const key = array[i];
    const keyId = ids[i]; // the element we lift out
    let j = i - 1;

    metrics.comparisons++;
    push({ type: 'COMPARE', indices: [i, j] }, { i, keyId, hole: i });

    while (j >= 0 && array[j] > key) {
      // Shift one element right; the hole moves left to position j
      array[j + 1] = array[j];
      ids[j + 1] = ids[j];
      metrics.swaps++;
      push(
        { type: 'OVERWRITE', indices: [j + 1], values: [array[j + 1]] },
        { i, keyId, hole: j }
      );

      j--;

      if (j >= 0) {
        metrics.comparisons++;
        push(
          { type: 'COMPARE', indices: [j + 1, j] },
          { i, keyId, hole: j + 1 }
        );
      }
    }

    // Drop the key into the gap
    array[j + 1] = key;
    ids[j + 1] = keyId;
    metrics.swaps++;
    push({ type: 'OVERWRITE', indices: [j + 1], values: [key] }, { i });

    sortedIndices.push(i);
    push({ type: 'MARK_SORTED', indices: [...sortedIndices] }, { i });
  }

  return frames;
}