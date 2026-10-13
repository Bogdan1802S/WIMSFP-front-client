import { useMemo, useState } from 'react';
import { Box, Card, CardBody, HStack, Input, Select, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { dishes } from '@/data/dishes.js';
import { products } from '@/data/products.js';
import { timeAgo, quantity } from '@/utils/format.js';
import StatusPill from '@/components/StatusPill.jsx';
import EmptyState from '@/components/EmptyState.jsx';
import { useInventoryStore } from '@/store/inventoryStore.js';
import { computeStopList } from '@/domain/stoplist.js';

export default function StopListPage() {
    const [query, setQuery] = useState('');
    const [reason, setReason] = useState('Все причины');
    const batches = useInventoryStore((state) => state.batches);

    const stopList = useMemo(
        () => computeStopList(dishes, batches),
        [batches],
    );
    const rows = useMemo(() => stopList.map((item) => ({
        ...item,
        dish: dishes.find((dish) => dish.id === item.dishId),
    })).filter((item) =>
        item.dish?.name.toLowerCase().includes(query.toLowerCase()) &&
        (reason === 'Все причины' || item.reason === reason),
    ), [stopList, query, reason]);

    return (
        <VStack align="stretch" spacing="5">
            <Box><Text fontFamily="heading" fontSize="3xl" fontWeight="700">Стоп-лист</Text><Text color="gray.500">Доступность блюд пересчитывается по текущим партиям</Text></Box>
            <HStack><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск блюда" /><Select maxW="240px" value={reason} onChange={(event) => setReason(event.target.value)}><option>Все причины</option><option>Нет ингредиента</option><option>Недостаточно</option></Select></HStack>
            {rows.length ? <SimpleGrid columns={{ base: 1, md: 2 }} spacing="4">{rows.map((item) => (
                <Card key={item.dishId}><CardBody><VStack align="stretch" spacing="3">
                    <HStack justify="space-between"><Text fontWeight="700">{item.dish?.name}</Text><StatusPill>{item.reason}</StatusPill></HStack>
                    <Text color="gray.600">Не хватает: {item.missing.map((part) => {
                        const product = products.find((entry) => entry.id === part.productId);
                        return `${product?.name} ${quantity(Math.max(0, part.need - part.have))} ${product?.unit}`;
                    }).join(', ')}</Text>
                    <Text fontSize="sm" color="gray.500">{timeAgo(item.since)}</Text>
                </VStack></CardBody></Card>
            ))}</SimpleGrid> : <EmptyState title="Стоп-лист пуст" text="Все блюда доступны для заказа" />}
        </VStack>
    );
}