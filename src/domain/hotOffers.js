import { differenceInHours } from 'date-fns';
import { availableProduct } from './availability.js';

export function computeHotOffers(dishes, products, batches, stopList, now = new Date()) {
    const stopped = new Set(stopList.map((item) => item.dishId));
    const productUsage = new Map();
    for (const dish of dishes) {
        for (const ingredient of dish.composition) {
            productUsage.set(ingredient.productId, (productUsage.get(ingredient.productId) || 0) + 1);
        }
    }

    return dishes
        .filter((dish) => !stopped.has(dish.id))
        .map((dish) => {
            let score = 0;
            const reasons = [];
            for (const ingredient of dish.composition) {
                const lots = batches
                    .filter((batch) => batch.productId === ingredient.productId && batch.quantity > 0 && new Date(batch.expiresAt) > now)
                    .sort((a, b) => new Date(a.expiresAt) - new Date(b.expiresAt));
                const lot = lots[0];
                if (!lot) continue;
                const hoursLeft = Math.max(0, differenceInHours(new Date(lot.expiresAt), now));
                const share = Math.min(1, availableProduct(ingredient.productId, batches, now) / (ingredient.amount * 10));
                const urgency = 1 / (hoursLeft + 1);
                const multiDishBonus = Math.min(0.4, (productUsage.get(ingredient.productId) || 1) * 0.08);
                score += urgency * (ingredient.amount / Math.max(ingredient.amount, 0.05)) + share * 0.25 + multiDishBonus;
                if (hoursLeft <= 48) {
                    const product = products.find((entry) => entry.id === ingredient.productId);
                    reasons.push(`Использует ${product?.name || 'ингредиент'} (партия истекает через ${hoursLeft} ч)`);
                }
            }
            return { dishId: dish.id, priority: Math.max(0, Math.min(5, Math.ceil(score * 2))), score, reasons };
        })
        .filter((offer) => offer.priority >= 2 && offer.reasons.length)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8);
}