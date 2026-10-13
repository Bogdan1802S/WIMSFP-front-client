import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useNotificationsStore = create(
    persist(
        (set) => ({
            notifications: [],
            add: (notification) => set((state) => ({
                notifications: [notification, ...state.notifications.filter((entry) => entry.id !== notification.id)].slice(0, 50),
            })),
            markRead: (id) => set((state) => ({
                notifications: state.notifications.map((item) => item.id === id ? { ...item, read: true } : item),
            })),
            readAll: () => set((state) => ({
                notifications: state.notifications.map((item) => ({ ...item, read: true })),
            })),
            reset: () => set({ notifications: [] }),
        }),
        { name: 'restaurant-pos-notifications' },
    ),
);