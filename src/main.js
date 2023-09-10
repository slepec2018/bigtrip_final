import TripPresenter from './presenter/trip-presenter.js';
import TripsModel from './model/trips-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';

import TripsApiService from './api/trips-api-service.js';
import {AUTHORIZATION, END_POINT} from './const/api-service.js';

const tripHeaderElement = document.querySelector('.trip-main');
const tripHeaderFilterElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const tripsModel = new TripsModel({tripsApiService: new TripsApiService(END_POINT, AUTHORIZATION)});
const filterModel = new FilterModel();

const tripPresenter = new TripPresenter({
  tripPointEditContainer: tripEventsElement,
  tripsModel,
  filterModel,
  infoHeaderElement: tripHeaderElement
});

const filterPresenter = new FilterPresenter({
  filterContainer: tripHeaderFilterElement,
  filterModel,
  tripsModel
});

filterPresenter.init();
tripPresenter.init();
tripsModel.init();
