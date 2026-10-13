const photo = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

export const dishes = [
    { id: 'borsch', name: 'Борщ с говядиной', category: 'Супы', price: 490, weight: 350, image: photo('photo-1547592180-85f173990554'), composition: [{ productId: 'beef', amount: 0.08 }, { productId: 'potato', amount: 0.12 }, { productId: 'onion', amount: 0.03 }] },
    { id: 'cream-soup', name: 'Крем-суп из шампиньонов', category: 'Супы', price: 420, weight: 300, image: photo('photo-1547592166-23ac45744acd'), composition: [{ productId: 'mushroom', amount: 0.12 }, { productId: 'cream', amount: 0.08 }, { productId: 'onion', amount: 0.02 }] },
    { id: 'tomato-soup', name: 'Томатный суп с базиликом', category: 'Супы', price: 390, weight: 300, image: photo('photo-1547592180-85f173990554'), composition: [{ productId: 'tomato', amount: 0.18 }, { productId: 'basil', amount: 0.01 }, { productId: 'cream', amount: 0.04 }] },
    { id: 'chicken-pasta', name: 'Паста с курицей', category: 'Горячее', price: 590, weight: 320, image: photo('photo-1473093295043-cdd812d0e601'), composition: [{ productId: 'chicken', amount: 0.12 }, { productId: 'pasta', amount: 0.1 }, { productId: 'cream', amount: 0.04 }] },
    { id: 'salmon', name: 'Лосось с рисом', category: 'Горячее', price: 890, weight: 340, image: photo('photo-1467003909585-2f8a72700288'), composition: [{ productId: 'salmon', amount: 0.15 }, { productId: 'rice', amount: 0.1 }, { productId: 'lemon', amount: 0.02 }] },
    { id: 'steak', name: 'Стейк с картофелем', category: 'Горячее', price: 990, weight: 380, image: photo('photo-1546833999-b9f581a1996d'), composition: [{ productId: 'beef', amount: 0.18 }, { productId: 'potato', amount: 0.15 }] },
    { id: 'risotto', name: 'Ризотто с грибами', category: 'Горячее', price: 620, weight: 310, image: photo('photo-1476124369491-e7:addf5db371'), composition: [{ productId: 'rice', amount: 0.12 }, { productId: 'mushroom', amount: 0.09 }, { productId: 'cream', amount: 0.04 }] },
    { id: 'pizza', name: 'Пицца «Маргарита»', category: 'Горячее', price: 650, weight: 420, image: photo('photo-157 pizza'), composition: [{ productId: 'dough', amount: 0.22 }, { productId: 'tomato', amount: 0.1 }, { productId: 'mozzarella', amount: 0.12 }, { productId: 'basil', amount: 0.01 }] },
    { id: 'caesar', name: 'Салат «Цезарь»', category: 'Салаты', price: 560, weight: 260, image: photo('photo-1512852939750-1305098529bf'), composition: [{ productId: 'chicken', amount: 0.09 }, { productId: 'lettuce', amount: 0.08 }, { productId: 'egg', amount: 1 }] },
    { id: 'salmon-salad', name: 'Салат с лососем', category: 'Салаты', price: 740, weight: 250, image: photo('photo-1512621776951-a57141f2eefd'), composition: [{ productId: 'salmon', amount: 0.1 }, { productId: 'lettuce', amount: 0.07 }, { productId: 'avocado', amount: 0.05 }] },
    { id: 'greek', name: 'Греческий салат', category: 'Салаты', price: 480, weight: 240, image: photo('photo-1540420773420-3366772f4999'), composition: [{ productId: 'tomato', amount: 0.1 }, { productId: 'cucumber', amount: 0.08 }, { productId: 'mozzarella', amount: 0.05 }] },
    { id: 'bruschetta', name: 'Брускетта с томатами', category: 'Закуски', price: 360, weight: 180, image: photo('photo-1572695157366-5e585ab2b69f'), composition: [{ productId: 'tomato', amount: 0.08 }, { productId: 'basil', amount: 0.01 }, { productId: 'mozzarella', amount: 0.04 }] },
    { id: 'shrimp', name: 'Креветки с лимоном', category: 'Закуски', price: 690, weight: 180, image: photo('photo-1565680018434-b513d5e5fd47'), composition: [{ productId: 'shrimp', amount: 0.15 }, { productId: 'lemon', amount: 0.03 }] },
    { id: 'pancakes', name: 'Блины со сливками', category: 'Десерты', price: 390, weight: 210, image: photo('photo-1528207776546-365bb710ee93'), composition: [{ productId: 'flour2', amount: 0.08 }, { productId: 'milk', amount: 0.1 }, { productId: 'egg', amount: 1 }] },
    { id: 'brownie', name: 'Шоколадный брауни', category: 'Десерты', price: 420, weight: 150, image: photo('photo-1606313564200-e75d5e30476c'), composition: [{ productId: 'chocolate', amount: 0.06 }, { productId: 'egg', amount: 1 }, { productId: 'sugar', amount: 0.03 }] },
    { id: 'berry-cheesecake', name: 'Чизкейк с ягодами', category: 'Десерты', price: 460, weight: 160, image: photo('photo-1533134242443-d4fd215305ad'), composition: [{ productId: 'berry', amount: 0.04 }, { productId: 'cream', amount: 0.06 }, { productId: 'sugar', amount: 0.02 }] },
    { id: 'lemonade', name: 'Домашний лимонад', category: 'Напитки', price: 260, weight: 300, image: photo('photo-1513558161293-cdaf765edfd7'), composition: [{ productId: 'lemon', amount: 0.06 }, { productId: 'sugar', amount: 0.02 }] },
    { id: 'latte', name: 'Латте', category: 'Напитки', price: 280, weight: 250, image: photo('photo-1461023058943-07fcbe16d735'), composition: [{ productId: 'milk', amount: 0.18 }] },
];

export const categories = [
    'Все',
    'Супы',
    'Основные блюда',
    'Салаты',
    'Закуски',
    'Десерты',
    'Напитки',
];