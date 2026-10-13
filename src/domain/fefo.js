export function deductFefo(batches, productId, amount, now = new Date()) {
    let remaining = amount;
    const ordered = [...batches].sort((a, b) => new Date(a.expiresAt) - new Date(b.expiresAt));
    const next = ordered.map((batch) => {
        if (batch.productId !== productId || new Date(batch.expiresAt) <= now || remaining <= 0) return batch;
        const used = Math.min(batch.quantity, remaining);
        remaining -= used;
        return { ...batch, quantity: Number((batch.quantity - used).toFixed(4)) };
    });
    return { batches: next.filter((batch) => batch.quantity > 0.00001), remaining };
}

export function deductCartFefo(batches, cart, dishes, now = new Date()) {
    let next = [...batches];
    for (const item of cart) {
        const dish = dishes.find((entry) => entry.id === item.dishId);
        if (!dish) continue;
        for (const ingredient of dish.composition) {
            const result = deductFefo(next, ingredient.productId, ingredient.amount * item.qty, now);
            if (result.remaining > 0.00001) return { ok: false, batches, productId: ingredient.productId };
            next = result.batches;
        }
    }
    return { ok: true, batches: next };
}