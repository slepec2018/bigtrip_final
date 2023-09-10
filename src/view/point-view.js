import {humanizeTripDueDate, getPointDuration} from '../utils/trip.js';
import {DATE_FORMAT} from '../const/const.js';

import AbstractView from '../framework/view/abstract-view.js';

function getOffers(pointOffers, offers) {
  return pointOffers.filter((item) => offers.find((offerId) => offerId === item.id));
}

function createOffersTemplate(pointOffers, trip) {
  const {offers} = trip;
  const offersTemplate = createOfferItemTemplate(getOffers(pointOffers, offers));

  return (`
  <ul class="event__selected-offers">
    ${offersTemplate}
  </ul>
  `);
}

function createOfferItemTemplate(pointOffers) {
  return (`
    ${pointOffers.map(({title, price}) => `
      <li class="event__offer">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </li>`)
      .join('')}
  `);
}

function createPointTemplate(trip, pointOffers, pointDestinations) {

  const {type, destination, dateFrom, dateTo, basePrice, isFavorite} = trip;
  const tripDestination = pointDestinations.filter((value) => value.id === destination);

  const tripCity = tripDestination[0] !== undefined ? tripDestination[0].name : '';

  const pointOffer = pointOffers[Object.keys(pointOffers).filter((value) => value === type)[0]];

  const favoriteClassName = isFavorite
    ? 'event__favorite-btn event__favorite-btn--active'
    : 'event__favorite-btn';

  return (`
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${humanizeTripDueDate(dateFrom, DATE_FORMAT.YEAR_MONTH_DAY)}">${humanizeTripDueDate(dateFrom, DATE_FORMAT.MONTH_DAY)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${tripCity}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${humanizeTripDueDate(dateFrom, DATE_FORMAT.YEAR_MONTH_DAY_TIME)}">${humanizeTripDueDate(dateFrom, DATE_FORMAT.HOUR_MINUTES)}</time>
            &mdash;
            <time class="event__end-time" datetime="${humanizeTripDueDate(dateTo, DATE_FORMAT.YEAR_MONTH_DAY_TIME)}">${humanizeTripDueDate(dateTo, DATE_FORMAT.HOUR_MINUTES)}</time>
          </p>
          <p class="event__duration">${getPointDuration(dateFrom, dateTo)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
          ${createOffersTemplate(pointOffer, trip)}
        <button class="${favoriteClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `);
}

export default class PointView extends AbstractView {

  #trip = null;
  #pointOffers = null;
  #pointDestinations = null;
  #handleEditClick = null;
  #handleFavoriteClick = null;

  constructor({trip, offers, destinations, onEditClick, onFavoriteClick }) {
    super();
    this.#trip = trip;
    this.#pointOffers = offers;
    this.#pointDestinations = destinations;
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);

  }

  get template() {
    return createPointTemplate(this.#trip, this.#pointOffers, this.#pointDestinations);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };

}
