/**
 * @typedef {{id: string, name: string, unit: string}} Product
 * @typedef {{id: string, productId: string, quantity: number, receivedAt: string, expiresAt: string}} Batch
 * @typedef {{id: string, name: string, category: string, price: number, weight: number, image: string, composition: Array<{productId: string, amount: number}>}} Dish
 * @typedef {{id: string, number: string, table: string, items: Array<{dishId: string, qty: number}>, total: number, status: string, createdAt: string, comment?: string}} Order
 * @typedef {{dishId: string, reason: string, missing: Array<{productId: string, need: number, have: number}>, since: string}} StopListItem
 * @typedef {{dishId: string, priority: number, reasons: string[]}} HotOffer
 * @typedef {{id: string, type: string, title: string, text: string, createdAt: string, read: boolean}} Notification
 */
export {};