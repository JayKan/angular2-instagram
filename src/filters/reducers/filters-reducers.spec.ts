import { Map } from 'immutable';
import { FiltersActions } from '../services/filters-actions';
import { filtersReducer } from './filters-reducer';

describe('filters', () => {
  describe('filtersReducer', () => {
    let actions: FiltersActions;
    let data: any;
    let initialState: Map<string, any>;

    beforeEach(() => {
      actions = new FiltersActions();
    });
  });
});