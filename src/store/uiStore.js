import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUiStore = create(
    persist(
        (set) => ({
            simulation: true,
            search: '',
            fulfillment: 'Самовывоз',
            selectedVenueId: '',

            setSearch: (search) => set({ search }),
            setFulfillment: (fulfillment) => set({ fulfillment }),
            setSelectedVenueId: (selectedVenueId) => set({ selectedVenueId }),

            toggleSimulation: () =>
                set((state) => ({ simulation: !state.simulation })),

            reset: () =>
                set({
                    simulation: true,
                    search: '',
                    fulfillment: 'Самовывоз',
                    selectedVenueId: '',
                }),
        }),
        { name: 'restaurant-pos-ui' },
    ),
);