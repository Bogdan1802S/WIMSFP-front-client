import { Avatar, Badge, Box, Button, HStack, Icon, Switch, Text, VStack } from '@chakra-ui/react';
import { Bell, ChefHat, ClipboardList, Flame, LayoutGrid, ShoppingCart } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore.js';
import { useNotificationsStore } from '@/store/notificationsStore.js';
import { useInventoryStore } from '@/store/inventoryStore.js';
import { useOrdersStore } from '@/store/ordersStore.js';
import { useUiStore } from '@/store/uiStore.js';
import toast from 'react-hot-toast';

const mainLinks = [
    { to: '/', label: 'Меню и заказ', icon: LayoutGrid },
    { to: '/cart', label: 'Корзина', icon: ShoppingCart, count: () => useCartStore.getState().items.reduce((n, item) => n + item.qty, 0) },
    { to: '/stoplist', label: 'Стоп-лист', icon: ClipboardList, count: () => useInventoryStore.getState().getStopList().length },
    { to: '/hot', label: 'Горячие предложения', icon: Flame, count: () => useInventoryStore.getState().getHotOffers().length },
    { to: '/notifications', label: 'Уведомления', icon: Bell, count: () => useNotificationsStore.getState().notifications.filter((item) => !item.read).length },
    { to: '/orders', label: 'История заказов', icon: ShoppingBag },
];

export default function Sidebar() {
    const simulation = useUiStore((state) => state.simulation);
    const toggleSimulation = useUiStore((state) => state.toggleSimulation);

    const resetDemo = () => {
        useInventoryStore.getState().reset();
        useCartStore.getState().reset();
        useOrdersStore.getState().reset();
        useNotificationsStore.getState().reset();
        useUiStore.getState().reset();
        toast.success('Демо-данные сброшены');
    };

    return (
        <VStack align="stretch" h="100%" p="5" bg="#fbf1e8" spacing="7">
            <HStack><Box bg="orange.400" p="2" borderRadius="12"><Icon as={ChefHat} color="white" /></Box><Box><Text fontWeight="800">Тёплый двор</Text><Text fontSize="xs" color="gray.500">Зал и заказы</Text></Box></HStack>
            <Box>
                <Text fontSize="xs" color="gray.500" mb="3" textTransform="uppercase">Основное</Text>
                <VStack align="stretch" spacing="1">
                    {mainLinks.map((link) => (
                        <NavLink key={link.to} to={link.to} end={link.to === '/'} style={({ isActive }) => ({
                            display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 12px', borderRadius: '10px',
                            color: isActive ? '#8f401c' : '#5f5a55', background: isActive ? '#ffe2c6' : 'transparent',
                            fontSize: '14px', textDecoration: 'none',
                        })}>
                            <Icon as={link.icon} boxSize="4" />
                            <Text flex="1">{link.label}</Text>
                            {link.count && link.count() > 0 && <Badge borderRadius="full" colorScheme="orange">{link.count()}</Badge>}
                        </NavLink>
                    ))}
                </VStack>
            </Box>
            <Box mt="auto">
                <HStack justify="space-between" mb="4"><Text fontSize="sm">Демо-симуляция</Text><Switch isChecked={simulation} onChange={toggleSimulation} colorScheme="orange" aria-label="Включить симуляцию" /></HStack>
                <Button variant="ghost" size="sm" w="full" mb="4" onClick={resetDemo}>Сбросить демо-данные</Button>
                <HStack borderTop="1px solid" borderColor="blackAlpha.100" pt="4">
                    <Avatar size="sm" name="Анна Смирнова" />
                    <Box flex="1"><Text fontSize="sm" fontWeight="700">Анна Смирнова</Text><Text fontSize="xs" color="gray.500">Официант</Text></Box>
                    <Text color="gray.400">⌄</Text>
                </HStack>
            </Box>
        </VStack>
    );
}