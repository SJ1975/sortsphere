import { SortEvent } from '@/types/sorting';

export const EVENT_COLORS = {
  idle:      '#6366f1',
  compare:   '#fbbf24',
  swap:      '#f43f5e',
  sorted:    '#10b981',
  partition: '#22d3ee',
  merge:     '#8b5cf6',
  overwrite: '#a78bfa',
} as const;

export function getBarColor(
  index: number,
  event: SortEvent | undefined,
  sortedIndices: Set<number>
): string {
  if (sortedIndices.has(index)) return EVENT_COLORS.sorted;
  if (event?.type === 'MARK_SORTED' && event.indices.includes(index))
    return EVENT_COLORS.sorted;
  if (!event || !event.indices.includes(index)) return EVENT_COLORS.idle;

  switch (event.type) {
    case 'COMPARE':   return EVENT_COLORS.compare;
    case 'SWAP':      return EVENT_COLORS.swap;
    case 'PARTITION': return EVENT_COLORS.partition;
    case 'MERGE':     return EVENT_COLORS.merge;
    case 'OVERWRITE': return EVENT_COLORS.overwrite;
    default:          return EVENT_COLORS.idle;
  }
}