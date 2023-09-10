import {Method, Url} from '../const/api-service.js';
import ApiService from '../framework/api-service.js';

export default class TripsApiService extends ApiService {
  get trips() {
    return this._load({url: Url.TRIPS})
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: Url.OFFERS})
      .then (ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: Url.DESTINATIONS})
      .then(ApiService.parseResponse);
  }

  async updateTrips(trip) {
    const response = await this._load({
      url: `${Url.TRIPS}/${trip.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(trip)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async addTrip(trip) {
    const response = await this._load({
      url: Url.TRIPS,
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(trip)),
      headers: new Headers({'Content-Type' : 'application/json'})
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async deleteTrip(trip) {
    const response = await this._load({
      url: `${Url.TRIPS}/${trip.id}`,
      method: Method.DELETE
    });

    return response;
  }

  #adaptToServer(trip) {
    const adaptedTrip = {...trip,
      'base_price': Number(trip.basePrice),
      'date_from': trip.dateFrom,
      'date_to': trip.dateTo,
      'is_favorite': trip.isFavorite,
    };

    delete adaptedTrip.basePrice;
    delete adaptedTrip.dateFrom;
    delete adaptedTrip.dateTo;
    delete adaptedTrip.isFavorite;

    return adaptedTrip;
  }
}
