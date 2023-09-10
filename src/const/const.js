const TYPES = {
  TAXI: 'taxi',
  BUS: 'bus',
  TRAIN: 'train',
  SHIP: 'ship',
  DRIVE: 'drive',
  FLIGHT: 'flight',
  CHECK_IN: 'check-in',
  SIGHTSEEING: 'sightseeing',
  RESTAURANT: 'restaurant'
};

const BLANK_POINT = {
  id: '-1',
  type: TYPES.TAXI,
  destination: '',
  dateFrom: new Date,
  dateTo: new Date,
  basePrice: '',
  offers: [],
  isFavorite: false
};

const DATE_FORMAT = {
  HOUR_MINUTES: 'H:mm',
  MONTH_DAY : 'MMM D',
  YEAR_MONTH_DAY: 'YY-MM-DD',
  YEAR_MONTH_DAY_TIME: 'YYYY-MM-DDTHH:mm',
  DAY_MONTH_YEAR_TIME_SLASHED: 'DD/MM/YY HH:mm'
};

const FILTER_TYPE = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const MODE = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const SORT_TYPE = {
  DAY: 'day',
  EVENT:'event',
  TIME: 'time',
  PRICE:  'price',
  OFFERS:'offers',
};

const USER_ACTION = {
  UPDATE_TRIP: 'UPDATE_TRIP',
  ADD_TRIP: 'ADD_TRIP',
  DELETE_TRIP: 'DELETE_TRIP',
};

const UPDATE_TYPE = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  ERROR: 'ERROR'
};

export {TYPES, DATE_FORMAT, BLANK_POINT, FILTER_TYPE, MODE, SORT_TYPE, USER_ACTION, UPDATE_TYPE};
