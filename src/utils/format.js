import { formatDistanceToNow, format } from 'date-fns';
import { ru } from 'date-fns/locale';

export const money = (value) =>
    new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(value);

export const timeAgo = (date) => formatDistanceToNow(new Date(date), { addSuffix: true, locale: ru });

export const dateTime = (date) => format(new Date(date), 'dd.MM.yyyy, HH:mm', { locale: ru });

export const quantity = (value) => Number(value.toFixed(2)).toLocaleString('ru-RU');