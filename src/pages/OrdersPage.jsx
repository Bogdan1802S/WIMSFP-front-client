import { useState } from 'react';
import { Box, Button, Card, CardBody, Collapse, HStack, Table, Tbody, Td, Th, Thead, Tr, Text } from '@chakra-ui/react';
import { dishes } from '@/data/dishes.js';
import { useOrdersStore } from '@/store/ordersStore.js';
import { money, dateTime } from '@/utils/format.js';
import StatusPill from '@/components/StatusPill.jsx';
import EmptyState from '@/components/EmptyState.jsx';

export default function OrdersPage() {
    const orders = useOrdersStore((state) => state.orders);
    const [expanded, setExpanded] = useState('');
    return (
        <Box>
            <Text fontFamily="heading" fontSize="3xl" fontWeight="700" mb="1">История заказов</Text>
            <Text color="gray.500" mb="5">Последние заказы зала</Text>
            {orders.length ? <Card overflowX="auto"><CardBody>
                <Table size="sm"><Thead><Tr><Th>№ заказа</Th><Th>Стол</Th><Th>Позиции</Th><Th>Сумма</Th><Th>Статус</Th><Th>Время</Th></Tr></Thead>
                    <Tbody>{orders.map((order) => <Tr key={order.id} cursor="pointer" onClick={() => setExpanded(expanded === order.id ? '' : order.id)}>
                        <Td fontWeight="700">{order.number}</Td><Td>{order.table}</Td><Td>{order.items.reduce((sum, item) => sum + item.qty, 0)}</Td><Td>{money(order.total)}</Td><Td><StatusPill>{order.status}</StatusPill></Td><Td>{dateTime(order.createdAt)}</Td>
                    </Tr>)}</Tbody>
                </Table>
                {orders.map((order) => <Collapse key={order.id} in={expanded === order.id}><HStack p="3" bg="orange.50" borderRadius="12" mt="2"><Text fontWeight="600">Состав:</Text><Text>{order.items.map((item) => `${dishes.find((dish) => dish.id === item.dishId)?.name} × ${item.qty}`).join(', ')}</Text></HStack></Collapse>)}
            </CardBody></Card> : <EmptyState title="Заказов пока нет" />}
        </Box>
    );
}