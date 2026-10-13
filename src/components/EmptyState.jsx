import { Center, Icon, Text, VStack } from '@chakra-ui/react';
import { PackageOpen } from 'lucide-react';
import PropTypes from 'prop-types';

export default function EmptyState({ title, text = 'Здесь пока ничего нет' }) {
    return (
        <Center py="14">
            <VStack spacing="3">
                <Icon as={PackageOpen} boxSize="9" color="orange.300" />
                <Text fontWeight="700">{title}</Text>
                <Text color="gray.500" fontSize="sm">{text}</Text>
            </VStack>
        </Center>
    );
}

EmptyState.propTypes = { title: PropTypes.string.isRequired, text: PropTypes.string };