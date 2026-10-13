export function availableProduct(productId, batches, now = new Date()) {
    return batches
        .filter((batch) => batch.productId === productId && new Date(batch.expiresAt) > now)
        .reduce((sum, batch) => sum + batch.quantity, 0);
}

export function maxDishPortions(dish, batches, now = new Date()) {
    if (!dish.composition.length) return 0;
    return Math.min(
        ...dish.composition.map((ingredient) => {
            const have = availableProduct(ingredient.productId, batches, now);
            return Math.floor((have + 1e-8) / ingredient.amount);
        }),
    );
}

export function checkCart(cart, dishes, batches, now = new Date()) {
    const needs = new Map();
    for (const item of cart) {
        const dish = dishes.find((entry) => entry.id === item.dishId);
        if (!dish) continue;
        for (const ingredient of dish.composition) {
            needs.set(ingredient.productId, (needs.get(ingredient.productId) || 0) + ingredient.amount * item.qty);
        }
    }

    const missing = [];
    for (const [productId, need] of needs) {
        const have = availableProduct(productId, batches, now);
        if (have + 1e-8 < need) missing.push({ productId, need, have });
    }
    return { available: missing.length === 0, missing };
}

export function maxCartDishQuantity(cart, dish, batches, dishes, now = new Date()) {
    const others = cart.filter((item) => item.dishId !== dish.id);
    let max = maxDishPortions(dish, batches, now);
    for (let qty = 1; qty <= max; qty += 1) {
        if (!checkCart([...others, { dishId: dish.id, qty }], dishes, batches, now).available) {
            max = qty - 1;
            break;
        }
    }
    return max;
}