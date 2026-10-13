import PropTypes from 'prop-types';
import { Flame, Minus, Plus } from 'lucide-react';
import { money } from '@/utils/format.js';
import '@/styles/dish-card.css';

export default function DishCard({ dish, qty, stopped, offer, onAdd, onRemove }) {
    return (
        <article className={`dish-card${stopped ? ' dish-card--unavailable' : ''}`}>
            <div className="dish-card__image-wrap">
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

                {!stopped && qty === 0 && (
                    <button
                        className="dish-card__image-add"
                        type="button"
                        onClick={onAdd}
                    >
                        Добавить
                    </button>
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

                {!stopped && qty > 0 && (
                    <div className="dish-card__quantity">
                        <button
                            className="dish-card__icon-button"
                            type="button"
                            aria-label={`Убрать одну порцию: ${dish.name}`}
                            onClick={onRemove}
                        >
                            <Minus size={17} aria-hidden="true" />
                        </button>

                        <span className="dish-card__quantity-label" aria-live="polite">
      {qty} в корзине
    </span>

                        <button
                            className="dish-card__icon-button dish-card__icon-button--accent"
                            type="button"
                            aria-label={`Добавить порцию: ${dish.name}`}
                            onClick={onAdd}
                        >
                            <Plus size={17} aria-hidden="true" />
                        </button>
                    </div>
                )}
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