import { useMemo, useState } from 'react';
import { Badge, Box, Button, HStack, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { categories, dishes } from '@/data/dishes.js';
import { products } from '@/data/products.js';
import DishCard from '@/components/DishCard.jsx';
import EmptyState from '@/components/EmptyState.jsx';
import { useDebounce } from '@/hooks/useDebounce.js';
import { computeHotOffers } from '@/domain/hotOffers.js';
import { computeStopList } from '@/domain/stoplist.js';
import { useCartStore } from '@/store/cartStore.js';
import { useInventoryStore } from '@/store/inventoryStore.js';
import { useUiStore } from '@/store/uiStore.js';
import { Flame } from 'lucide-react';

export default function MenuPage() {
    const [category, setCategory] = useState('Все');
    const search = useUiStore((state) => state.search);
    const debouncedSearch = useDebounce(search);
    const items = useCartStore((state) => state.items);
    const add = useCartStore((state) => state.add);
    const setQty = useCartStore((state) => state.setQty);
    const batches = useInventoryStore((state) => state.batches);

    const stopList = useMemo(() => computeStopList(dishes, batches), [batches]);
    const offers = useMemo(
        () => computeHotOffers(dishes, products, batches, stopList),
        [batches, stopList],
    );

    const stoppedIds = useMemo(() => new Set(stopList.map((item) => item.dishId)), [stopList]);
    const offerMap = useMemo(
        () => new Map(offers.map((offer) => [offer.dishId, offer])),
        [offers],
    );

    const filteredDishes = useMemo(() => {
        const normalizedSearch = debouncedSearch.trim().toLowerCase();

        return dishes.filter((dish) => {
            const matchesCategory = category === 'Все' || dish.category === category;
            const matchesSearch = dish.name.toLowerCase().includes(normalizedSearch);
            return matchesCategory && matchesSearch;
        });
    }, [category, debouncedSearch]);

    const recommendedDishes = useMemo(
        () =>
            offers
                .slice(0, 3)
                .map((offer) => dishes.find((dish) => dish.id === offer.dishId))
                .filter(Boolean),
        [offers],
    );

    return (
        <VStack align="stretch" spacing={{ base: 6, md: 8 }}>
            <Box
                p={{ base: 6, md: 9 }}
                borderRadius="24px"
                bg="linear-gradient(120deg, #f7e5d4, #fff3e6)"
            >
                <Badge colorScheme="orange" borderRadius="full" px="3" py="1" mb="3">
                    Домашняя кухня · готовим с любовью
                </Badge>
                <Text
                    as="h1"
                    fontFamily="heading"
                    fontSize={{ base: '3xl', md: '5xl' }}
                    fontWeight="700"
                    lineHeight="1.1"
                >
                    Что сегодня
                    <br />
                    будет вкусного?
                </Text>
                <Text mt="3" color="gray.600" maxW="560px">
                    Выберите любимые блюда — мы приготовим их свежими и бережно упакуем.
                </Text>
                <Button as={Link} to="/cart" mt="5" colorScheme="orange" borderRadius="full">
                    Перейти к заказу
                </Button>
            </Box>

            {!search.trim() && category === 'Все' && recommendedDishes.length > 0 && (
                <Box>
                    <HStack justify="space-between" mb="4">
                        <Box>
                            <Text fontFamily="heading" fontSize="2xl" fontWeight="700">
                                Сегодня рекомендуем
                            </Text>
                            <Text color="gray.500" fontSize="sm">
                                Вкусные блюда, которые особенно хороши сегодня
                            </Text>
                        </Box>
                        <Badge
                            display="inline-flex"
                            alignItems="center"
                            gap="1.5"
                            color="#9b4d24"
                            bg="#fff0d8"
                            borderRadius="full"
                            px="3"
                            py="1.5"
                            fontSize="xs"
                            letterSpacing="0.04em"
                        >
                            <Flame size={14} strokeWidth={1.8} />
                            ВЫБОР ДНЯ
                        </Badge>
                    </HStack>
                    <SimpleGrid columns={{ base: 1, sm: 2, xl: 3 }} spacing="5">
                        {recommendedDishes.map((dish) => {
                            const qty = items.find((item) => item.dishId === dish.id)?.qty || 0;
                            return (
                                <DishCard
                                    key={`recommended-${dish.id}`}
                                    dish={dish}
                                    qty={qty}
                                    offer={offerMap.get(dish.id)}
                                    onAdd={() => add(dish.id)}
                                    onRemove={() => setQty(dish.id, qty - 1)}
                                />
                            );
                        })}
                    </SimpleGrid>
                </Box>
            )}

            <Box>
                <Text fontFamily="heading" fontSize="2xl" fontWeight="700" mb="4">
                    Меню
                </Text>

                <HStack spacing="2" overflowX="auto" pb="3" mb="3">
                    {categories.map((item) => (
                        <Button
                            key={item}
                            flexShrink={0}
                            size="sm"
                            borderRadius="full"
                            colorScheme={category === item ? 'orange' : 'gray'}
                            variant={category === item ? 'solid' : 'outline'}
                            onClick={() => setCategory(item)}
                        >
                            {item}
                        </Button>
                    ))}
                </HStack>

                {filteredDishes.length ? (
                    <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing="5">
                        {filteredDishes.map((dish) => {
                            const qty = items.find((item) => item.dishId === dish.id)?.qty || 0;
                            const stopped = stoppedIds.has(dish.id);

                            return (
                                <DishCard
                                    key={dish.id}
                                    dish={dish}
                                    qty={qty}
                                    stopped={stopped ? { dishId: dish.id } : null}
                                    offer={offerMap.get(dish.id)}
                                    onAdd={() => add(dish.id)}
                                    onRemove={() => setQty(dish.id, qty - 1)}
                                />
                            );
                        })}
                    </SimpleGrid>
                ) : (
                    <EmptyState title="Блюда не найдены" text="Попробуйте изменить поисковый запрос" />
                )}
            </Box>
        </VStack>
    );
}