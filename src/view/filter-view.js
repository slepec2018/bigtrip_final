import AbstractView from '../framework/view/abstract-view.js';
import {upFirstLetter} from '../utils/trip.js';

function createFilterTemplate(filtersItems, currentFilterType) {

  const filterItemsTemplate = filtersItems.map((filter) => createFilterItemTemplate(filter, filter.type === currentFilterType)).join('');

  return (`
    <form class="trip-filters" action="#" method="get">
      ${filterItemsTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `);
}

function createFilterItemTemplate(filter, isChecked) {
  const {type, activeFilter} = filter;
  return `
  <div class="trip-filters__filter">
    <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${isChecked ? 'checked' : ''} ${activeFilter ? '' : 'disabled'}>
    <label class="trip-filters__filter-label" for="filter-${type}">${upFirstLetter(type)}</label>
  </div>`;
}

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilterType = null;
  #handleFilterTypeChange = null;

  constructor({filters, currentFilterType, onFilterTypeChange}) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilterType);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };

}

