import { addDays, subDays } from 'date-fns';
import { products } from './products.js';

const now = new Date();
const quantities = [0.08, 0.2, 0.11, 1.1, 1.2, 0.07, 0.3, 0.55, 0.7, 0.08, 1, 0.12, 0.09, 0.3, 0.2, 0.12, 4, 1, 0.08, 0.3, 0.25, 0.3, 0.4, 0.4, 0.08];

export const batches = products.flatMap((product, index) => {
    const firstExpiryDays = [0.25, 0.4, 0.7, 2, 3, 0.35, 1, 2, 2, 0.3, 4, 1, 0.3, 2, 1, 3, 2, 2, 3, 0.7, 2, 3, 2, 3, 0.3][index];
    return [
        {
            id: `${product.id}-a`,
            productId: product.id,
            quantity: quantities[index],
            receivedAt: subDays(now, 1).toISOString(),
            expiresAt: addDays(now, firstExpiryDays).toISOString(),
        },
        {
            id: `${product.id}-b`,
            productId: product.id,
            quantity: Math.max(quantities[index] * 1.4, 0.12),
            receivedAt: now.toISOString(),
            expiresAt: addDays(now, 7 + (index % 5)).toISOString(),
        },
    ];
});