import { useState } from 'react';
import { ArrowUpRight, Clock3, Mail, MapPin, Phone } from 'lucide-react';
import { restaurantInfo } from '@/data/restaurantInfo.js';
import '@/styles/footer.css';

function createMapUrl(query) {
    const encodedQuery = encodeURIComponent(query);
    return `https://maps.google.com/maps?q=${encodedQuery}&z=16&output=embed`;
}

function createMapsLink(query) {
    const encodedQuery = encodeURIComponent(query);
    return `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
}

export default function SiteFooter() {
    const venues = restaurantInfo.venues.filter(
        (venue) => venue.address || venue.mapQuery,
    );

    const [selectedVenueId, setSelectedVenueId] = useState(
        venues[0]?.id || '',
    );

    const selectedVenue =
        venues.find((venue) => venue.id === selectedVenueId) || venues[0];

    const mapQuery = selectedVenue?.mapQuery || selectedVenue?.address;

    const phoneHref = restaurantInfo.phone
        ? `tel:${restaurantInfo.phone.replace(/[^\d+]/g, '')}`
        : '';

    const emailHref = restaurantInfo.email
        ? `mailto:${restaurantInfo.email}`
        : '';

    return (
        <footer className="site-footer">
            <div className="site-footer__inner">
                <div className="footer-main">
                    <section
                        className="footer-brand"
                        aria-labelledby="footer-brand-title"
                    >
                        <a
                            className="footer-brand__logo"
                            href="/"
                            aria-label="Тёплый двор — на главную"
                        >
              <span className="footer-brand__mark" aria-hidden="true">
                🍲
              </span>
                            <span>
                <strong id="footer-brand-title">Тёплый двор</strong>
                <span className="footer-brand__caption">Домашняя кухня</span>
              </span>
                        </a>

                        <p className="footer-brand__description">
                            Готовим с заботой, чтобы у вас был повод собраться за одним столом.
                        </p>

                        <span className="footer-copyright">
              © {new Date().getFullYear()} Тёплый двор
            </span>
                    </section>

                    <section
                        className="footer-contact"
                        aria-labelledby="footer-contact-title"
                    >
                        <h2 className="footer-heading" id="footer-contact-title">
                            Свяжитесь с нами
                        </h2>

                        {restaurantInfo.phone ? (
                            <a className="footer-contact__item" href={phoneHref}>
                                <Phone size={17} aria-hidden="true" />
                                <span>{restaurantInfo.phone}</span>
                            </a>
                        ) : (
                            <p className="footer-contact__item footer-contact__placeholder">
                                <Phone size={17} aria-hidden="true" />
                                <span>Добавьте телефон в restaurantInfo.js</span>
                            </p>
                        )}

                        {restaurantInfo.email ? (
                            <a className="footer-contact__item" href={emailHref}>
                                <Mail size={17} aria-hidden="true" />
                                <span>{restaurantInfo.email}</span>
                            </a>
                        ) : (
                            <p className="footer-contact__item footer-contact__placeholder">
                                <Mail size={17} aria-hidden="true" />
                                <span>Добавьте почту в restaurantInfo.js</span>
                            </p>
                        )}

                        <p className="footer-contact__item">
                            <Clock3 size={17} aria-hidden="true" />
                            <span>Ежедневно · время работы уточните у ресторана</span>
                        </p>
                    </section>

                    <section
                        className="footer-venues"
                        aria-labelledby="footer-venues-title"
                    >
                        <h2 className="footer-heading" id="footer-venues-title">
                            Наши заведения
                        </h2>

                        {venues.length > 0 ? (
                            <div className="footer-venues__list">
                                {venues.map((venue) => (
                                    <button
                                        className={`footer-venue${
                                            selectedVenueId === venue.id
                                                ? ' footer-venue--active'
                                                : ''
                                        }`}
                                        key={venue.id}
                                        type="button"
                                        onClick={() => setSelectedVenueId(venue.id)}
                                        aria-pressed={selectedVenueId === venue.id}
                                    >
                                        <MapPin size={17} aria-hidden="true" />
                                        <span className="footer-venue__text">
                      <strong>{venue.name}</strong>
                      <span>{venue.address || 'Адрес не указан'}</span>
                    </span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="footer-empty">
                                Добавьте адреса заведений в `src/data/restaurantInfo.js`.
                            </p>
                        )}
                    </section>

                    <section
                        className="footer-map-section"
                        aria-labelledby="footer-map-title"
                    >
                        <div className="footer-map-section__heading">
                            <h2 className="footer-heading" id="footer-map-title">
                                Как нас найти
                            </h2>

                            {mapQuery && (
                                <a
                                    className="footer-map-link"
                                    href={createMapsLink(mapQuery)}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Открыть карту
                                    <ArrowUpRight size={15} aria-hidden="true" />
                                </a>
                            )}
                        </div>

                        <div className="footer-map">
                            {mapQuery ? (
                                <iframe
                                    key={`${selectedVenue.id}-${mapQuery}`}
                                    className="footer-map__iframe"
                                    src={createMapUrl(mapQuery)}
                                    title={`Интерактивная карта: ${selectedVenue.name}`}
                                    loading="lazy"
                                    allowFullScreen
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            ) : (
                                <div className="footer-map__placeholder">
                                    <MapPin size={27} aria-hidden="true" />
                                    <strong>Карта появится здесь</strong>
                                    <span>
                    Добавьте адрес заведения в `restaurantInfo.js`
                  </span>
                                </div>
                            )}
                        </div>

                        {mapQuery && (
                            <p className="footer-map-hint">
                                Перемещайте карту мышью и меняйте масштаб кнопками на карте.
                            </p>
                        )}
                    </section>
                </div>

                <div className="site-footer__bottom">
                    <span>С теплом, команда «Тёплого двора»</span>
                    <a
                        href="#top"
                        onClick={(event) => {
                            event.preventDefault();
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                    >
                        Наверх ↑
                    </a>
                </div>
            </div>
        </footer>
    );
}