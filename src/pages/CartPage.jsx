import { useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { dishes } from '@/data/dishes.js';
import { products } from '@/data/products.js';
import { checkCart, maxCartDishQuantity } from '@/domain/availability.js';
import { useCartStore } from '@/store/cartStore.js';
import { useInventoryStore } from '@/store/inventoryStore.js';
import { money, quantity } from '@/utils/format.js';
import EmptyState from '@/components/EmptyState.jsx';
import '@/styles/cart.css';

function formatRussianPhone(value) {
    let digits = value.replace(/\D/g, '').slice(0, 11);

    if (digits.startsWith('7') || digits.startsWith('8')) {
        digits = digits.slice(1);
    }

    digits = digits.slice(0, 10);

    if (!digits) return '';

    let formatted = `+7-(${digits.slice(0, 3)}`;

    if (digits.length >= 3) formatted += ')';
    if (digits.length > 3) formatted += `-${digits.slice(3, 6)}`;
    if (digits.length > 6) formatted += `-${digits.slice(6, 8)}`;
    if (digits.length > 8) formatted += `-${digits.slice(8, 10)}`;

    return formatted;
}

export default function CartPage() {
    const cart = useCartStore((state) => state.items);
    const setQty = useCartStore((state) => state.setQty);
    const remove = useCartStore((state) => state.remove);
    const clear = useCartStore((state) => state.clear);
    const comment = useCartStore((state) => state.comment);
    const setComment = useCartStore((state) => state.setComment);
    const batches = useInventoryStore((state) => state.batches);

    const [customerName, setCustomerName] = useState('');
    const [phone, setPhone] = useState('');
    const phoneInputRef = useRef(null);
    const [fulfillment, setFulfillment] = useState('Самовывоз');
    const [confirmation, setConfirmation] = useState('');
    const [modalOpen, setModalOpen] = useState(false);

    const availability = useMemo(
        () => checkCart(cart, dishes, batches),
        [cart, batches],
    );

    const total = cart.reduce((sum, item) => {
        const dish = dishes.find((entry) => entry.id === item.dishId);
        return sum + (dish?.price || 0) * item.qty;
    }, 0);

    const handlePhoneKeyDown = (event) => {
        if (event.key !== 'Backspace') return;

        const input = event.currentTarget;
        const start = input.selectionStart ?? 0;
        const end = input.selectionEnd ?? start;
        const digitPositions = [];

        for (let index = 0; index < phone.length; index += 1) {
            if (/\d/.test(phone[index])) digitPositions.push(index);
        }

        const selectedDigits = digitPositions
            .map((position, digitIndex) => ({ position, digitIndex }))
            .filter(
                ({ position, digitIndex }) =>
                    position >= start && position < end && digitIndex > 0,
            );

        let removeIndex = -1;

        if (selectedDigits.length) {
            removeIndex = selectedDigits[0].digitIndex;
        } else if (start === end) {
            for (let index = digitPositions.length - 1; index >= 0; index -= 1) {
                if (digitPositions[index] < start) {
                    if (index > 0) removeIndex = index;
                    break;
                }
            }
        }

        event.preventDefault();
        if (removeIndex < 0) return;

        const digits = phone.replace(/\D/g, '').split('');
        digits.splice(removeIndex, selectedDigits.length || 1);

        const nextPhone = formatRussianPhone(digits.join(''));
        setPhone(nextPhone);

        const digitsBeforeCursor = phone.slice(0, start).replace(/\D/g, '').length;
        const nextDigitCount = Math.max(
            1,
            digitsBeforeCursor - (selectedDigits.length ? 0 : 1),
        );

        requestAnimationFrame(() => {
            const nextInput = phoneInputRef.current;
            if (!nextInput) return;

            let position = 0;
            let count = 0;

            while (position < nextPhone.length && count < nextDigitCount) {
                if (/\d/.test(nextPhone[position])) count += 1;
                position += 1;
            }

            nextInput.setSelectionRange(position, position);
        });
    };

    const submitOrder = () => {
        if (!customerName.trim()) {
            toast.error('Введите, пожалуйста, ваше имя');
            return;
        }

        if (phone.replace(/\D/g, '').length !== 11) {
            toast.error('Введите номер телефона полностью');
            return;
        }

        const result = useInventoryStore.getState().placeOrder(cart);

        if (!result.ok) {
            const details = result.missing
                .map((item) => {
                    const product = products.find((entry) => entry.id === item.productId);
                    return product
                        ? `${product.name}: нужно ${quantity(item.need)} ${product.unit}, доступно ${quantity(item.have)} ${product.unit}`
                        : 'Некоторые блюда сейчас недоступны';
                })
                .join('; ');

            toast.error('Не удалось оформить заказ. Обновите корзину.');
            setConfirmation(`Заказ не оформлен: ${details}`);
            setModalOpen(true);
            return;
        }

        const orderNumber = `ORD-${String(Date.now()).slice(-6)}`;

        clear();
        setConfirmation(`Заказ ${orderNumber} принят! Мы скоро начнём его готовить.`);
        setModalOpen(true);
        toast.success(`Заказ ${orderNumber} оформлен`);
    };

    if (cart.length === 0) {
        return (
            <EmptyState
                title="Корзина пока пуста"
                text="Выберите блюда в меню — они появятся здесь"
            />
        );
    }

    return (
        <div className="cart-page">
            <header className="cart-page__heading">
                <h1 className="cart-page__title">Ваш заказ</h1>
                <p className="cart-page__subtitle">
                    Проверьте блюда и заполните данные для оформления
                </p>
            </header>

            {!availability.available && (
                <div className="cart-alert" role="alert">
                    Некоторые блюда стали недоступны. Измените количество или удалите их из заказа.
                </div>
            )}

            <div className="cart-items">
                {cart.map((item) => {
                    const dish = dishes.find((entry) => entry.id === item.dishId);
                    if (!dish) return null;

                    const maxQty = maxCartDishQuantity(cart, dish, batches, dishes);

                    return (
                        <article className="cart-item" key={item.dishId}>
                            <img className="cart-item__image" src={dish.image} alt={dish.name} />
                            <div className="cart-item__details">
                                <h2 className="cart-item__name">{dish.name}</h2>
                                <p className="cart-item__meta">
                                    {dish.weight} г · {money(dish.price)}
                                </p>
                            </div>

                            <div className="cart-item__controls">
                                <button
                                    className="quantity-button"
                                    type="button"
                                    aria-label={`Уменьшить количество ${dish.name}`}
                                    onClick={() => setQty(item.dishId, item.qty - 1)}
                                >
                                    −
                                </button>
                                <span className="cart-item__quantity">{item.qty}</span>
                                <button
                                    className="quantity-button quantity-button--accent"
                                    type="button"
                                    aria-label={`Увеличить количество ${dish.name}`}
                                    disabled={item.qty >= maxQty}
                                    onClick={() => setQty(item.dishId, item.qty + 1)}
                                >
                                    +
                                </button>
                                <button
                                    className="remove-button"
                                    type="button"
                                    aria-label={`Удалить ${dish.name} из корзины`}
                                    onClick={() => remove(item.dishId)}
                                >
                                    <Trash2 size={17} aria-hidden="true" />
                                </button>
                            </div>
                        </article>
                    );
                })}
            </div>

            <section className="checkout-card">
                <h2 className="checkout-card__title">Как получить заказ</h2>

                <label className="form-field">
                    <span className="visually-hidden">Способ получения заказа</span>
                    <select
                        value={fulfillment}
                        onChange={(event) => setFulfillment(event.target.value)}
                        aria-label="Способ получения заказа"
                    >
                        <option>Самовывоз</option>
                        <option>В ресторане</option>
                    </select>
                </label>

                <label className="form-field">
                    <span className="visually-hidden">Ваше имя</span>
                    <input
                        value={customerName}
                        onChange={(event) => setCustomerName(event.target.value)}
                        placeholder="Ваше имя"
                        aria-label="Ваше имя"
                        autoComplete="name"
                        required
                    />
                </label>

                <label className="form-field">
                    <span className="visually-hidden">Номер телефона</span>
                    <input
                        ref={phoneInputRef}
                        value={phone}
                        onChange={(event) => setPhone(formatRussianPhone(event.target.value))}
                        onKeyDown={handlePhoneKeyDown}
                        placeholder="+7-(999)-999-99-99"
                        aria-label="Номер телефона"
                        type="tel"
                        inputMode="numeric"
                        maxLength={18}
                        autoComplete="tel"
                        required
                    />
                </label>

                <label className="form-field">
                    <span className="visually-hidden">Комментарий к заказу</span>
                    <textarea
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        placeholder="Комментарий к заказу, если нужен"
                        aria-label="Комментарий к заказу"
                        rows={3}
                    />
                </label>

                <div className="checkout-total">
                    <span>Итого</span>
                    <strong>{money(total)}</strong>
                </div>

                <button
                    className="checkout-submit"
                    type="button"
                    disabled={!availability.available}
                    onClick={submitOrder}
                >
                    Подтвердить заказ
                </button>

                {!availability.available && (
                    <p className="checkout-hint">
                        Сейчас нельзя оформить заказ: изменилось наличие некоторых блюд.
                    </p>
                )}
            </section>

            {modalOpen &&
                createPortal(
                    <div
                        className="modal-backdrop"
                        role="presentation"
                        onMouseDown={(event) => {
                            if (event.target === event.currentTarget) setModalOpen(false);
                        }}
                    >
                        <section
                            className="result-modal"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="result-modal-title"
                        >
                            <button
                                className="result-modal__close"
                                type="button"
                                aria-label="Закрыть"
                                onClick={() => setModalOpen(false)}
                            >
                                <X size={19} />
                            </button>
                            <h2 id="result-modal-title">
                                {confirmation.startsWith('Заказ ORD-')
                                    ? 'Заказ принят'
                                    : 'Не получилось оформить заказ'}
                            </h2>
                            <p>{confirmation}</p>
                            <button
                                className="checkout-submit result-modal__button"
                                type="button"
                                onClick={() => setModalOpen(false)}
                            >
                                Понятно
                            </button>
                        </section>
                    </div>,
                    document.body,
                )}
        </div>
    );
}