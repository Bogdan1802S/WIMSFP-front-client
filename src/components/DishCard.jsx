import PropTypes from 'prop-types';
import { Flame, Minus, Plus } from 'lucide-react';
import { money } from '@/utils/format.js';
import '@/styles/dish-card.css';

export default function DishCard({ dish, qty, stopped, offer, onAdd, onRemove }) {
    const hasItems = qty > 0;

    return (
        <article className={`dish-card${stopped ? ' dish-card--unavailable' : ''}`}>
            <div className={`dish-card__image-wrap${hasItems ? ' dish-card__image-wrap--has-quantity' : ''}`}>
                <img
                    className="dish-card__image"
                    src={dish.image}
                    alt={dish.name}
                    loading="lazy"
                />

                {stopped ? (
                    <span className="dish-card__badge dish-card__badge--unavailable">
            Временно недоступно
          </span>
                ) : offer ? (
                    <span
                        className="dish-card__badge dish-card__badge--recommended"
                        title={offer.reasons.join('. ')}
                    >
            <Flame size={13} strokeWidth={1.8} aria-hidden="true" />
            Рекомендуем
          </span>
                ) : null}

                {!stopped && (
                    <div className={`dish-card__image-actions${hasItems ? ' dish-card__image-actions--added' : ''}`}>
                        <button
                            className="dish-card__add-action"
                            type="button"
                            onClick={onAdd}
                            tabIndex={hasItems ? -1 : 0}
                            aria-hidden={hasItems}
                            aria-label={`Добавить ${dish.name} в корзину`}
                        >
                            <Plus size={17} aria-hidden="true" />
                            Добавить
                        </button>

                        <div className="dish-card__quantity" aria-hidden={!hasItems}>
                            <button
                                className="dish-card__quantity-button"
                                type="button"
                                aria-label={`Убрать одну порцию: ${dish.name}`}
                                onClick={onRemove}
                                tabIndex={hasItems ? 0 : -1}
                            >
                                <Minus size={17} aria-hidden="true" />
                            </button>

                            <span className="dish-card__quantity-label" aria-live="polite">
                {qty} в корзине
              </span>

                            <button
                                className="dish-card__quantity-button dish-card__quantity-button--plus"
                                type="button"
                                aria-label={`Добавить порцию: ${dish.name}`}
                                onClick={onAdd}
                                tabIndex={hasItems ? 0 : -1}
                            >
                                <Plus size={17} aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="dish-card__body">
                <div className="dish-card__details">
                    <h3 className="dish-card__name" title={dish.name}>
                        {dish.name}
                    </h3>

                    <div className="dish-card__price-row">
                        <span className="dish-card__price">{money(dish.price)}</span>
                        <span className="dish-card__weight">{dish.weight} г</span>
                    </div>
                </div>
            </div>
        </article>
    );
}

DishCard.propTypes = {
    dish: PropTypes.object.isRequired,
    qty: PropTypes.number.isRequired,
    stopped: PropTypes.object,
    offer: PropTypes.object,
    onAdd: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
};