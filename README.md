<div align="center">

# 🍽️ WIMSFP

### Веб-приложение для управления рестораном

Меню, корзина, заказы, стоп-лист, акции и уведомления — в одном интерфейсе.

<p>
  <img src="https://img.shields.io/badge/React-18.3.1-149eca?logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/Vite-6.0.5-646cff?logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Chakra_UI-2.10.9-319795?logo=chakraui&logoColor=white" alt="Chakra UI">
  <img src="https://img.shields.io/badge/license-private-lightgrey" alt="Private project">
</p>

**Ветка:** `main` · **Статус:** частный проект

</div>

---

## 📌 Содержание

- [О проекте](#-о-проекте)
- [Технологический стек](#-технологический-стек)
- [Структура проекта](#-структура-проекта)
- [Установка и запуск](#-установка-и-запуск)
- [Доступные команды](#-доступные-команды)
- [Участие в разработке](#-участие-в-разработке)
- [Лицензия](#-лицензия)

## 🍴 О проекте

WIMSFP — клиентское веб-приложение для работы с рестораном. Оно предоставляет интерфейс для управления меню, заказами и запасами, а также для просмотра акций и уведомлений.

Для локальной разработки запросы к `/api` проксируются на backend по адресу `http://localhost:5094`.

## 🚀 Технологический стек

### Основные технологии

| Технология | Роль в проекте |
|---|---|
| [React](https://react.dev/) | Построение пользовательского интерфейса |
| [Vite](https://vite.dev/) | Dev-сервер и сборка приложения |
| JavaScript ES Modules | Организация модулей приложения |

### Интерфейс и стилизация

| Библиотека | Роль в проекте |
|---|---|
| [Chakra UI](https://chakra-ui.com/) | Компоненты и инструменты для интерфейса |
| [Emotion](https://emotion.sh/) | CSS-in-JS, используемый Chakra UI |
| CSS | Стили приложения в `src/styles/` |
| [Framer Motion](https://www.framer.com/motion/) | Анимации и переходы |
| [Lucide React](https://lucide.dev/) | Иконки для React |

### Состояние и маршрутизация

| Библиотека | Роль в проекте |
|---|---|
| [Zustand](https://zustand.docs.pmnd.rs/) | Управление состоянием приложения |
| [React Router DOM](https://reactrouter.com/) | Навигация между страницами |

### Утилиты и инструменты

| Инструмент | Роль в проекте |
|---|---|
| [date-fns](https://date-fns.org/) | Работа с датами |
| [react-hot-toast](https://react-hot-toast.com/) | Toast-уведомления |
| [PropTypes](https://github.com/facebook/prop-types) | Проверка props компонентов |
| [ESLint](https://eslint.org/) | Проверка JavaScript-кода |
| [Prettier](https://prettier.io/) | Форматирование кода |
| Oxlint | Конфигурация находится в `.oxlintrc.json` |

## 📁 Структура проекта

```text
.
├── public/                 # Публичные статические файлы
├── src/
│   ├── components/         # Переиспользуемые компоненты
│   │   └── layout/         # Общая компоновка приложения
│   ├── data/               # Данные и начальные значения
│   ├── domain/             # Бизнес-логика
│   ├── hooks/              # Пользовательские React-хуки
│   ├── pages/              # Страницы приложения
│   ├── store/              # Zustand-хранилища
│   ├── styles/             # CSS-стили
│   ├── theme/              # Настройки темы
│   ├── utils/               # Утилиты и константы
│   ├── App.jsx             # Корневой компонент и маршруты
│   └── main.jsx            # Точка входа приложения
├── .eslintrc.cjs           # Настройки ESLint
├── .oxlintrc.json          # Настройки Oxlint
├── .prettierrc             # Настройки Prettier
├── index.html              # HTML-шаблон
├── package.json            # Зависимости и команды
├── package-lock.json       # Зафиксированные версии зависимостей
└── vite.config.js          # Настройки Vite и API-прокси
```

<details>
<summary><strong>🧩 Компоненты и страницы</strong></summary>

`src/components/` — общие компоненты интерфейса и элементы разметки.

```text
components/
├── DishCard.jsx
├── EmptyState.jsx
├── StatCard.jsx
├── StatusPill.jsx
└── layout/
    ├── AppLayout.jsx
    ├── Sidebar.jsx
    ├── SiteFooter.jsx
    └── Topbar.jsx
```

`src/pages/` — страницы приложения.

```text
pages/
├── CartPage.jsx
├── HotOffersPage.jsx
├── MenuPage.jsx
├── NotificationsPage.jsx
├── OrdersPage.jsx
└── StopListPage.jsx
```

</details>

<details>
<summary><strong>📦 Данные и бизнес-логика</strong></summary>

`src/data/` — данные о блюдах, продуктах, заказах и ресторане.

```text
data/
├── batches.js
├── dishes.js
├── initialOrders.js
├── products.js
├── restaurantInfo.js
└── types.js
```

`src/domain/` — правила доступности, стоп-лист и логика предложений.

```text
domain/
├── availability.js
├── fefo.js
├── hotOffers.js
└── stoplist.js
```

</details>

<details>
<summary><strong>⚙️ Хранилища, хуки и утилиты</strong></summary>

`src/store/` — состояние корзины, запасов, уведомлений, заказов и интерфейса.

```text
store/
├── cartStore.js
├── inventoryStore.js
├── notificationsStore.js
├── ordersStore.js
└── uiStore.js
```

`src/hooks/` — пользовательские хуки.

```text
hooks/
├── useDebounce.js
└── useSimulation.js
```

`src/utils/` — общие константы и функции форматирования.

```text
utils/
├── constants.js
└── format.js
```

</details>

<details>
<summary><strong>🎨 Стили и тема</strong></summary>

Стили находятся в `src/styles/`, настройки темы — в `src/theme/`.

```text
src/
├── styles/
│   ├── cart.css
│   ├── components.css
│   ├── dish-card.css
│   ├── footer.css
│   ├── global.css
│   ├── layout.css
│   ├── menu.css
│   └── order-mode.css
└── theme/
    └── index.js
```

</details>

## 🛠️ Установка и запуск

**Требования:** Node.js, npm и запущенный backend, если приложению нужны данные API.

```bash
# Установить зависимости
npm ci

# Запустить dev-сервер
npm run dev
```

Для production-сборки и локального предпросмотра:

```bash
npm run build
npm run preview
```

Проверить код можно командой:

```bash
npm run lint
```

> **Backend:** в `vite.config.js` запросы `/api` перенаправляются на `http://localhost:5094`. Если backend работает по другому адресу, измените `target` в конфигурации Vite.

## 📜 Доступные команды

| Команда | Описание |
|---|---|
| `npm run dev` | Запуск dev-сервера |
| `npm run build` | Production-сборка в `dist/` |
| `npm run preview` | Предпросмотр production-сборки |
| `npm run lint` | Проверка кода с помощью ESLint |