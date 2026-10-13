import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Menu, ShoppingCart, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore.js';
import '@/styles/layout.css';

export default function AppLayout() {
    const [menuOpen, setMenuOpen] = useState(false);

    const cartCount = useCartStore((state) =>
        state.items.reduce((sum, item) => sum + item.qty, 0),
    );

    return (
        <div className="app-shell">
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

            <main className="site-main">
                <Outlet />
            </main>

            <footer className="site-footer">
                Тёплый двор · Вкусная пауза в вашем дне
            </footer>
        </div>
    );
}