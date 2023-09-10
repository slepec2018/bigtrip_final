import {render, remove} from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import NoTripView from '../view/no-trip-view.js';
import LoadingView from '../view/loading-view.js';
import NewTripButtonView from '../view/new-trip-button-view.js';
import PointPresenter from './point-presenter.js';
import {sortPoints} from '../utils/sort.js';
import NewTripPresenter from './new-trip-presenter.js';
import {SORT_TYPE, USER_ACTION, UPDATE_TYPE, FILTER_TYPE} from '../const/const.js';
import {filter} from '../utils/filter.js';


const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class TripPresenter {
  #container = null;
  #tripsModel = null;
  #filterModel = null;
  #newTripPresenter = null;
  #tripPresenters = new Map();
  #isLoading = true;
  #infoHeaderContainer = null;
  #newTripButtonComponent = null;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  #tripListComponent = new TripListView();
  #sortComponent = null;
  #noTripComponent = null;
  #loadingComponent = new LoadingView();


  #currentSortType = SORT_TYPE.DAY;
  #filterType = FILTER_TYPE.EVERYTHING;

  constructor({tripPointEditContainer, tripsModel, filterModel, infoHeaderElement}) {
    this.#container = tripPointEditContainer;
    this.#tripsModel = tripsModel;
    this.#filterModel = filterModel;
    this.#infoHeaderContainer = infoHeaderElement;

    this.#newTripPresenter = new NewTripPresenter({

      tripListContainer: this.#tripListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#handleNewTripFormClose
    });

    this.#tripsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

  }

  createTrip() {
    this.#currentSortType = SORT_TYPE.DAY;
    this.#filterModel.setFilter(UPDATE_TYPE.MAJOR, FILTER_TYPE.EVERYTHING);


    this.#newTripPresenter.init(this.#tripsModel.offers, this.#tripsModel.destinations, this.#tripsModel.destinationsList);
  }

  get trips() {
    this.#filterType = this.#filterModel.filter;
    const trip = this.#tripsModel.trips;
    const filteredTrips = filter[this.#filterType](trip);

    sortPoints(filteredTrips, this.#currentSortType);

    return filteredTrips;
  }

  init() {
    this.#renderBoard();
  }


  #renderNewEventButton() {
    this.#newTripButtonComponent = new NewTripButtonView({
      onClick: this.#handleNewTripButtonClick
    });

    render(this.#newTripButtonComponent, this.#infoHeaderContainer);
  }

  #handleNewTripFormClose = () => {
    this.#newTripButtonComponent.element.disabled = false;
  };

  #handleNewTripButtonClick = () => {
    this.createTrip();
    this.#newTripButtonComponent.element.disabled = true;
  };


  #renderBoard() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.trips.length === 0) {
      this.#renderList();
      this.#renderNoTrip();
      return;
    }

    this.#renderSort();
    this.#renderList();
    this.#renderTrips(this.trips, this.#tripsModel.offers, this.#tripsModel.destinations, this.#tripsModel.destinationsList);
  }

  #clearBoard({resetSortType = false} = {}) {
    this.#newTripPresenter.destroy();
    this.#tripPresenters.forEach((presenter) => presenter.destroy());
    this.#tripPresenters.clear();

    remove(this.#sortComponent);

    if (this.#noTripComponent) {
      remove(this.#noTripComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SORT_TYPE.DAY;
    }
  }

  #renderNoTrip() {
    this.#noTripComponent = new NoTripView({
      filterType: this.#filterType
    });

    render(this.#noTripComponent, this.#container);
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortComponent, this.#container);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderList() {
    render(this.#tripListComponent, this.#container);
  }

  #renderTrips(trips, offers, destinations, destinationsList) {
    trips.forEach((trip) => {
      this.#renderTrip(trip, offers, destinations, destinationsList);
    });

  }

  #renderTrip(trip, offers, destinations, destinationsList) {
    const tripPresenter = new PointPresenter({
      tripContainer: this.#tripListComponent.element,
      offers: offers,
      destinations: destinations,
      destinationsList: destinationsList,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });
    tripPresenter.init(trip);
    this.#tripPresenters.set(trip.id, tripPresenter);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#container);
  }

  #handleViewAction = async (actionType, updateType, update) => {

    this.#uiBlocker.block();

    switch (actionType) {
      case USER_ACTION.UPDATE_TRIP:
        this.#tripPresenters.get(update.id).setSaving();
        try {
          await this.#tripsModel.updateTrip(updateType, update);
        } catch(err) {
          this.#tripPresenters.get(update.id).setAborting();
        }
        break;
      case USER_ACTION.ADD_TRIP:
        this.#newTripPresenter.setSaving();
        try {
          await this.#tripsModel.addTrip(updateType, update);
        } catch(err) {
          this.#newTripPresenter.setAborting();
        }
        break;
      case USER_ACTION.DELETE_TRIP:
        this.#tripPresenters.get(update.id).setDeleting();
        try {
          await this.#tripsModel.deleteTrip(updateType, update);
        } catch(err) {
          this.#tripPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UPDATE_TYPE.PATCH:
        this.#tripPresenters.get(data.id).init(data);
        break;
      case UPDATE_TYPE.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UPDATE_TYPE.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
      case UPDATE_TYPE.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderNewEventButton();
        this.#renderBoard();
        break;
      case UPDATE_TYPE.ERROR:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#filterType = 'ERROR';
        this.#renderNoTrip();
    }
  };

  #handleModeChange = () => {
    this.#newTripPresenter.destroy();
    this.#tripPresenters.forEach((presenter) => presenter.resetView());
  };

}
