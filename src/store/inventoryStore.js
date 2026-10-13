import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { batches as initialBatches } from '@/data/batches.js';
import { dishes } from '@/data/dishes.js';
import { products } from '@/data/products.js';
import { checkCart } from '@/domain/availability.js';
import { deductCartFefo } from '@/domain/fefo.js';
import { computeStopList } from '@/domain/stoplist.js';
import { computeHotOffers } from '@/domain/hotOffers.js';

export const useInventoryStore = create(
    persist(
        (set, get) => ({
            batches: initialBatches,
            tick: Date.now(),
            setBatches: (batches) => set({ batches }),
            addBatch: (batch) => set((state) => ({ batches: [...state.batches, batch] })),
            refreshTime: () => set({ tick: Date.now() }),
            reset: () => set({ batches: initialBatches, tick: Date.now() }),
            getStopList: () => computeStopList(dishes, get().batches),
            getHotOffers: () => computeHotOffers(dishes, products, get().batches, get().getStopList()),
            checkCart: (cart) => checkCart(cart, dishes, get().batches),
            placeOrder: (cart) => {
                const validation = checkCart(cart, dishes, get().batches);
                if (!validation.available) return { ok: false, missing: validation.missing };
                const result = deductCartFefo(get().batches, cart, dishes);
                if (!result.ok) return { ok: false, missing: [{ productId: result.productId, need: 0, have: 0 }] };
                set({ batches: result.batches });
                return { ok: true };
            },
        }),
        { name: 'restaurant-pos-inventory' },
    ),
);