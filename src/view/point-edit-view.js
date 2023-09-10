import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {TYPES, DATE_FORMAT, BLANK_POINT} from '../const/const.js';
import {upFirstLetter, humanizeTripDueDate} from '../utils/trip.js';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';

function createEventTypeItemsTemplate(types, tripType) {

  return (`
    ${Object.values(types).map((type) =>
      `<div class="event__type-item">
        <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === tripType ? 'checked' : ''}>
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1" data-type="${type}">${upFirstLetter(type)}</label>
      </div>`).join('')}
  `);
}

function createDestinationsListOptionsTemplate(destinationsList) {
  return (`${destinationsList.map((value) => `<option value="${value}"></option>`).join('')}`);
}

function createEventDetailsTemplate(pointOffers, trip, pointDestinations) {
  const {destination, isDisabled} = trip;
  const tripDestination = pointDestinations.filter((value) => value.id === destination);

  const description = tripDestination[0] !== undefined ? createEventFormDescriptionTemplate(tripDestination[0].description, trip, pointDestinations) : '';

  return (`
    <section class="event__details">
     

      <section class="event__section  event__section--destination">
       ${createOffersTemplate(pointOffers, trip, isDisabled)}
       ${description}
      </section>
    </section>
  `);
}

function createEventFormDescriptionTemplate(description, trip, pointDestinations) {
  return `
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${description}</p>
    ${createPhotoContainerTemplate(trip, pointDestinations)}
  `;
}

function createOffersTemplate(pointOffers, trip, isDisabled) {
  const isHidden = pointOffers[trip.type].length === 0 ? 'visually-hidden' : '' ;

  return (`
    <section class="event__section  event__section--offers ${isHidden}">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
          ${createOffersItemTemplate(pointOffers, trip, isDisabled)}
      </div>
    </section>
  `);
}

function createOffersItemTemplate(pointOffers, trip, isDisabled) {

  const currentOffers = pointOffers[Object.keys(pointOffers).filter((value) => value === trip.type)];
  return (`
    ${currentOffers.map(({title, price, id}) => `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}-1" type="checkbox" name="event-offer-${id}" data-offer-id="${id}" ${(trip.offers.includes(id)) ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
        <label class="event__offer-label" for="event-offer-${id}-1">
          <span class="event__offer-title">${title}</span>
          +€&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
      </div>`).join('')}
    `);
}

function createPhotoContainerTemplate(trip, pointDestinations) {
  const {destination} = trip;
  const tripDestination = pointDestinations.filter((value) => value.id === destination);

  const pictures = tripDestination[0] !== undefined ? tripDestination[0].images : '';
  return (`
    <div class="event__photos-container">
      <div class="event__photos-tape">
      ${pictures.map(({src, description}) => `<img class="event__photo" src="${src}"
      alt="${description}"></img>`).join('')}</div>
      </div>
    </div>
  `);
}


function createPointEditViewTemplate(trip, pointOffers, destinationsList, pointDestinations) {
  const {id, type, destination, dateFrom, dateTo, basePrice, isDisabled, isSaving, isDeleting} = trip;
  const tripDestination = pointDestinations.filter((value) => value.id === destination);
  const tripCity = tripDestination[0] !== undefined ? tripDestination[0].name : '';


  return (`
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>
            <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${createEventTypeItemsTemplate(TYPES, type)}
            </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${upFirstLetter(type)}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(tripCity)}" list="destination-list-1" required ${isDisabled ? 'disabled' : ''}>
            <datalist id="destination-list-1">
              ${createDestinationsListOptionsTemplate(destinationsList)}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${he.encode(humanizeTripDueDate(dateFrom, DATE_FORMAT.DAY_MONTH_YEAR_TIME_SLASHED))}" required ${isDisabled ? 'disabled' : ''}>
            —
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${he.encode(humanizeTripDueDate(dateTo, DATE_FORMAT.DAY_MONTH_YEAR_TIME_SLASHED))}" required ${isDisabled ? 'disabled' : ''}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              €
            </label>
            <input class="event__input  event__input--price" 
            id="event-price-1" type="number" min="0" name="event-price" value="${he.encode(String(basePrice))}" required ${isDisabled ? 'disabled' : ''}>
          </div>

          ${createFormButtonsTemplate(id === '-1', isDisabled, isSaving, isDeleting)}

        </header>
        ${createEventDetailsTemplate(pointOffers, trip, pointDestinations)}
      </form>
     </li>
  `);
}

