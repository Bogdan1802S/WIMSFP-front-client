import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/cartStore.js';
import { useUiStore } from '@/store/uiStore.js';
import { money } from '@/utils/format.js';
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

function mapMenuGroup(group, menuGroup) {
    if (!Array.isArray(group)) return [];

    return group
        .filter((dish) => dish && typeof dish.name === 'string')
        .map((dish) => ({
            id: dish.name,
            name: dish.name,
            price: Number(dish.price) || 0,
            image: dish.imageUrl || '',
            menuGroup,
        }));
}

async function getResponseMessage(response) {
    const text = await response.text();

    if (!text) {
        return `Ошибка сервера: ${response.status}`;
    }

    try {
        const parsed = JSON.parse(text);

        if (typeof parsed === 'string') return parsed;
        return parsed.message || parsed.title || text;
    } catch {
        return text;
    }
}

export default function CartPage() {
    const cart = useCartStore((state) => state.items);
    const setQty = useCartStore((state) => state.setQty);
    const remove = useCartStore((state) => state.remove);
    const clear = useCartStore((state) => state.clear);
    const comment = useCartStore((state) => state.comment);

    const fulfillment = useUiStore((state) => state.fulfillment);
    const setFulfillment = useUiStore((state) => state.setFulfillment);

    const [menuDishes, setMenuDishes] = useState([]);
    const [menuLoading, setMenuLoading] = useState(true);
    const [menuError, setMenuError] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [phone, setPhone] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [orderSucceeded, setOrderSucceeded] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const phoneInputRef = useRef(null);

    useEffect(() => {
        const controller = new AbortController();

        async function loadMenu() {
            try {
                setMenuLoading(true);
                setMenuError('');

                const response = await fetch('/api/v1/menu/', {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(`Не удалось загрузить меню: ${response.status}`);
                }

                const data = await response.json();

                setMenuDishes([
                    ...mapMenuGroup(data.popular, 'popular'),
                    ...mapMenuGroup(data.main, 'main'),
                    ...mapMenuGroup(data.inaccessible, 'inaccessible'),
                ]);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    setMenuError(error.message || 'Не удалось загрузить меню');
                }
            } finally {
                if (!controller.signal.aborted) {
                    setMenuLoading(false);
                }
            }
        }

        loadMenu();

        return () => controller.abort();
    }, []);

    const dishById = useMemo(
        () => new Map(menuDishes.map((dish) => [dish.id, dish])),
        [menuDishes],
    );

    const cartHasUnknownDish = cart.some((item) => !dishById.has(item.dishId));

    const cartHasUnavailableDish = cart.some((item) => {
        const dish = dishById.get(item.dishId);
        return dish && dish.menuGroup === 'inaccessible';
    });

    const total = cart.reduce((sum, item) => {
        const dish = dishById.get(item.dishId);
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

    const submitOrder = async () => {
        if (!customerName.trim()) {
            toast.error('Введите, пожалуйста, ваше имя');
            return;
        }

        if (phone.replace(/\D/g, '').length !== 11) {
            toast.error('Введите номер телефона полностью');
            return;
        }

        if (menuLoading || menuError) {
            toast.error('Не удалось проверить меню. Попробуйте обновить страницу.');
            return;
        }

        if (cartHasUnknownDish) {
            toast.error('Некоторые блюда отсутствуют в текущем меню. Удалите их из корзины.');
            return;
        }

        if (cartHasUnavailableDish) {
            toast.error('Некоторые блюда сейчас недоступны. Удалите их из корзины.');
            return;
        }

        if (cart.length === 0) {
            toast.error('Корзина пуста');
            return;
        }

        const orderBody = {
            customerName: customerName.trim(),
            contactPhone: phone.trim(),
            format: fulfillment === 'В ресторане' ? 1 : 0,
            comment: comment?.trim() || '',
            created: new Date().toISOString(),
            dishes: cart.map((item) => {
                const dish = dishById.get(item.dishId);

                return {
                    dishName: dish.name,
                    count: item.qty,
                };
            }),
        };

        try {
            setSubmitting(true);

            const response = await fetch('/api/v1/order/makeOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderBody),
            });

            if (!response.ok) {
                const message = await getResponseMessage(response);

                if (message.toLowerCase().includes('order cancelled')) {
                    setOrderSucceeded(false);
                    setConfirmation(
                        'Backend отменил заказ: не хватило ингредиентов. Заказ записан как отменённый; корзина сохранена.',
                    );
                    setModalOpen(true);
                    toast.error('Заказ отменён: не хватило ингредиентов');
                    return;
                }

                throw new Error(message);
            }

            const orderNumber = `ORD-${String(Date.now()).slice(-6)}`;

            clear();
            setOrderSucceeded(true);
            setConfirmation(`Заказ ${orderNumber} принят!`);
            setModalOpen(true);
            toast.success('Заказ оформлен');
        } catch (error) {
            setOrderSucceeded(false);
            setConfirmation(error.message || 'Не удалось оформить заказ');
            setModalOpen(true);
            toast.error(error.message || 'Не удалось оформить заказ');
        } finally {
            setSubmitting(false);
        }
    };

    if (cart.length === 0) {
        return (
            <EmptyState
                title="Корзина пока пуста"
                text="Выберите блюда в меню — они появятся здесь"
            />
        );
    }

    const orderBlocked =
        menuLoading ||
        Boolean(menuError) ||
        cartHasUnknownDish ||
        cartHasUnavailableDish ||
        submitting;

    return (
        <div className="cart-page">
            <header className="cart-page__heading">
                <h1 className="cart-page__title">Ваш заказ</h1>
                <p className="cart-page__subtitle">
                    Проверьте блюда и заполните данные для оформления
                </p>
            </header>

            {menuLoading && <p>Загружаем меню…</p>}

            {menuError && (
                <div className="cart-alert" role="alert">
                    {menuError}
                </div>
            )}

            {!menuLoading && !menuError && cartHasUnknownDish && (
                <div className="cart-alert" role="alert">
                    Одно или несколько блюд из сохранённой корзины отсутствуют в
                    меню. Удалите такие позиции и добавьте блюда заново из меню.
                </div>
            )}

            {!menuLoading && !menuError && cartHasUnavailableDish && (
                <div className="cart-alert" role="alert">
                    Некоторые блюда сейчас недоступны. Удалите их из заказа,
                    чтобы продолжить.
                </div>
            )}

            <div className="cart-items">
                {cart.map((item) => {
                    const dish = dishById.get(item.dishId);

                    if (!dish) {
                        return (
                            <article className="cart-item" key={item.dishId}>
                                <div className="cart-item__details">
                                    <h2 className="cart-item__name">
                                        Блюдо больше недоступно в меню
                                    </h2>
                                    <p className="cart-item__meta">
                                        Удалите позицию и добавьте блюдо снова из меню.
                                    </p>
                                </div>

                                <button
                                    className="remove-button"
                                    type="button"
                                    aria-label="Удалить недоступное блюдо из корзины"
                                    onClick={() => remove(item.dishId)}
                                >
                                    <Trash2 size={17} aria-hidden="true" />
                                </button>
                            </article>
                        );
                    }

                    return (
                        <article className="cart-item" key={item.dishId}>
                            {dish.image && (
                                <img
                                    className="cart-item__image"
                                    src={dish.image}
                                    alt={dish.name}
                                />
                            )}

                            <div className="cart-item__details">
                                <h2 className="cart-item__name">{dish.name}</h2>
                                <p className="cart-item__meta">
                                    {money(dish.price)}
                                    {dish.menuGroup === 'inaccessible' &&
                                        ' · Недоступно'}
                                </p>
                            </div>

                            <div className="cart-item__controls">
                                <button
                                    className="quantity-button"
                                    type="button"
                                    aria-label={`Уменьшить количество ${dish.name}`}
                                    onClick={() =>
                                        setQty(item.dishId, item.qty - 1)
                                    }
                                >
                                    −
                                </button>

                                <span className="cart-item__quantity">
                                    {item.qty}
                                </span>

                                <button
                                    className="quantity-button quantity-button--accent"
                                    type="button"
                                    aria-label={`Увеличить количество ${dish.name}`}
                                    onClick={() =>
                                        setQty(item.dishId, item.qty + 1)
                                    }
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
                    <span className="visually-hidden">
                        Способ получения заказа
                    </span>
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
                        onChange={(event) =>
                            setPhone(formatRussianPhone(event.target.value))
                        }
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
                    <span className="visually-hidden">
                        Комментарий к заказу
                    </span>
                    <textarea
                        value={comment}
                        placeholder="Комментарий к заказу, если нужен"
                        aria-label="Комментарий к заказу"
                        rows={3}
                        readOnly
                    />
                </label>

                <div className="checkout-total">
                    <span>Итого</span>
                    <strong>{money(total)}</strong>
                </div>

                <button
                    className="checkout-submit"
                    type="button"
                    disabled={orderBlocked}
                    onClick={submitOrder}
                >
                    {submitting ? 'Отправляем заказ…' : 'Подтвердить заказ'}
                </button>
            </section>

            {modalOpen &&
                createPortal(
                    <div
                        className="modal-backdrop"
                        role="presentation"
                        onMouseDown={(event) => {
                            if (event.target === event.currentTarget) {
                                setModalOpen(false);
                            }
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
                                {orderSucceeded
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