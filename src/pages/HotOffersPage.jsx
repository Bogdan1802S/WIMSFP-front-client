import { Badge, Box, Button, Card, CardBody, HStack, Image, SimpleGrid, Text, VStack, useDisclosure, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Stack } from '@chakra-ui/react';
import { Star } from 'lucide-react';
import { dishes } from '@/data/dishes.js';
import { useInventoryStore } from '@/store/inventoryStore.js';
import { useCartStore } from '@/store/cartStore.js';
import { money } from '@/utils/format.js';
import EmptyState from '@/components/EmptyState.jsx';
import toast from 'react-hot-toast';
import { useMemo, useState } from 'react';
import { products } from '@/data/products.js';
import { computeStopList } from '@/domain/stoplist.js';
import { computeHotOffers } from '@/domain/hotOffers.js';

export default function HotOffersPage() {
    const batches = useInventoryStore((state) => state.batches);

    const stopList = useMemo(
        () => computeStopList(dishes, batches),
        [batches],
    );

    const offers = useMemo(
        () => computeHotOffers(dishes, products, batches, stopList),
        [batches, stopList],
    );
    const add = useCartStore((state) => state.add);
    const dialog = useDisclosure();
    const [selectedDish, setSelectedDish] = useState(null);
    const [discount, setDiscount] = useState('10');
    const [discounts, setDiscounts] = useState({});

    const openDiscount = (dishId) => {
        setSelectedDish(dishId);
        dialog.onOpen();
    };

    const saveDiscount = () => {
        setDiscounts((state) => ({ ...state, [selectedDish]: Number(discount) }));
        dialog.onClose();
        toast.success('Акция сохранена');
    };

    return (
        <VStack align="stretch" spacing="5">
            <Box><Text fontFamily="heading" fontSize="3xl" fontWeight="700">Горячие предложения</Text><Text color="gray.500">Блюда, которые помогут использовать продукты вовремя</Text></Box>
            {offers.length ? <SimpleGrid columns={{ base: 1, md: 2 }} spacing="5">{offers.map((offer) => {
                const dish = dishes.find((entry) => entry.id === offer.dishId);
                const discountValue = discounts[dish.id] || 0;
                return <Card key={dish.id} overflow="hidden"><Image src={dish.image} alt={dish.name} h="190px" objectFit="cover" /><CardBody>
                    <VStack align="stretch" spacing="3">
                        <HStack justify="space-between"><Text fontWeight="700" fontSize="lg">{dish.name}</Text><Badge colorScheme="orange">Приоритет {offer.priority}/5</Badge></HStack>
                        <HStack>{Array.from({ length: 5 }, (_, i) => <Star key={i} size={15} fill={i < offer.priority ? '#f2a20c' : 'none'} color="#f2a20c" />)}</HStack>
                        <Text color="gray.600" fontSize="sm">{offer.reasons.join('. ')}</Text>
                        <HStack justify="space-between"><Text fontWeight="700" color="brand.600">{discountValue ? money(dish.price * (1 - discountValue / 100)) : money(dish.price)}{discountValue ? ` · скидка ${discountValue}%` : ''}</Text><HStack><Button colorScheme="orange" onClick={() => { add(dish.id); toast.success('Добавлено в корзину'); }}>В заказ</Button><Button variant="outline" onClick={() => openDiscount(dish.id)}>Акция</Button></HStack></HStack>
                    </VStack>
                </CardBody></Card>;
            })}</SimpleGrid> : <EmptyState title="Пока нет рекомендаций" text="Предложения появятся, когда у партий будет близкий срок годности" />}
            <Modal isOpen={dialog.isOpen} onClose={dialog.onClose} isCentered>
                <ModalOverlay /><ModalContent><ModalHeader>Скидка на блюдо</ModalHeader><ModalBody><RadioGroup value={discount} onChange={setDiscount}><Stack>{['10', '15', '20'].map((value) => <Radio key={value} value={value}>{value}%</Radio>)}</Stack></RadioGroup></ModalBody><ModalFooter><Button mr="3" onClick={dialog.onClose}>Отмена</Button><Button colorScheme="orange" onClick={saveDiscount}>Сохранить</Button></ModalFooter></ModalContent>
            </Modal>
        </VStack>
    );
}