import { useEffect } from 'react';
import { addDays } from 'date-fns';
import { useInventoryStore } from '@/store/inventoryStore.js';
import { useUiStore } from '@/store/uiStore.js';
import { products } from '@/data/products.js';

export function useSimulation() {
    const enabled = useUiStore((state) => state.simulation);

    useEffect(() => {
        const tick = window.setInterval(() => useInventoryStore.getState().refreshTime(), 60000);
        if (!enabled) return () => window.clearInterval(tick);

        const timer = window.setInterval(() => {
            const product = products[Math.floor(Math.random() * products.length)];
            const state = useInventoryStore.getState();
            if (Math.random() > 0.5) {
                state.addBatch({
                    id: `demo-${Date.now()}`,
                    productId: product.id,
                    quantity: 0.25 + Math.random() * 0.5,
                    receivedAt: new Date().toISOString(),
                    expiresAt: addDays(new Date(), 5).toISOString(),
                });
            } else {
                const batches = [...state.batches];
                const target = batches.find((batch) => batch.productId === product.id && batch.quantity > 0.05);
                if (target) target.quantity = Math.max(0, target.quantity - 0.05);
                state.setBatches(batches);
            }
            state.refreshTime();
        }, 21000);

        return () => {
            window.clearInterval(timer);
            window.clearInterval(tick);
        };
    }, [enabled]);
}