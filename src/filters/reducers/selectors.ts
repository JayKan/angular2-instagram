import '@ngrx/core/add/operator/select';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/let';
import { AppState } from '../../app';
import { Observable } from 'rxjs/Observable';
import { FiltersState } from './filters-reducer';
import { FilterStyle, OverlayStyle } from '../';

export function getFiltersState(state$: Observable<AppState>): Observable<FiltersState> {
  return state$.select((state: AppState) => state.filters);
}

export function getFilterStyleValue(state$: Observable<AppState>): Observable<FilterStyle> {
  return state$.let(getFiltersState)
    .map((filtersState: FiltersState) => filtersState.get('styles').toJS())
    .distinctUntilChanged((previous: FilterStyle, next: FilterStyle) => {
      return previous.WebkitFilter === next.WebkitFilter && previous.filter === next.filter;
    });
}

export function getOverlayStyleValue(state$: Observable<AppState>): Observable<OverlayStyle> {
  return state$.let(getFiltersState)
    .map((filtersState: FiltersState) => filtersState.get('overlay').toJS())
    .distinctUntilChanged((previous: OverlayStyle, next: OverlayStyle) => {
      return previous.background === next.background;
    });
}

export function getContrastFilterValue(state$: Observable<AppState>): Observable<number> {
  return state$.let(getFiltersState)
    .map((filtersState: FiltersState) => filtersState.get('contrast'))
    .distinctUntilChanged();
}

export function getBrightnessFilterValue(state$: Observable<AppState>): Observable<number> {
  return state$.let(getFiltersState)
    .map((filtersState: FiltersState) => filtersState.get('brightness'))
    .distinctUntilChanged();
}

export function getSaturateFilterValue(state$: Observable<AppState>): Observable<number> {
  return state$.let(getFiltersState)
    .map((filtersState: FiltersState) => filtersState.get('saturate'))
    .distinctUntilChanged();
}

export function getSepiaFilterValue(state$: Observable<AppState>): Observable<number> {
  return state$.let(getFiltersState)
    .map((filtersState: FiltersState) => filtersState.get('sepia'))
    .distinctUntilChanged();
}

export function getGrayScaleFilterValue(state$: Observable<AppState>): Observable<number> {
  return state$.let(getFiltersState)
    .map((filtersState: FiltersState) => filtersState.get('grayScale'))
    .distinctUntilChanged();
}

export function getInvertFilterValue(state$: Observable<AppState>): Observable<number> {
  return state$.let(getFiltersState)
    .map((filersState: FiltersState) => filersState.get('invert'))
    .distinctUntilChanged();
}

export function getHueRotateFilterValue(state$: Observable<AppState>): Observable<number> {
  return state$.let(getFiltersState)
    .map((filtersState: FiltersState) => filtersState.get('hueRotate'))
    .distinctUntilChanged();
}

export function getBlurFilterValue(state$: Observable<AppState>): Observable<number> {
  return state$.let(getFiltersState)
    .map((filtersState: FiltersState) => filtersState.get('blur'))
    .distinctUntilChanged();
}

export function getBlendFilterValue(state$: Observable<AppState>): Observable<string> {
  return state$.let(getFiltersState)
    .map((filtersState: FiltersState) => filtersState.get('blend'))
    .distinctUntilChanged();
}

export function getSelectedImage(state$: Observable<AppState>): Observable<string> {
  return state$.let(getFiltersState)
    .map((filtersState: FiltersState) => filtersState.get('selectedImage'))
    .distinctUntilChanged();
}

export function getImages(state$: Observable<AppState>): Observable<any> {
  return state$.let(getFiltersState)
    .map((filtersState: FiltersState) => filtersState.get('images').toJS())
    .distinctUntilChanged();
}

export function getError(state$: Observable<AppState>): Observable<string> {
  return state$.let(getFiltersState)
    .map((filtersState: FiltersState) => filtersState.get('error'))
    .distinctUntilChanged();
}

export function getLoading(state$: Observable<AppState>): Observable<boolean> {
  return state$.let(getFiltersState)
    .map((filtersState: FiltersState) => filtersState.get('loading'))
    .distinctUntilChanged();
}
