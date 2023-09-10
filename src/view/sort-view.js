import AbstractView from '../framework/view/abstract-view.js';
import {SORT_TYPE} from '../const/const.js';


function createSortTemplate(currentSortType) {
  const sortTemplate = Object.values(SORT_TYPE).map((name) => createSortItemTemplate(name, name === currentSortType)).join('');

  return (`
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortTemplate}
    </form>
  `);
}

function createSortItemTemplate(name, isChecked) {
  return (`
    <div class="trip-sort__item  trip-sort__item--${name}">
      <input id="sort-${name}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${name}" data-sort-type="${name}"${isChecked ? 'checked' : ''}  ${name === 'event' || name === 'offers' ? 'disabled' : ''}>
      <label class="trip-sort__btn" for="sort-${name}">${name}</label>
    </div>
  `);
}

export default class SortView extends AbstractView {
  #handleSortTypeChange = null;
  #currentSortType = null;

  constructor({onSortTypeChange, currentSortType}) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;
    this.#currentSortType = currentSortType;

    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };

}

