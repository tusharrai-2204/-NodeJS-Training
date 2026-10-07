import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIStore {
    sidebarCollapsed: boolean;
    lastVisitedPage: string;
    toggleSidebar: () => void; // just update the sidebarCollapsed value
    setLastVisitedPage: (page: string) => void; // just updates the lastVisitedPage value
};

export const useUIStore = create<UIStore>()(
    persist(
        (set) => ({
            sidebarCollapsed: false,
            lastVisitedPage: '/',
            toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
            setLastVisitedPage: (page) => set({ lastVisitedPage: page }),
        }),
        {
            name: "ui-store" // key-name in localstorage
        }
    )
);