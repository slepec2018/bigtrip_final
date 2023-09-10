import {FILTER_TYPE} from '../const/const.js';
import {isTripFuture, isTripPresent, isTripPast} from '../utils/trip.js';

const filter = {
  [FILTER_TYPE.EVERYTHING]: (trips) => [...trips],
  [FILTER_TYPE.FUTURE]: (trips) => trips.filter((trip) => isTripFuture(trip.dateFrom)),
  [FILTER_TYPE.PRESENT]: (trips) => trips.filter((trip) => isTripPresent(trip.dateFrom, trip.dateTo)),
  [FILTER_TYPE.PAST]: (trips) => trips.filter((trip) => isTripPast(trip.dateTo)),
};

export {filter};
