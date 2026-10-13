import { STOP_REASONS } from '@/utils/constants.js';
import { availableProduct } from './availability.js';

export function computeStopList(dishes, batches, now = new Date()) {
    return dishes.flatMap((dish) => {
        const missing = dish.composition
            .map((part) => ({
                productId: part.productId,
                need: part.amount,
                have: availableProduct(part.productId, batches, now),
            }))
            .filter((part) => part.have + 1e-8 < part.need);

        if (!missing.length) return [];
        const reason = missing.some((item) => item.have === 0) ? STOP_REASONS.MISSING : STOP_REASONS.INSUFFICIENT;
        return [{ dishId: dish.id, reason, missing, since: now.toISOString() }];
    });
}