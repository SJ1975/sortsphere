import { AlgorithmKey } from '@/types/sorting';
import { SortEventType } from '@/types/sorting';

export interface PseudocodeLine {
  text: string;
  indent: number;
  highlightOn?: SortEventType[];
  comment?: string;
}

export const PSEUDOCODE: Record<AlgorithmKey, PseudocodeLine[]> = {
  bubble: [
    { text: 'procedure bubbleSort(arr):', indent: 0 },
    { text: 'n ← length(arr)', indent: 1 },
    { text: 'for i ← 0 to n−2:', indent: 1 },
    { text: 'for j ← 0 to n−i−2:', indent: 2 },
    { text: 'if arr[j] > arr[j+1]:', indent: 3,
      highlightOn: ['COMPARE'], comment: 'Compare adjacent pair' },
    { text: 'swap(arr[j], arr[j+1])', indent: 4,
      highlightOn: ['SWAP'], comment: 'Out of order — swap!' },
    { text: '▸ arr[n−1−i] now in final position', indent: 2,
      highlightOn: ['MARK_SORTED'], comment: 'Largest bubbled to end' },
  ],

  selection: [
    { text: 'procedure selectionSort(arr):', indent: 0 },
    { text: 'n ← length(arr)', indent: 1 },
    { text: 'for i ← 0 to n−2:', indent: 1 },
    { text: 'minIndex ← i', indent: 2 },
    { text: 'for j ← i+1 to n−1:', indent: 2 },
    { text: 'if arr[j] < arr[minIndex]:', indent: 3,
      highlightOn: ['COMPARE'], comment: 'Find minimum element' },
    { text: 'minIndex ← j', indent: 4 },
    { text: 'swap(arr[i], arr[minIndex])', indent: 2,
      highlightOn: ['SWAP'], comment: 'Place minimum in position' },
    { text: '▸ arr[i] now in final position', indent: 2,
      highlightOn: ['MARK_SORTED'], comment: 'Sorted boundary grows' },
  ],

  insertion: [
    { text: 'procedure insertionSort(arr):', indent: 0 },
    { text: 'n ← length(arr)', indent: 1 },
    { text: 'for i ← 1 to n−1:', indent: 1 },
    { text: 'key ← arr[i]', indent: 2 },
    { text: 'j ← i − 1', indent: 2 },
    { text: 'while j ≥ 0 and arr[j] > key:', indent: 2,
      highlightOn: ['COMPARE'], comment: 'Scan sorted portion' },
    { text: 'arr[j+1] ← arr[j]', indent: 3,
      highlightOn: ['OVERWRITE'], comment: 'Shift element right' },
    { text: 'j ← j − 1', indent: 3 },
    { text: 'arr[j+1] ← key', indent: 2,
      highlightOn: ['OVERWRITE'], comment: 'Insert key in position' },
    { text: '▸ arr[0..i] is sorted', indent: 2,
      highlightOn: ['MARK_SORTED'], comment: 'Sorted range expands' },
  ],

  merge: [
    { text: 'procedure mergeSort(arr, left, right):', indent: 0 },
    { text: 'if left ≥ right: return', indent: 1 },
    { text: 'mid ← ⌊(left + right) / 2⌋', indent: 1 },
    { text: 'mergeSort(arr, left, mid)', indent: 1 },
    { text: 'mergeSort(arr, mid+1, right)', indent: 1 },
    { text: 'merge(arr, left, mid, right)', indent: 1,
      highlightOn: ['MERGE'], comment: 'Combine sorted halves' },
    { text: '── merge procedure ──', indent: 0 },
    { text: 'while both halves have elements:', indent: 1,
      highlightOn: ['COMPARE'], comment: 'Compare smallest of each half' },
    { text: 'place smaller into result', indent: 2,
      highlightOn: ['OVERWRITE'], comment: 'Write chosen element back' },
    { text: '▸ subarray [left..right] is sorted', indent: 1,
      highlightOn: ['MARK_SORTED'] },
  ],

  quick: [
    { text: 'procedure quickSort(arr, low, high):', indent: 0 },
    { text: 'if low ≥ high: return', indent: 1 },
    { text: 'pivot ← arr[high]', indent: 1,
      highlightOn: ['PARTITION'], comment: 'Last element as pivot' },
    { text: 'p ← partition(arr, low, high)', indent: 1 },
    { text: 'quickSort(arr, low, p−1)', indent: 1 },
    { text: 'quickSort(arr, p+1, high)', indent: 1 },
    { text: '── partition procedure ──', indent: 0 },
    { text: 'i ← low − 1', indent: 1 },
    { text: 'for j ← low to high−1:', indent: 1 },
    { text: 'if arr[j] ≤ pivot:', indent: 2,
      highlightOn: ['COMPARE'], comment: 'Compare with pivot' },
    { text: 'swap(arr[++i], arr[j])', indent: 3,
      highlightOn: ['SWAP'], comment: 'Move to left partition' },
    { text: 'swap(arr[i+1], arr[high])', indent: 1,
      highlightOn: ['SWAP'], comment: 'Place pivot in position' },
    { text: '▸ pivot in final position', indent: 1,
      highlightOn: ['MARK_SORTED'], comment: 'Pivot is correctly placed' },
  ],

  heap: [
    { text: 'procedure heapSort(arr):', indent: 0 },
    { text: 'buildMaxHeap(arr)  ← heapify from n/2 down', indent: 1 },
    { text: 'for i ← n−1 to 1:', indent: 1 },
    { text: 'swap(arr[0], arr[i])', indent: 2,
      highlightOn: ['SWAP'], comment: 'Move max to sorted end' },
    { text: '▸ arr[i] in final position', indent: 2,
      highlightOn: ['MARK_SORTED'] },
    { text: 'heapify(arr, i, 0)', indent: 2 },
    { text: '── heapify procedure ──', indent: 0 },
    { text: 'largest ← i', indent: 1 },
    { text: 'if left child > arr[largest]:', indent: 1,
      highlightOn: ['COMPARE'], comment: 'Compare with left child' },
    { text: 'largest ← left', indent: 2 },
    { text: 'if right child > arr[largest]:', indent: 1,
      highlightOn: ['COMPARE'], comment: 'Compare with right child' },
    { text: 'largest ← right', indent: 2 },
    { text: 'if largest ≠ i: swap and recurse', indent: 1,
      highlightOn: ['SWAP'], comment: 'Restore heap property' },
  ],
};

