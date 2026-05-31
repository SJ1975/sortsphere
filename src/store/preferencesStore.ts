import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AlgorithmKey } from '@/types/sorting';

interface PreferencesState {
  // Saved preferences
  favorites: AlgorithmKey[];
  lastAlgorithm: AlgorithmKey;
  barColor: string;
  showMetrics: boolean;
  showEducationalPanel: boolean;

  // Actions
  toggleFavorite: (algorithm: AlgorithmKey) => void;
  isFavorite: (algorithm: AlgorithmKey) => boolean;
  setLastAlgorithm: (algorithm: AlgorithmKey) => void;
  setBarColor: (color: string) => void;
  toggleMetrics: () => void;
  toggleEducationalPanel: () => void;
  resetPreferences: () => void;
}

const DEFAULT_PREFERENCES = {
  favorites: [] as AlgorithmKey[],
  lastAlgorithm: 'bubble' as AlgorithmKey,
  barColor: '#6366f1',          // Indigo — matches our theme
  showMetrics: true,
  showEducationalPanel: true,
};

export const usePreferencesStore = create<PreferencesState>()(
  // 'persist' middleware automatically saves to localStorage
  persist(
    (set, get) => ({
      ...DEFAULT_PREFERENCES,

      // ── Toggle an algorithm as favourite ──
      toggleFavorite: (algorithm) => {
        const { favorites } = get();
        const isFav = favorites.includes(algorithm);
        set({
          favorites: isFav
            ? favorites.filter((f) => f !== algorithm)  // Remove
            : [...favorites, algorithm],                 // Add
        });
      },

      // Check if algorithm is favourited
      isFavorite: (algorithm) => {
        return get().favorites.includes(algorithm);
      },

      // Remember which algorithm user last used
      setLastAlgorithm: (algorithm) => {
        set({ lastAlgorithm: algorithm });
      },

      // Custom bar color
      setBarColor: (color) => {
        set({ barColor: color });
      },

      // Show/hide the metrics panel
      toggleMetrics: () => {
        set((state) => ({ showMetrics: !state.showMetrics }));
      },

      // Show/hide the educational info panel
      toggleEducationalPanel: () => {
        set((state) => ({
          showEducationalPanel: !state.showEducationalPanel,
        }));
      },

      // Reset everything to defaults
      resetPreferences: () => {
        set(DEFAULT_PREFERENCES);
      },
    }),
    {
      name: 'sortsphere-preferences',   // localStorage key name
      storage: createJSONStorage(() => localStorage),
      // Only persist these specific fields (not functions)
      partialize: (state) => ({
        favorites: state.favorites,
        lastAlgorithm: state.lastAlgorithm,
        barColor: state.barColor,
        showMetrics: state.showMetrics,
        showEducationalPanel: state.showEducationalPanel,
      }),
    }
  )
);