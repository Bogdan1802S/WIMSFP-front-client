import {
    Badge,
    Box,
    Button,
    Card,
    CardBody,
    HStack,
    Image,
    Text,
    VStack,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { money } from '@/utils/format.js';
import { Flame, Minus, Plus } from 'lucide-react';

export default function DishCard({ dish, qty, stopped, offer, onAdd, onRemove }) {
    return (
        <Card
            overflow="hidden"
            bg="white"
            border="1px solid"
            borderColor="blackAlpha.50"
            boxShadow="0 4px 20px rgba(120,80,40,.08)"
            transition="transform .2s, box-shadow .2s"
            _hover={!stopped ? { transform: 'translateY(-2px)', boxShadow: 'lg' } : undefined}
        >
            <Box position="relative">
                <Image
                    src={dish.image}
                    alt={dish.name}
                    w="100%"
                    h={{ base: '190px', md: '210px' }}
                    objectFit="cover"
                    filter={stopped ? 'grayscale(1)' : 'none'}
                    opacity={stopped ? 0.55 : 1}
                />
                {stopped ? (
                    <Badge position="absolute" top="3" left="3" colorScheme="red" borderRadius="full" px="3">
                        Временно недоступно
                    </Badge>
                ) : offer ? (
                    <Badge
                        position="absolute"
                        top="3"
                        left="3"
                        display="inline-flex"
                        alignItems="center"
                        gap="1"
                        color="#9b4d24"
                        bg="#fff0d8"
                        borderRadius="full"
                        px="3"
                        py="1"
                        title={offer.reasons.join('. ')}
                    >
                        <Flame size={13} strokeWidth={1.8} />
                        Рекомендуем
                    </Badge>
                ) : null}
            </Box>

            <CardBody>
                <VStack align="stretch" spacing="4">
                    <VStack align="stretch" spacing="0.2">
                        <Text fontWeight="700" noOfLines={1}>
                            {dish.name}
                        </Text>

                        <HStack justify="space-between">
                            <Text fontWeight="700" color="brand.600">
                                {money(dish.price)}
                            </Text>
                            <Text color="gray.500" fontSize="sm">
                                {dish.weight} г
                            </Text>
                        </HStack>
                    </VStack>

                    {stopped ? (
                        <Button isDisabled w="full" variant="outline">
                            Временно недоступно
                        </Button>
                    ) : qty > 0 ? (
                        <HStack justify="space-between">
                            <Button
                                aria-label={`Убрать одну порцию: ${dish.name}`}
                                variant="outline"
                                onClick={onRemove}
                            >
                                <Minus size={17} />
                            </Button>

                            <Text fontWeight="700">{qty} в корзине</Text>

                            <Button
                                aria-label={`Добавить порцию: ${dish.name}`}
                                colorScheme="orange"
                                onClick={onAdd}
                            >
                                <Plus size={17} />
                            </Button>
                        </HStack>
                    ) : (
                        <Button
                            w="full"
                            colorScheme="orange"
                            onClick={onAdd}
                        >
                            Добавить
                        </Button>
                    )}
                </VStack>
            </CardBody>
        </Card>
    );
}

DishCard.propTypes = {
    dish: PropTypes.object.isRequired,
    qty: PropTypes.number.isRequired,
    stopped: PropTypes.object,
    offer: PropTypes.object,
    onAdd: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
};