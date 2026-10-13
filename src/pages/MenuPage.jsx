import { useMemo, useState } from 'react';
import { Flame, Search } from 'lucide-react';
import { categories, dishes } from '@/data/dishes.js';
import { products } from '@/data/products.js';
import DishCard from '@/components/DishCard.jsx';
import EmptyState from '@/components/EmptyState.jsx';
import { useDebounce } from '@/hooks/useDebounce.js';
import { computeHotOffers } from '@/domain/hotOffers.js';
import { computeStopList } from '@/domain/stoplist.js';
import { useCartStore } from '@/store/cartStore.js';
import { useInventoryStore } from '@/store/inventoryStore.js';
import { useUiStore } from '@/store/uiStore.js';
import '@/styles/menu.css';

export default function MenuPage() {
    const [category, setCategory] = useState('Все');

    const search = useUiStore((state) => state.search);
    const setSearch = useUiStore((state) => state.setSearch);
    const debouncedSearch = useDebounce(search);

    const items = useCartStore((state) => state.items);
    const add = useCartStore((state) => state.add);
    const setQty = useCartStore((state) => state.setQty);
    const batches = useInventoryStore((state) => state.batches);

    const stopList = useMemo(
        () => computeStopList(dishes, batches),
        [batches],
    );

    const offers = useMemo(
        () => computeHotOffers(dishes, products, batches, stopList),
        [batches, stopList],
    );

    const stoppedIds = useMemo(
        () => new Set(stopList.map((item) => item.dishId)),
        [stopList],
    );

    const offerMap = useMemo(
        () => new Map(offers.map((offer) => [offer.dishId, offer])),
        [offers],
    );

    const filteredDishes = useMemo(() => {
        const normalizedSearch = debouncedSearch.trim().toLowerCase();

        return dishes.filter((dish) => {
            const categoryMap = {
                'Основные блюда': 'Горячее',
            };

            const matchesCategory =
                category === 'Все' ||
                dish.category === (categoryMap[category] || category);

            const matchesSearch = dish.name
                .toLowerCase()
                .includes(normalizedSearch);

            return matchesCategory && matchesSearch;
        });
    }, [category, debouncedSearch]);

    const recommendedDishes = useMemo(
        () =>
            offers
                .slice(0, 3)
                .map((offer) => dishes.find((dish) => dish.id === offer.dishId))
                .filter(Boolean),
        [offers],
    );

    const showRecommendations =
        !search.trim() && category === 'Все' && recommendedDishes.length > 0;

    const scrollToMenu = () => {
        const target =
            document.getElementById('recommendations-section') ||
            document.getElementById('menu-section');

        target?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    return (
        <div className="menu-page">
            <section className="menu-hero">
        <span className="menu-hero__eyebrow">
          Домашняя кухня · готовим с любовью
        </span>

                <h1 className="menu-hero__title">
                    Что сегодня
                    <br />
                    будет вкусного?
                </h1>

                <p className="menu-hero__description">
                    Выберите любимые блюда — мы приготовим их свежими и бережно упакуем.
                </p>

                <button
                    className="menu-hero__button"
                    type="button"
                    onClick={scrollToMenu}
                >
                    Смотреть меню
                </button>
            </section>

            {showRecommendations && (
                <section
                    className="menu-section"
                    id="recommendations-section"
                    aria-labelledby="recommendations-title"
                >
                    <div className="menu-section__heading">
                        <div>
                            <h2
                                className="menu-section__title"
                                id="recommendations-title"
                            >
                                Сегодня рекомендуем
                            </h2>
                            <p className="menu-section__subtitle">
                                Вкусные блюда, которые особенно хороши сегодня
                            </p>
                        </div>

                        <span className="day-pick">
              <Flame size={14} strokeWidth={1.8} aria-hidden="true" />
              ВЫБОР ДНЯ
            </span>
                    </div>

                    <div className="dish-grid dish-grid--featured">
                        {recommendedDishes.map((dish) => {
                            const qty =
                                items.find((item) => item.dishId === dish.id)?.qty || 0;

                            return (
                                <DishCard
                                    key={`recommended-${dish.id}`}
                                    dish={dish}
                                    qty={qty}
                                    offer={offerMap.get(dish.id)}
                                    onAdd={() => add(dish.id)}
                                    onRemove={() => setQty(dish.id, qty - 1)}
                                />
                            );
                        })}
                    </div>
                </section>
            )}

            <label className="site-search menu-search">
                <Search size={20} aria-hidden="true" />
                <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Поиск"
                    aria-label="Поиск блюд"
                />
            </label>

            <section
                className="menu-section"
                id="menu-section"
                aria-labelledby="menu-title"
            >
                <h2 className="menu-section__title menu-section__title--menu" id="menu-title">
                    Меню
                </h2>

                <div className="category-list" role="group" aria-label="Категории меню">
                    {categories.map((item) => (
                        <button
                            key={item}
                            className={`category-button${
                                category === item ? ' category-button--active' : ''
                            }`}
                            type="button"
                            aria-pressed={category === item}
                            onClick={() => setCategory(item)}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                {filteredDishes.length > 0 ? (
                    <div className="dish-grid">
                        {filteredDishes.map((dish) => {
                            const qty =
                                items.find((item) => item.dishId === dish.id)?.qty || 0;
                            const stopped = stoppedIds.has(dish.id);

                            return (
                                <DishCard
                                    key={dish.id}
                                    dish={dish}
                                    qty={qty}
                                    stopped={stopped ? { dishId: dish.id } : null}
                                    offer={offerMap.get(dish.id)}
                                    onAdd={() => add(dish.id)}
                                    onRemove={() => setQty(dish.id, qty - 1)}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <EmptyState
                        title="Блюда не найдены"
                        text="Попробуйте изменить поисковый запрос или категорию"
                    />
                )}
            </section>
        </div>
    );
}