export const COMPLEXITY_EXPLANATION: Record<AlgorithmKey, {
  why: string;
  intuition: string;
  bestCase: string;
  worstCase: string;
}> = {
  bubble: {
    why: 'Two nested loops each run ~n times, giving n × n = n² operations.',
    intuition: 'Imagine sorting 10 cards — in the worst case (reverse order) each card must travel the full length of the array.',
    bestCase: 'Already sorted: only 1 pass needed with no swaps → O(n)',
    worstCase: 'Reverse sorted: every comparison results in a swap → O(n²)',
  },
  selection: {
    why: 'For each of n positions, we scan the remaining n−i elements to find the minimum — always n²/2 comparisons.',
    intuition: 'Think of always scanning your entire hand of cards to find the lowest card, then placing it. You always scan everything regardless of order.',
    bestCase: 'No best case advantage — always O(n²) comparisons',
    worstCase: 'Always O(n²) — the scan never shortcircuits',
  },
  insertion: {
    why: 'Each element may need to travel all the way back through the sorted portion — worst case n steps for n elements.',
    intuition: 'Like sorting playing cards in hand — each new card slides left past larger cards. A reverse-sorted deck means each card slides all the way.',
    bestCase: 'Already sorted: each card slots in immediately, no sliding → O(n)',
    worstCase: 'Reverse sorted: card k must slide past k cards → 1+2+…+n = O(n²)',
  },
  merge: {
    why: 'We split the array in half log₂(n) times. Each level of splitting does n total work to merge — giving n × log(n).',
    intuition: 'Splitting in half means only log₂(100) = 7 levels to sort 100 elements. Each level does n work → 7×100 = 700 vs bubble sort\'s 10,000.',
    bestCase: 'Always O(n log n) — splitting is always balanced',
    worstCase: 'Always O(n log n) — guaranteed regardless of input',
  },
  quick: {
    why: 'On average, each partition splits the array roughly in half, giving log(n) levels of n work each = O(n log n). A bad pivot choice can degrade to O(n²).',
    intuition: 'Like a binary search in reverse — each pivot ideally halves the problem. An unlucky pivot (always the max) means O(n²) partitions.',
    bestCase: 'Pivot always splits perfectly in half → O(n log n)',
    worstCase: 'Already sorted + picking last element as pivot → O(n²)',
  },
  heap: {
    why: 'Building the heap takes O(n). Each of the n extractions requires O(log n) to re-heapify — giving n × log(n) total.',
    intuition: 'A binary heap is like a tournament bracket — finding and removing the winner (max) only requires fixing log(n) levels, not re-running the whole tournament.',
    bestCase: 'Always O(n log n) — heapify cost is always logarithmic',
    worstCase: 'Always O(n log n) — guaranteed even for sorted input',
  },
};