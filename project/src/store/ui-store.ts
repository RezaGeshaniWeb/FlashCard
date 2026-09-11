import { create } from 'zustand';

interface UiState {
  sidebarOpen: boolean;
  studyNotesOpen: boolean;
  globalSearchOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setStudyNotesOpen: (open: boolean) => void;
  toggleStudyNotes: () => void;
  setGlobalSearchOpen: (open: boolean) => void;
  toggleGlobalSearch: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: false,
  studyNotesOpen: false,
  globalSearchOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setStudyNotesOpen: (open) => set({ studyNotesOpen: open }),
  toggleStudyNotes: () => set((s) => ({ studyNotesOpen: !s.studyNotesOpen })),
  setGlobalSearchOpen: (open) => set({ globalSearchOpen: open }),
  toggleGlobalSearch: () =>
    set((s) => ({ globalSearchOpen: !s.globalSearchOpen })),
}));
