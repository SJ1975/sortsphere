'use client';

import { usePreferencesStore } from '@/store';
import { ALGORITHM_KEYS } from '@/lib/constants';

export function useFavorites() {
  const { favorites, toggleFavorite, isFavorite } = usePreferencesStore();

  const favoriteAlgorithms = ALGORITHM_KEYS.filter((key) =>
    favorites.includes(key)
  );

  return {
    favorites,
    favoriteAlgorithms,
    toggleFavorite,
    isFavorite,
    hasFavorites: favorites.length > 0,
    count: favorites.length,
  };
}