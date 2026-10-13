import { Card, CardBody, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import PropTypes from 'prop-types';

export default function StatCard({ title, value, icon, tone = 'orange' }) {
    return (
        <Card bg={`${tone}.50`} border="1px solid" borderColor="blackAlpha.50" boxShadow="sm">
            <CardBody>
                <HStack justify="space-between" align="center">
                    <VStack align="start" spacing="1">
                        <Text color="gray.600" fontSize="sm">{title}</Text>
                        <Text fontSize="2xl" fontWeight="700">{value}</Text>
                    </VStack>
                    <Icon as={icon} boxSize="10" p="2" borderRadius="full" bg={`${tone}.100`} color={`${tone}.700`} />
                </HStack>
            </CardBody>
        </Card>
    );
}

StatCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    icon: PropTypes.elementType.isRequired,
    tone: PropTypes.string,
};