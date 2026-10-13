import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUiStore = create(
    persist(
        (set) => ({
            simulation: true,
            search: '',
            setSearch: (search) => set({ search }),
            toggleSimulation: () => set((state) => ({ simulation: !state.simulation })),
            reset: () => set({ simulation: true, search: '' }),
        }),
        { name: 'restaurant-pos-ui' },
    ),
);