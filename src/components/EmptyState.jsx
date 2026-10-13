import PropTypes from 'prop-types';
import { PackageOpen } from 'lucide-react';
import '@/styles/components.css';

export default function EmptyState({ title, text = 'Здесь пока ничего нет' }) {
    return (
        <div className="empty-state">
            <PackageOpen className="empty-state__icon" size={36} aria-hidden="true" />
            <p className="empty-state__title">{title}</p>
            <p className="empty-state__text">{text}</p>
        </div>
    );
}

EmptyState.propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string,
};