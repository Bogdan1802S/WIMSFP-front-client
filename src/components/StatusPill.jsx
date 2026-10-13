import { Badge } from '@chakra-ui/react';
import PropTypes from 'prop-types';

const colors = {
    Готовится: 'orange',
    Выдан: 'green',
    Отменён: 'red',
    'Нет ингредиента': 'red',
    Недостаточно: 'orange',
    Просрочен: 'pink',
};

export default function StatusPill({ children }) {
    return (
        <Badge colorScheme={colors[children] || 'gray'} borderRadius="full" px="3" py="1">
            {children}
        </Badge>
    );
}

StatusPill.propTypes = { children: PropTypes.string.isRequired };