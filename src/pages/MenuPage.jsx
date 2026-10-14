import { useEffect, useMemo, useState } from 'react';
import { Flame, Search } from 'lucide-react';
import DishCard from '@/components/DishCard.jsx';
import EmptyState from '@/components/EmptyState.jsx';
import { useDebounce } from '@/hooks/useDebounce.js';
import { useCartStore } from '@/store/cartStore.js';
import { useUiStore } from '@/store/uiStore.js';
import '@/styles/menu.css';

const menuCategories = [
    { id: 'all', label: 'Все' },
    { id: 'popular', label: 'Популярные' },
    { id: 'main', label: 'Обычные' },
    { id: 'inaccessible', label: 'Недоступные' },
];

function mapDishes(group, menuGroup) {
    if (!Array.isArray(group)) {
        return [];
    }

    return group
        .filter((dish) => dish && typeof dish.name === 'string')
        .map((dish) => ({
            // Согласно документации, название блюда уникально.
            id: dish.name,
            name: dish.name,
            price: Number(dish.price) || 0,
            image: dish.imageUrl || '',
            // Этих полей API пока не возвращает.
            weight: null,
            composition: [],
            menuGroup,
        }));
}

export default function MenuPage() {
    const [category, setCategory] = useState('all');
    const [menu, setMenu] = useState({
        popular: [],
        main: [],
        inaccessible: [],
    });
    const [menuLoading, setMenuLoading] = useState(true);
    const [menuError, setMenuError] = useState('');

    const search = useUiStore((state) => state.search);
    const setSearch = useUiStore((state) => state.setSearch);
    const debouncedSearch = useDebounce(search);

    const items = useCartStore((state) => state.items);
    const add = useCartStore((state) => state.add);
    const setQty = useCartStore((state) => state.setQty);

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
                    throw new Error(`Ошибка API: ${response.status}`);
                }

                const data = await response.json();

                setMenu({
                    popular: mapDishes(data.popular, 'popular'),
                    main: mapDishes(data.main, 'main'),
                    inaccessible: mapDishes(data.inaccessible, 'inaccessible'),
                });
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

    const allDishes = useMemo(
        () => [...menu.popular, ...menu.main, ...menu.inaccessible],
        [menu],
    );

    const filteredDishes = useMemo(() => {
        const query = debouncedSearch.trim().toLowerCase();

        const dishesForCategory =
            category === 'all' ? allDishes : menu[category];

        return dishesForCategory.filter((dish) =>
            dish.name.toLowerCase().includes(query),
        );
    }, [allDishes, category, debouncedSearch, menu]);

    const recommendedDishes = menu.popular.slice(0, 3);

    const showRecommendations =
        !menuLoading &&
        !menuError &&
        !search.trim() &&
        category === 'all' &&
        recommendedDishes.length > 0;

    const scrollToMenu = () => {
        const target =
            document.getElementById('recommendations-section') ||
            document.getElementById('menu-section');

        target?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    const getDishQuantity = (dishId) =>
        items.find((item) => item.dishId === dishId)?.qty || 0;

    const renderDishCard = (dish, key) => {
        const qty = getDishQuantity(dish.id);

        return (
            <DishCard
                key={key}
                dish={dish}
                qty={qty}
                stopped={
                    dish.menuGroup === 'inaccessible'
                        ? { dishId: dish.id }
                        : null
                }
                offer={
                    dish.menuGroup === 'popular'
                        ? { reasons: [] }
                        : null
                }
                onAdd={() => add(dish.id)}
                onRemove={() => setQty(dish.id, qty - 1)}
            />
        );
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
                    Выберите любимые блюда — мы приготовим их свежими и бережно
                    упакуем.
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
                            <Flame
                                size={14}
                                strokeWidth={1.8}
                                aria-hidden="true"
                            />
                            ВЫБОР ДНЯ
                        </span>
                    </div>

                    <div className="dish-grid dish-grid--featured">
                        {recommendedDishes.map((dish) =>
                            renderDishCard(
                                dish,
                                `recommended-${dish.id}`,
                            ),
                        )}
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
                <h2
                    className="menu-section__title menu-section__title--menu"
                    id="menu-title"
                >
                    Меню
                </h2>

                <div
                    className="category-list"
                    role="group"
                    aria-label="Категории меню"
                >
                    {menuCategories.map((item) => (
                        <button
                            key={item.id}
                            className={`category-button${
                                category === item.id
                                    ? ' category-button--active'
                                    : ''
                            }`}
                            type="button"
                            aria-pressed={category === item.id}
                            onClick={() => setCategory(item.id)}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                {menuLoading ? (
                    <p>Загружаем меню…</p>
                ) : menuError ? (
                    <p role="alert">
                        Не удалось загрузить меню: {menuError}
                    </p>
                ) : filteredDishes.length > 0 ? (
                    <div className="dish-grid">
                        {filteredDishes.map((dish) =>
                            renderDishCard(dish, dish.id),
                        )}
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