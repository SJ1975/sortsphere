import { SortEvent, SortFrame, SortMetrics, SortState } from '@/types/sorting';

export function mergeSort(inputArray: number[]): SortFrame[] {
  const frames: SortFrame[] = [];
  const array = [...inputArray];
  const ids = array.map((_, i) => i);
  const n = array.length;
  const metrics: SortMetrics = { comparisons: 0, swaps: 0 };
  let cuts: number[] = [];

  const push = (event: SortEvent, state?: SortState) => {
    frames.push({
      array: [...array],
      ids: [...ids],
      event,
      metrics: { ...metrics },
      state: { ...state, cuts: [...cuts] },
    });
  };

  const rangeOf = (from: number, to: number) =>
    Array.from({ length: to - from + 1 }, (_, i) => from + i);

  function merge(left: number, mid: number, right: number): void {
    const leftArr = array.slice(left, mid + 1);
    const rightArr = array.slice(mid + 1, right + 1);
    const leftIds = ids.slice(left, mid + 1);
    const rightIds = ids.slice(mid + 1, right + 1);

    // Both halves lift into buffers; the row slots stay empty (-1)
    // until each value is written back.
    const leftBuf = [...leftIds];
    const rightBuf = [...rightIds];
    for (let x = left; x <= right; x++) ids[x] = -1;

    const bufState = (extra: SortState = {}): SortState => ({
      low: left,
      mid,
      high: right,
      phase: 'merge',
      leftBuf: [...leftBuf],
      rightBuf: [...rightBuf],
      ...extra,
    });

    push(
      {
        type: 'MERGE',
        indices: rangeOf(left, right),
        metadata: { mergeRange: [left, right] },
      },
      bufState()
    );

    const place = (k: number, value: number, id: number) => {
      array[k] = value;
      ids[k] = id;
      metrics.swaps++;
      // The gap closes once the last slot of this merge is filled
      if (k === right) cuts = cuts.filter((c) => c !== mid);
      push(
        { type: 'OVERWRITE', indices: [k], values: [value] },
        bufState({ placedId: id })
      );
    };

    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftArr.length && j < rightArr.length) {
      metrics.comparisons++;
      push(
        {
          type: 'COMPARE',
          indices: [left + i, mid + 1 + j],
          values: [leftArr[i], rightArr[j]],
        },
        bufState({ aId: leftIds[i], bId: rightIds[j] })
      );

      if (leftArr[i] <= rightArr[j]) {
        const id = leftIds[i];
        leftBuf[i] = -1;
        place(k, leftArr[i], id);
        i++;
      } else {
        const id = rightIds[j];
        rightBuf[j] = -1;
        place(k, rightArr[j], id);
        j++;
      }
      k++;
    }

    while (i < leftArr.length) {
      const id = leftIds[i];
      leftBuf[i] = -1;
      place(k, leftArr[i], id);
      i++;
      k++;
    }

    while (j < rightArr.length) {
      const id = rightIds[j];
      rightBuf[j] = -1;
      place(k, rightArr[j], id);
      j++;
      k++;
    }
  }

  function divide(left: number, right: number): void {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);

    cuts = [...cuts, mid]; // the gap opens
    push(
      {
        type: 'SPLIT',
        indices: rangeOf(left, right),
        metadata: { mergeRange: [left, right] },
      },
      { low: left, mid, high: right, phase: 'divide' }
    );

    divide(left, mid);
    divide(mid + 1, right);
    merge(left, mid, right);
  }

  // Starting frame: nothing split yet
  push({ type: 'RESET', indices: [] }, { phase: 'divide', low: 0, high: n - 1 });

  divide(0, n - 1);

  push(
    { type: 'MARK_SORTED', indices: rangeOf(0, n - 1) },
    { phase: 'merge' }
  );

  return frames;
}