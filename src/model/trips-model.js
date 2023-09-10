import Observable from '../framework/observable.js';
import {UPDATE_TYPE} from '../const/const.js';

export default class TripsModel extends Observable {
  #trips = [];
  #offers = [];
  #destinations = [];

  #tripsApiService = null;

  constructor({tripsApiService}) {
    super();
    this.#tripsApiService = tripsApiService;

  }

  async init() {
    try {
      const trips = await this.#tripsApiService.trips;
      const offers = await this.#tripsApiService.offers;
      const destinations = await this.#tripsApiService.destinations;

      this.#trips = trips.map(this.#adaptTripToClient);
      this.#offers = this.#adaptOffers(offers);
      this.#destinations = destinations.map(this.#adaptDestinationToClient);
    } catch(err) {
      this.#trips = [];
      this._notify(UPDATE_TYPE.ERROR);
      return;
    }

    this._notify(UPDATE_TYPE.INIT);
  }


  #adaptOffers(offers) {
    return offers.reduce((result, item) => {
      result[item.type] = item.offers;
      return result;
    }, {});
  }

  get trips() {
    return this.#trips;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  get destinationsList() {
    return this.#destinations.map(({name}) => name);
  }

  async updateTrip(updateType, update) {
    const index = this.#trips.findIndex((trip) => trip.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting trip');
    }

    try {
      const response = await this.#tripsApiService.updateTrips(update);
      const updatedTrip = this.#adaptTripToClient(response);

      this.#trips = [
        ...this.#trips.slice(0, index),
        updatedTrip,
        ...this.#trips.slice(index + 1)
      ];
      this._notify(updateType, updatedTrip);

    } catch(err) {
      throw new Error('Can\'t update trip');
    }
  }

  async addTrip(updateType, update) {

    try {
      const response = await this.#tripsApiService.addTrip(update);
      const newTrip = this.#adaptTripToClient(response);
      this.#trips = [
        newTrip,
        ...this.#trips,
      ];
      this._notify(updateType, newTrip);
    } catch(err) {
      throw new Error('Can\'t add trip');
    }

  }

  async deleteTrip(updateType, update) {
    const index = this.#trips.findIndex((trip) => trip.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting trip');
    }

    try {
      await this.#tripsApiService.deleteTrip(update);
      this.#trips = [
        ...this.#trips.slice(0, index),
        ...this.#trips.slice(index + 1),
      ];

      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete trip');
    }
  }

  #adaptTripToClient(trip) {
    const adaptedTrip = {...trip,
      basePrice: trip['base_price'],
      dateFrom: trip['date_from'] === null ? trip['date_from'] : new Date(trip['date_from']),
      dateTo: trip['date_to'] === null ? trip['date_to'] : new Date(trip['date_to']),
      isFavorite: trip['is_favorite']
    };

    delete adaptedTrip['base_price'];
    delete adaptedTrip['date_from'];
    delete adaptedTrip['date_to'];
    delete adaptedTrip['is_favorite'];

    return adaptedTrip;
  }

  #adaptDestinationToClient(destination) {
    const adaptedDestination = {...destination,
      images: destination['pictures']
    };
    delete adaptedDestination['pictures'];
    return adaptedDestination;

  }

}
