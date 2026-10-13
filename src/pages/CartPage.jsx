import {
    Alert,
    AlertIcon,
    Box,
    Button,
    Card,
    CardBody,
    HStack,
    Image,
    Input,
    Select,
    Text,
    Textarea,
    VStack,
    useDisclosure,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from '@chakra-ui/react';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { dishes } from '@/data/dishes.js';
import { products } from '@/data/products.js';
import { checkCart, maxCartDishQuantity } from '@/domain/availability.js';
import { useCartStore } from '@/store/cartStore.js';
import { useInventoryStore } from '@/store/inventoryStore.js';
import { money, quantity } from '@/utils/format.js';
import EmptyState from '@/components/EmptyState.jsx';
import { useMemo, useRef, useState } from 'react';

function formatRussianPhone(value) {
    let digits = value.replace(/\D/g, '').slice(0, 11);

    // Если номер вставили с кодом страны или начальной 8, убираем этот префикс:
    // маска сама добавит +7.
    if (digits.startsWith('7') || digits.startsWith('8')) {
        digits = digits.slice(1);
    }

    digits = digits.slice(0, 10);

    if (!digits) return '';

    let formatted = `+7-(${digits.slice(0, 3)}`;

    if (digits.length >= 3) {
        formatted += ')';
    }

    if (digits.length > 3) {
        formatted += `-${digits.slice(3, 6)}`;
    }

    if (digits.length > 6) {
        formatted += `-${digits.slice(6, 8)}`;
    }

    if (digits.length > 8) {
        formatted += `-${digits.slice(8, 10)}`;
    }

    return formatted;
}

export default function CartPage() {
    const cart = useCartStore((state) => state.items);
    const setQty = useCartStore((state) => state.setQty);
    const remove = useCartStore((state) => state.remove);
    const clear = useCartStore((state) => state.clear);
    const comment = useCartStore((state) => state.comment);
    const setComment = useCartStore((state) => state.setComment);
    const batches = useInventoryStore((state) => state.batches);
    const [customerName, setCustomerName] = useState('');
    const [phone, setPhone] = useState('');
    const phoneInputRef = useRef(null);
    const [fulfillment, setFulfillment] = useState('Самовывоз');
    const [confirmation, setConfirmation] = useState('');
    const modal = useDisclosure();

    const availability = useMemo(
        () => checkCart(cart, dishes, batches),
        [cart, batches],
    );

    const total = cart.reduce((sum, item) => {
        const dish = dishes.find((entry) => entry.id === item.dishId);
        return sum + (dish?.price || 0) * item.qty;
    }, 0);

    const handlePhoneKeyDown = (event) => {
        if (event.key !== 'Backspace') return;

        const input = event.currentTarget;
        const start = input.selectionStart ?? 0;
        const end = input.selectionEnd ?? start;
        const digitPositions = [];

        for (let index = 0; index < phone.length; index += 1) {
            if (/\d/.test(phone[index])) digitPositions.push(index);
        }

        const selectedDigits = digitPositions
            .map((position, digitIndex) => ({ position, digitIndex }))
            .filter(({ position, digitIndex }) => position >= start && position < end && digitIndex > 0);

        let removeIndex = -1;

        if (selectedDigits.length) {
            removeIndex = selectedDigits[0].digitIndex;
        } else if (start === end) {
            for (let index = digitPositions.length - 1; index >= 0; index -= 1) {
                if (digitPositions[index] < start) {
                    // Первая цифра — код страны 7, его маска не удаляет.
                    if (index > 0) removeIndex = index;
                    break;
                }
            }
        }

        event.preventDefault();

        if (removeIndex < 0) return;

        const digits = phone.replace(/\D/g, '').split('');
        digits.splice(removeIndex, selectedDigits.length || 1);

        const nextPhone = formatRussianPhone(digits.join(''));
        setPhone(nextPhone);

        const digitsBeforeCursor = phone
            .slice(0, start)
            .replace(/\D/g, '')
            .length;
        const nextDigitCount = Math.max(
            1,
            digitsBeforeCursor - (selectedDigits.length ? 0 : 1),
        );

        requestAnimationFrame(() => {
            const nextInput = phoneInputRef.current;
            if (!nextInput) return;

            let position = 0;
            let count = 0;

            while (position < nextPhone.length && count < nextDigitCount) {
                if (/\d/.test(nextPhone[position])) count += 1;
                position += 1;
            }

            nextInput.setSelectionRange(position, position);
        });
    };

    const submitOrder = () => {
        if (!customerName.trim()) {
            toast.error('Введите, пожалуйста, ваше имя');
            return;
        }

        if (phone.replace(/\D/g, '').length !== 11) {
            toast.error('Введите номер телефона полностью');
            return;
        }

        const result = useInventoryStore.getState().placeOrder(cart);

        if (!result.ok) {
            const details = result.missing
                .map((item) => {
                    const product = products.find((entry) => entry.id === item.productId);
                    return product
                        ? `${product.name}: нужно ${quantity(item.need)} ${product.unit}, доступно ${quantity(item.have)} ${product.unit}`
                        : 'Некоторые блюда сейчас недоступны';
                })
                .join('; ');

            toast.error('Не удалось оформить заказ. Обновите корзину.');
            setConfirmation(`Заказ не оформлен: ${details}`);
            modal.onOpen();
            return;
        }

        const orderNumber = `ORD-${String(Date.now()).slice(-6)}`;

        clear();
        setConfirmation(`Заказ ${orderNumber} принят! Мы скоро начнём его готовить.`);
        modal.onOpen();
        toast.success(`Заказ ${orderNumber} оформлен`);
    };

    if (cart.length === 0) {
        return (
            <EmptyState
                title="Корзина пока пуста"
                text="Выберите блюда в меню — они появятся здесь"
            />
        );
    }

    return (
        <VStack align="stretch" spacing="5">
            <Box>
                <Text fontFamily="heading" fontSize="3xl" fontWeight="700">
                    Ваш заказ
                </Text>
                <Text color="gray.500">Проверьте блюда и заполните данные для оформления</Text>
            </Box>

            {!availability.available && (
                <Alert status="warning" borderRadius="14px">
                    <AlertIcon />
                    Некоторые блюда стали недоступны. Измените количество или удалите их из заказа.
                </Alert>
            )}

            {cart.map((item) => {
                const dish = dishes.find((entry) => entry.id === item.dishId);
                if (!dish) return null;

                const maxQty = maxCartDishQuantity(cart, dish, batches, dishes);

                return (
                    <Card key={item.dishId} bg="white">
                        <CardBody>
                            <HStack align="center" spacing="4">
                                <Image
                                    src={dish.image}
                                    alt={dish.name}
                                    boxSize={{ base: '68px', md: '88px' }}
                                    borderRadius="14px"
                                    objectFit="cover"
                                />
                                <Box flex="1">
                                    <Text fontWeight="700">{dish.name}</Text>
                                    <Text color="gray.500" fontSize="sm">
                                        {dish.weight} г · {money(dish.price)}
                                    </Text>
                                </Box>
                                <HStack spacing="2">
                                    <Button
                                        aria-label={`Уменьшить количество ${dish.name}`}
                                        onClick={() => setQty(item.dishId, item.qty - 1)}
                                    >
                                        −
                                    </Button>
                                    <Text minW="6" textAlign="center" fontWeight="700">
                                        {item.qty}
                                    </Text>
                                    <Button
                                        aria-label={`Увеличить количество ${dish.name}`}
                                        colorScheme="orange"
                                        isDisabled={item.qty >= maxQty}
                                        onClick={() => setQty(item.dishId, item.qty + 1)}
                                    >
                                        +
                                    </Button>
                                    <Button
                                        aria-label={`Удалить ${dish.name} из корзины`}
                                        variant="ghost"
                                        colorScheme="red"
                                        onClick={() => remove(item.dishId)}
                                    >
                                        <Trash2 size={17} />
                                    </Button>
                                </HStack>
                            </HStack>
                        </CardBody>
                    </Card>
                );
            })}

            <Card bg="white">
                <CardBody>
                    <VStack align="stretch" spacing="4">
                        <Text fontSize="xl" fontWeight="700">
                            Как получить заказ
                        </Text>

                        <Select
                            value={fulfillment}
                            onChange={(event) => setFulfillment(event.target.value)}
                            aria-label="Способ получения заказа"
                        >
                            <option>Самовывоз</option>
                            <option>В ресторане</option>
                        </Select>

                        <Input
                            value={customerName}
                            onChange={(event) => setCustomerName(event.target.value)}
                            placeholder="Ваше имя"
                            aria-label="Ваше имя"
                            isRequired
                        />

                        <Input
                            ref={phoneInputRef}
                            value={phone}
                            onChange={(event) => setPhone(formatRussianPhone(event.target.value))}
                            onKeyDown={handlePhoneKeyDown}
                            placeholder="+7-(999)-999-99-99"
                            aria-label="Номер телефона"
                            type="tel"
                            inputMode="numeric"
                            maxLength={18}
                            isRequired
                        />

                        <Textarea
                            value={comment}
                            onChange={(event) => setComment(event.target.value)}
                            placeholder="Комментарий к заказу, если нужен"
                            aria-label="Комментарий к заказу"
                        />

                        <HStack justify="space-between" borderTop="1px solid" borderColor="blackAlpha.100" pt="4">
                            <Text fontWeight="700">Итого</Text>
                            <Text fontSize="2xl" fontWeight="800" color="#98451f">
                                {money(total)}
                            </Text>
                        </HStack>

                        <Button
                            colorScheme="orange"
                            size="lg"
                            isDisabled={!availability.available}
                            onClick={submitOrder}
                        >
                            Подтвердить заказ
                        </Button>

                        {!availability.available && (
                            <Text color="red.600" fontSize="sm">
                                Сейчас нельзя оформить заказ: изменилось наличие некоторых блюд.
                            </Text>
                        )}
                    </VStack>
                </CardBody>
            </Card>

            <Modal isOpen={modal.isOpen} onClose={modal.onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {confirmation.startsWith('Заказ ORD-') ? 'Заказ принят' : 'Не получилось оформить заказ'}
                    </ModalHeader>
                    <ModalBody>{confirmation}</ModalBody>
                    <ModalFooter>
                        <Button colorScheme="orange" onClick={modal.onClose}>
                            Понятно
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </VStack>
    );
}