import create from "zustand";

export const useLayoutStore = create((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (sidebarOpen) => set(() => ({ sidebarOpen })),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
