import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UiState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  showJobForm: boolean;
  toggleJobForm: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      // set() takes a FUNCTION when the new value depends on the old one
      toggleDarkMode: () =>
        set((state) => ({ isDarkMode: !state.isDarkMode })),
      showJobForm: false,
      toggleJobForm: () =>
        set((state) => ({ showJobForm: !state.showJobForm })),
      searchTerm: '',
      setSearchTerm: (term) => set({ searchTerm: term }),
    }),
    // Only the theme is worth remembering -- a search box still full of
    // old text after a reload would only confuse people.
    {
      name: 'itelect4-ui',
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
    }
  )
);

export default useUiStore;
// Named export for backwards compatibility
export { useUiStore };
