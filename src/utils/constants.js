export const STOP_REASONS = Object.freeze({
    MISSING: 'Нет ингредиента',
    INSUFFICIENT: 'Недостаточно',
    EXPIRED: 'Просрочен',
});

export const NOTIFICATION_TYPES = Object.freeze({
    STOPLIST: 'stoplist',
    HOT: 'hot',
    STOCK: 'stock',
    ORDER: 'order',
});

export const ORDER_STATUSES = Object.freeze({
    COOKING: 'Готовится',
    SERVED: 'Выдан',
    CANCELLED: 'Отменён',
});