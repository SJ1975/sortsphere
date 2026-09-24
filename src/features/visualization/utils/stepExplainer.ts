import { SortFrame } from '@/types/sorting';
import { AlgorithmKey } from '@/types/sorting';

export interface StepExplanation {
  headline: string;
  detail: string;
  emoji: string;
  phase: string;
}

export function explainStep(
  frame: SortFrame | undefined,
  algorithmKey: AlgorithmKey,
  currentIndex: number,
  totalFrames: number
): StepExplanation {
  if (!frame) {
    return {
      emoji: '▶',
      headline: 'Ready to sort',
      detail: 'Press Play to begin the visualization. Each step will be explained here.',
      phase: 'Waiting',
    };
  }

  const { event, array } = frame;
  const pct = Math.round((currentIndex / Math.max(totalFrames - 1, 1)) * 100);

  switch (event.type) {
    case 'COMPARE': {
      const [i, j] = event.indices;
      const a = array[i];
      const b = array[j];
      const needsSwap = a > b;
      return {
        emoji: '👁',
        headline: `Comparing ${a} and ${b}`,
        detail: `Looking at position ${i} (value ${a}) and position ${j} (value ${b}). ${
          needsSwap
            ? `Since ${a} > ${b}, these are out of order — a swap will follow.`
            : `Since ${a} ≤ ${b}, they are already in the right order — no swap needed.`
        }`,
        phase: `${pct}% complete`,
      };
    }

    case 'SWAP': {
      const [i, j] = event.indices;
      const a = array[i];
      const b = array[j];
      return {
        emoji: '🔄',
        headline: `Swapping ${a} ↔ ${b}`,
        detail: `Exchanging position ${i} (value ${a}) with position ${j} (value ${b}). The larger value moves right toward its sorted position.`,
        phase: `${pct}% complete`,
      };
    }

    case 'OVERWRITE': {
      const [i] = event.indices;
      const val = event.values?.[0] ?? array[i];
      return {
        emoji: '✍️',
        headline: `Writing ${val} to position ${i}`,
        detail: algorithmKey === 'insertion'
          ? `Shifting element to make room, or inserting the key value ${val} into its correct position within the sorted portion.`
          : `Placing value ${val} at index ${i} as part of the merge process — copying from a temporary buffer back to the array.`,
        phase: `${pct}% complete`,
      };
    }

    case 'MARK_SORTED': {
      const count = event.indices.length;
      const latest = event.indices[event.indices.length - 1];
      return {
        emoji: '✅',
        headline: `Position ${latest} is permanently sorted`,
        detail: `Value ${array[latest]} has reached its final position. ${count} of ${array.length} elements are now confirmed sorted (shown in green).`,
        phase: `${Math.round((count / array.length) * 100)}% sorted`,
      };
    }

    case 'PARTITION': {
      const [i] = event.indices;
      return {
        emoji: '📍',
        headline: `Pivot selected: ${array[i]}`,
        detail: `Value ${array[i]} at position ${i} is chosen as the pivot. Everything smaller than ${array[i]} will move left, everything larger will move right. The pivot will then be in its final position.`,
        phase: `${pct}% complete`,
      };
    }

    case 'MERGE': {
      const range = event.metadata?.mergeRange;
      return {
        emoji: '🔗',
        headline: `Merging subarray [${range?.[0]}..${range?.[1]}]`,
        detail: `Two sorted halves are being combined into one sorted sequence. Elements are compared one-by-one from each half and placed in order. This is the core step that makes Merge Sort O(n log n).`,
        phase: `${pct}% complete`,
      };
    }

    case 'RESET':
      return {
        emoji: '🔁',
        headline: 'Reset',
        detail: 'Clearing highlights.',
        phase: `${pct}% complete`,
      };

    default:
      return {
        emoji: '⚙️',
        headline: 'Processing...',
        detail: 'Algorithm is running.',
        phase: `${pct}% complete`,
      };
  }
}

export function getAlgorithmPhase(
  algorithmKey: AlgorithmKey,
  frame: SortFrame | undefined,
  currentIndex: number,
  totalFrames: number
): string {
  if (!frame) return 'Not started';
  const pct = currentIndex / Math.max(totalFrames - 1, 1);

  switch (algorithmKey) {
    case 'heap':
      return pct < 0.45 ? 'Phase 1: Building Max-Heap' : 'Phase 2: Extracting Elements';
    case 'merge':
      return pct < 0.5 ? 'Dividing array recursively' : 'Merging sorted halves';
    case 'quick':
      return frame.event.type === 'PARTITION' ? 'Selecting pivot' : 'Partitioning elements';
    default:
      return `${Math.round(pct * 100)}% complete`;
  }
}