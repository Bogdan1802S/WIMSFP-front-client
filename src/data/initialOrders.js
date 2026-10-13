import { subMinutes } from 'date-fns';

export const initialOrders = [
    { id: 'ord-101', number: 'ORD-101', table: 'Стол 4', items: [{ dishId: 'borsch', qty: 2 }, { dishId: 'lemonade', qty: 1 }], total: 1240, status: 'Выдан', createdAt: subMinutes(new Date(), 28).toISOString() },
    { id: 'ord-102', number: 'ORD-102', table: 'Стол 2', items: [{ dishId: 'caesar', qty: 1 }], total: 560, status: 'Готовится', createdAt: subMinutes(new Date(), 19).toISOString() },
    { id: 'ord-103', number: 'ORD-103', table: 'Стол 7', items: [{ dishId: 'brownie', qty: 2 }], total: 840, status: 'Выдан', createdAt: subMinutes(new Date(), 12).toISOString() },
];