import {
    Avatar,
    Box,
    Button,
    Container,
    HStack,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    Text,
    useBreakpointValue,
    VStack,
} from '@chakra-ui/react';
import { Menu, Search, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore.js';
import { useUiStore } from '@/store/uiStore.js';

const navStyle = ({ isActive }) => ({
    color: isActive ? '#9b4d24' : '#61564d',
    background: isActive ? '#ffe7d1' : 'transparent',
    borderRadius: '999px',
    padding: '9px 15px',
    fontWeight: 600,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
});

export default function AppLayout() {
    const [menuOpen, setMenuOpen] = useState(false);
    const isMobile = useBreakpointValue({ base: true, md: false });
    const search = useUiStore((state) => state.search);
    const setSearch = useUiStore((state) => state.setSearch);
    const cartCount = useCartStore((state) =>
        state.items.reduce((sum, item) => sum + item.qty, 0),
    );

    return (
        <Box minH="100vh" bg="linear-gradient(135deg, #fff8f1 0%, #fbefe6 100%)">
            <Box bg="whiteAlpha.800" borderBottom="1px solid" borderColor="blackAlpha.100">
                <Container maxW="1280px" py="3">
                    <HStack justify="space-between" gap="4">
                        <HStack as={Link} to="/" spacing="3" flexShrink="0" _hover={{ textDecoration: 'none' }}>
                            <Box
                                display="grid"
                                placeItems="center"
                                w="42px"
                                h="42px"
                                borderRadius="15px"
                                bg="#f3c39e"
                                fontSize="22px"
                            >
                                🍲
                            </Box>
                            <Box>
                                <Text fontWeight="800" color="#382c23" lineHeight="1.2">
                                    Тёплый двор
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                    Домашняя кухня
                                </Text>
                            </Box>
                        </HStack>

                        {!isMobile && (
                            <InputGroup maxW="430px">
                                <InputLeftElement pointerEvents="none">
                                    <Search size={17} color="#93877c" />
                                </InputLeftElement>
                                <Input
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Найти блюдо..."
                                    bg="white"
                                    borderRadius="full"
                                    aria-label="Поиск блюд"
                                />
                            </InputGroup>
                        )}

                        <HStack spacing={{ base: 1, md: 3 }}>
                            {!isMobile && (
                                <HStack as="nav" spacing="1" aria-label="Навигация">
                                    <NavLink to="/" end style={navStyle}>
                                        Меню
                                    </NavLink>
                                </HStack>
                            )}
                            <Button
                                as={Link}
                                to="/cart"
                                leftIcon={<ShoppingCart size={17} />}
                                colorScheme="orange"
                                borderRadius="full"
                                aria-label={`Корзина, товаров: ${cartCount}`}
                            >
                                {isMobile ? cartCount : `Корзина${cartCount ? ` · ${cartCount}` : ''}`}
                            </Button>
                            {isMobile && (
                                <IconButton
                                    aria-label="Открыть меню"
                                    icon={<Menu size={19} />}
                                    variant="ghost"
                                    onClick={() => setMenuOpen((open) => !open)}
                                />
                            )}
                        </HStack>
                    </HStack>

                    {isMobile && menuOpen && (
                        <VStack align="stretch" pt="3" spacing="2">
                            <InputGroup>
                                <InputLeftElement pointerEvents="none">
                                    <Search size={17} color="#93877c" />
                                </InputLeftElement>
                                <Input
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Найти блюдо..."
                                    bg="white"
                                    borderRadius="full"
                                    aria-label="Поиск блюд"
                                />
                            </InputGroup>
                            <Button as={Link} to="/" justifyContent="flex-start" variant="ghost">
                                Меню
                            </Button>
                        </VStack>
                    )}
                </Container>
            </Box>

            <Container maxW="1280px" py={{ base: 5, md: 8 }}>
                <Outlet />
            </Container>

            <Box py="7" textAlign="center" color="gray.500" fontSize="sm">
                <Text>Тёплый двор · Вкусная пауза в вашем дне</Text>
            </Box>
        </Box>
    );
}