import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialOrders } from '@/data/initialOrders.js';

export const useOrdersStore = create(
    persist(
        (set) => ({
            orders: initialOrders,
            addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
            reset: () => set({ orders: initialOrders }),
        }),
        { name: 'restaurant-pos-orders' },
    ),
);