function createFormButtonsTemplate(isNewForm, isDisabled, isSaving, isDeleting) {

  let textButtonReset = isNewForm ? 'Cancel' : 'Delete';
  if (isDeleting) {
    textButtonReset = isNewForm ? 'Cancelling...' : 'Deleting...';
  }

  return `
    <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
    <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}> ${textButtonReset}</button>
    <button class="event__rollup-btn" type="button"  ${isNewForm ? 'style="display:none;"' : ''}>
      <span class="visually-hidden">Open event</span>
    </button>
  `;
}

export default class PointEditView extends AbstractStatefulView {
  #pointOffers = null;
  #destinationsList = null;
  #pointDestinations = null;

  #handleFormSubmit = null;
  #handleFormClick = null;
  #handleDeleteClick = null;

  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({trip = BLANK_POINT, offers, destinationsList, destinations, onFormSubmit, onRollUpButtonClick, onDeleteClick}) {

    super();

    this._setState(PointEditView.parseTripToState(trip));
    this.#pointOffers = offers;
    this.#destinationsList = destinationsList;
    this.#pointDestinations = destinations;

    this.#handleFormClick = onRollUpButtonClick;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleDeleteClick = onDeleteClick;

    this._restoreHandlers();
  }


  _restoreHandlers() {
    this.element.querySelector('.event.event--edit').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollUpButtonClickHandler);

    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#offerChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceInputHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);

    this.#setDatepickers();
  }


  get template() {
    return createPointEditViewTemplate(this._state, this.#pointOffers, this.#destinationsList, this.#pointDestinations);
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#destroyDatepicker(this.#datepickerFrom);
    }

    if (this.#datepickerTo) {
      this.#destroyDatepicker(this.#datepickerTo);
    }
  }


  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      dateFrom: userDate
    });
    this.#datepickerTo.set('minDate', this._state.dateFrom);
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      dateTo: userDate
    });
    this.#datepickerFrom.set('maxDate', this._state.dateTo);
  };

  #setDatepickers() {
    const dateElementFrom = this.element.querySelector('#event-start-time-1');
    const dateElementTo = this.element.querySelector('#event-end-time-1');

    this.#datepickerFrom = flatpickr(
      dateElementFrom,
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        maxDate: this._state.dateTo,
        onChange: this.#dateFromChangeHandler,
        enableTime: true,
        'time_24hr': true,
      }
    );

    this.#datepickerTo = flatpickr(
      dateElementTo,
      {
        dateFormat: 'd/m/y H:i',
        minDate: this._state.dateTo,
        defaultDate: this._state.dateTo,
        onChange: this.#dateToChangeHandler,
        enableTime: true,
        'time_24hr': true,
      }
    );


  }

  #destroyDatepicker(datepicker) {
    datepicker.destroy();
    datepicker = null;
  }

  reset(trip) {
    this.updateElement(
      PointEditView.parseTripToState(trip),
    );
  }

  #rollUpButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(PointEditView.parseStateToTrip(this._state));
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(PointEditView.parseStateToTrip(this._state));
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value
    });
  };

  #offerChangeHandler = (evt) => {
    evt.preventDefault();
    const activeOffers = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));

    const idOffers = activeOffers.map((offer) => offer.dataset.offerId);
    this._setState({
      offers: idOffers
    });
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: evt.target.valueAsNumber,
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const newDestination = this.#pointDestinations.find((item) => evt.target.value.includes(item.name));
    if (!newDestination) {
      evt.target.value = '';
      return;
    }
    this.updateElement({
      destination: newDestination.id,
    });
  };

  static parseTripToState(trip) {
    return {...trip,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToTrip(state) {
    const trip = { ...state };

    delete trip.isDisabled;
    delete trip.isSaving;
    delete trip.isDeleting;

    return trip;

  }
}
