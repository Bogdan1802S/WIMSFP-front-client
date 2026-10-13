import { Box, Button, Card, CardBody, HStack, Select, Text, VStack } from '@chakra-ui/react';
import { Bell, Flame, Package, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { useNotificationsStore } from '@/store/notificationsStore.js';
import { timeAgo } from '@/utils/format.js';
import EmptyState from '@/components/EmptyState.jsx';

const iconFor = { stoplist: ShieldAlert, hot: Flame, stock: Package, order: Bell };

export default function NotificationsPage() {
    const [filter, setFilter] = useState('Все');
    const notifications = useNotificationsStore((state) => state.notifications);
    const markRead = useNotificationsStore((state) => state.markRead);
    const readAll = useNotificationsStore((state) => state.readAll);
    const visible = notifications.filter((item) => filter === 'Все' || item.type === filter);
    return (
        <VStack align="stretch" spacing="5">
            <HStack justify="space-between" wrap="wrap"><Box><Text fontFamily="heading" fontSize="3xl" fontWeight="700">Уведомления</Text><Text color="gray.500">События по блюдам, партиям и заказам</Text></Box><Button variant="outline" onClick={readAll}>Прочитать все</Button></HStack>
            <Select maxW="240px" value={filter} onChange={(event) => setFilter(event.target.value)}><option>Все</option><option value="stoplist">Стоп-лист</option><option value="hot">Горячие предложения</option><option value="stock">Остатки</option><option value="order">Заказы</option></Select>
            {visible.length ? visible.map((item) => {
                const Icon = iconFor[item.type] || Bell;
                return <Card key={item.id} opacity={item.read ? 0.65 : 1} onClick={() => markRead(item.id)} cursor="pointer"><CardBody><HStack align="start"><Icon size={20} /><Box flex="1"><Text fontWeight="700">{item.title}</Text><Text color="gray.600">{item.text}</Text><Text fontSize="xs" color="gray.500" mt="2">{timeAgo(item.createdAt)}</Text></Box>{!item.read && <Text color="orange.600" fontSize="sm">Новое</Text>}</HStack></CardBody></Card>;
            }) : <EmptyState title="Уведомлений нет" text="Новые события появятся здесь" />}
        </VStack>
    );
}