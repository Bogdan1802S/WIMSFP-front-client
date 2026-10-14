import { useState } from 'react';
import { ChevronDown, MapPin, Menu, ShoppingCart, X } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { restaurantInfo } from '@/data/restaurantInfo.js';
import { useCartStore } from '@/store/cartStore.js';
import { useUiStore } from '@/store/uiStore.js';
import SiteFooter from '@/components/layout/SiteFooter.jsx';
import '@/styles/layout.css';
import '@/styles/order-mode.css';

const fulfillmentOptions = ['Самовывоз', 'В ресторане'];

export default function AppLayout() {
    const [menuOpen, setMenuOpen] = useState(false);

    const cartCount = useCartStore((state) =>
        state.items.reduce((sum, item) => sum + item.qty, 0),
    );

    const fulfillment = useUiStore((state) => state.fulfillment);
    const setFulfillment = useUiStore((state) => state.setFulfillment);
    const selectedVenueId = useUiStore((state) => state.selectedVenueId);
    const setSelectedVenueId = useUiStore((state) => state.setSelectedVenueId);

    const venues = restaurantInfo.venues.filter(
        (venue) => venue.address || venue.mapQuery,
    );

    const selectedVenue =
        venues.find((venue) => venue.id === selectedVenueId) || venues[0];

    return (
        <div className="app-shell" id="top">
            <header className="site-header">
                <div className="site-header__inner">
                    <Link className="brand" to="/" aria-label="Тёплый двор — на главную">
            <span className="brand__mark" aria-hidden="true">
              🍲
            </span>
                        <span className="brand__copy">
              <span className="brand__name">Тёплый двор</span>
              <span className="brand__caption">Домашняя кухня</span>
            </span>
                    </Link>

                    <label className="venue-picker">
                        <MapPin
                            className="venue-picker__icon"
                            size={18}
                            aria-hidden="true"
                        />
                        <span className="visually-hidden">Выберите адрес ресторана</span>

                        <select
                            value={selectedVenue?.id || ''}
                            onChange={(event) => setSelectedVenueId(event.target.value)}
                            disabled={venues.length === 0}
                            aria-label="Выберите адрес ресторана"
                        >
                            {venues.length === 0 ? (
                                <option value="">Добавьте адрес заведения</option>
                            ) : (
                                venues.map((venue) => (
                                    <option key={venue.id} value={venue.id}>
                                        {venue.shortAddress || venue.address || venue.mapQuery}
                                    </option>
                                ))
                            )}
                        </select>

                        <ChevronDown
                            className="venue-picker__chevron"
                            size={16}
                            aria-hidden="true"
                        />
                    </label>

                    <div className="site-header__actions">
                        <nav className="desktop-nav" aria-label="Основная навигация">
                            <NavLink
                                to="/"
                                end
                                className={({ isActive }) =>
                                    `nav-link${isActive ? ' nav-link--active' : ''}`
                                }
                            >
                                Меню
                            </NavLink>
                        </nav>

                        <Link
                            className="cart-link"
                            to="/cart"
                            aria-label={`Корзина, товаров: ${cartCount}`}
                        >
                            <ShoppingCart size={17} aria-hidden="true" />
                            <span>Корзина{cartCount ? ` · ${cartCount}` : ''}</span>
                        </Link>

                        <button
                            className="mobile-menu-button"
                            type="button"
                            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
                            aria-expanded={menuOpen}
                            onClick={() => setMenuOpen((open) => !open)}
                        >
                            {menuOpen ? <X size={19} /> : <Menu size={19} />}
                        </button>
                    </div>
                </div>

                {menuOpen && (
                    <nav className="mobile-menu" aria-label="Навигация">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                `mobile-menu__link${isActive ? ' mobile-menu__link--active' : ''}`
                            }
                            onClick={() => setMenuOpen(false)}
                        >
                            Меню
                        </NavLink>
                    </nav>
                )}
            </header>

            <section
                className="fulfillment-panel"
                aria-label="Способ получения заказа"
            >
                <div
                    className={`fulfillment-switch${
                        fulfillment === 'В ресторане'
                            ? ' fulfillment-switch--restaurant'
                            : ''
                    }`}
                    role="group"
                    aria-label="Способ получения заказа"
                >
                    <span className="fulfillment-switch__indicator" aria-hidden="true" />

                    {fulfillmentOptions.map((option) => (
                        <button
                            key={option}
                            className={`fulfillment-switch__option${
                                fulfillment === option
                                    ? ' fulfillment-switch__option--active'
                                    : ''
                            }`}
                            type="button"
                            aria-pressed={fulfillment === option}
                            onClick={() => setFulfillment(option)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </section>

            <main className="site-main">
                <Outlet />
            </main>

            <SiteFooter />
        </div>
    );
}