import AbstractView from '../framework/view/abstract-view.js';
import {FILTER_TYPE} from '../const/const.js';

const NoTripsTextType = {
  [FILTER_TYPE.EVERYTHING]: 'Click New Event to create your first point',
  [FILTER_TYPE.FUTURE]: 'There are no future events now',
  [FILTER_TYPE.PRESENT]: 'There are no present events now',
  [FILTER_TYPE.PAST]: 'There are no past events now',
  ['ERROR']: 'Server is not available now'
};

function createNoTripTemplate(filterType) {
  const noTripTextValue = NoTripsTextType[filterType];

  return (`
    <p class="trip-events__msg">${noTripTextValue}</p>
  `);
}

export default class NoTripView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoTripTemplate(this.#filterType);
  }
}
