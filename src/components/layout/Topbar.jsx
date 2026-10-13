import { Avatar, HStack, IconButton, Input, InputGroup, InputLeftElement, Box } from '@chakra-ui/react';
import { ArrowLeft, ArrowRight, Bell, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUiStore } from '@/store/uiStore.js';
import { useNotificationsStore } from '@/store/notificationsStore.js';

export default function Topbar() {
    const navigate = useNavigate();
    const search = useUiStore((state) => state.search);
    const setSearch = useUiStore((state) => state.setSearch);
    const unread = useNotificationsStore((state) => state.notifications.filter((item) => !item.read).length);

    return (
        <HStack h="72px" px={{ base: 4, md: 7 }} bg="whiteAlpha.800" borderBottom="1px solid" borderColor="blackAlpha.50">
            <IconButton aria-label="Назад" icon={<ArrowLeft size={18} />} variant="ghost" onClick={() => navigate(-1)} />
            <IconButton aria-label="Вперёд" icon={<ArrowRight size={18} />} variant="ghost" onClick={() => navigate(1)} />
            <InputGroup maxW="560px" mx="auto">
                <InputLeftElement><Search size={17} color="#988d82" /></InputLeftElement>
                <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Поиск блюд и заказов..." bg="white" borderRadius="full" />
            </InputGroup>
            <Box position="relative">
                <IconButton aria-label="Уведомления" icon={<Bell size={19} />} variant="ghost" onClick={() => navigate('/notifications')} />
                {unread > 0 && <Box position="absolute" top="2" right="2" w="2" h="2" bg="red.500" borderRadius="full" />}
            </Box>
            <Avatar size="sm" name="Анна Смирнова" />
        </HStack>
    );
}