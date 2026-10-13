import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
    persist(
        (set) => ({
            items: [],
            table: 'Стол 1',
            comment: '',
            add: (dishId) =>
                set((state) => {
                    const item = state.items.find((entry) => entry.dishId === dishId);
                    return {
                        items: item
                            ? state.items.map((entry) => entry.dishId === dishId ? { ...entry, qty: entry.qty + 1 } : entry)
                            : [...state.items, { dishId, qty: 1 }],
                    };
                }),
            setQty: (dishId, qty) =>
                set((state) => ({
                    items: qty <= 0 ? state.items.filter((entry) => entry.dishId !== dishId) : state.items.map((entry) => entry.dishId === dishId ? { ...entry, qty } : entry),
                })),
            remove: (dishId) => set((state) => ({ items: state.items.filter((entry) => entry.dishId !== dishId) })),
            setTable: (table) => set({ table }),
            setComment: (comment) => set({ comment }),
            clear: () => set({ items: [], comment: '' }),
            reset: () => set({ items: [], table: 'Стол 1', comment: '' }),
        }),
        { name: 'restaurant-pos-cart' },
    ),
);