import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { AppState } from '../../app';
import { FilterStyle, OverlayStyle } from '../';
import { FiltersActions } from './filters-actions';
import {
  getContrastFilterValue,
  getBrightnessFilterValue,
  getSaturateFilterValue,
  getSepiaFilterValue,
  getGrayScaleFilterValue,
  getInvertFilterValue,
  getHueRotateFilterValue,
  getBlurFilterValue,
  getBlendFilterValue,
  getFilterStyleValue,
  getOverlayStyleValue,
  getSelectedImage,
  getImages,
  getError,
  getLoading
} from '../reducers/selectors';
import { Http } from '@angular/http';

@Injectable()
export class FiltersService {
  static CONTRAST: string   = 'contrast';
  static BRIGHTNESS: string = 'brightness';
  static SATURATE: string   = 'saturate';
  static SEPIA: string      = 'sepia';
  static GRAYSCALE: string  = 'grayScale';
  static INVERT: string     = 'invert';
  static HUE_ROTATE: string = 'hueRotate';
  static BLUR: string       = 'blur';
  static BLEND: string      = 'blend';
  static PRESET: string     = 'preset';
  static IMAGE: string      = 'image';
  static LOADING: string    = 'loading';

  contrast$: Observable<number>;
  brightness$: Observable<number>;
  saturate$: Observable<number>;
  sepia$: Observable<number>;
  grayscale$: Observable<number>;
  invert$: Observable<number>;
  hueRotate$: Observable<number>;
  blur$: Observable<number>;
  blend$: Observable<string>;
  overlayStyle$: Observable<OverlayStyle>;
  filterStyle$: Observable<FilterStyle>;
  selectedImage$: Observable<string>;
  images$: Observable<any>;
  error$: Observable<string>;
  loading$: Observable<boolean>;

  private cache: Map<any, any> = new Map();

  constructor(
    private store$: Store<AppState>,
    private actions: FiltersActions,
    private http: Http
  ) {
    this.contrast$  = getContrastFilterValue(store$);
    this.brightness$ = getBrightnessFilterValue(store$);
    this.saturate$ = getSaturateFilterValue(store$);
    this.sepia$ = getSepiaFilterValue(store$);
    this.grayscale$ = getGrayScaleFilterValue(store$);
    this.invert$ = getInvertFilterValue(store$);
    this.hueRotate$ = getHueRotateFilterValue(store$);
    this.blur$ = getBlurFilterValue(store$);
    this.blend$ = getBlendFilterValue(store$);
    this.filterStyle$ = getFilterStyleValue(store$);
    this.overlayStyle$ = getOverlayStyleValue(store$);
    this.selectedImage$ = getSelectedImage(store$);
    this.images$ = getImages(store$);
    this.error$ = getError(store$);
    this.loading$ = getLoading(store$);
  }

  change({ value, type }: { value: any, type: string }): void {
    switch (type) {
      case FiltersService.CONTRAST:
        this.changeContrast(value);
        break;
      case FiltersService.BRIGHTNESS:
        this.changeBrightness(value);
        break;
      case FiltersService.SATURATE:
        this.changeSaturate(value);
        break;
      case FiltersService.SEPIA:
        this.changeSepia(value);
        break;
      case FiltersService.GRAYSCALE:
        this.changeGrayScale(value);
        break;
      case FiltersService.INVERT:
        this.changeInvert(value);
        break;
      case FiltersService.HUE_ROTATE:
        this.changeHueRotate(value);
        break;
      case FiltersService.BLUR:
        this.changeBlur(value);
        break;
      case FiltersService.BLEND:
        this.changeBlend(value);
        break;
      case FiltersService.PRESET:
        this.changePreset(value);
        break;
      case FiltersService.IMAGE:
        this.changeSelectImage(value);
        break;
      case FiltersService.LOADING:
        this.changeLoading(value);
        break;
    }
  }

  changeContrast(value: number): void {
    this.store$.dispatch(
      this.actions.changeContrast(value)
    );
  }

  changeBrightness(value: number): void {
    this.store$.dispatch(
      this.actions.changeBrightness(value)
    );
  }

  changeSaturate(value: number): void {
    this.store$.dispatch(
      this.actions.changeSaturate(value)
    );
  }

  changeSepia(value: number): void {
    this.store$.dispatch(
      this.actions.changeSepia(value)
    );
  }

  changeGrayScale(value: number): void {
    this.store$.dispatch(
      this.actions.changeGrayScale(value)
    );
  }

  changeInvert(value: number): void {
    this.store$.dispatch(
      this.actions.changeInvert(value)
    );
  }

  changeHueRotate(value: number): void {
    this.store$.dispatch(
      this.actions.changeHueRotate(value)
    );
  }

  changeBlur(value: number): void {
    this.store$.dispatch(
      this.actions.changeBlur(value)
    );
  }

  changeBlend(value: string): void {
    this.store$.dispatch(
      this.actions.changeBlend(value)
    );
  }

  changePreset(value: { figureStyle: any, overlayStyle: any, key: string }): void {
    this.store$.dispatch(
      this.actions.changePreset(value)
    );
  }

  changeSelectImage(value: string): void {
    this.store$.dispatch(
      this.actions.changeSelectImage(value)
    );
  }

  loadAllImages(): void {
    this.store$.dispatch(
      this.actions.loadImages()
    );
  }

  resetToDefaults(): void {
    this.store$.dispatch(
      this.actions.resetToDefaults()
    );
  }

  changeLoading(value: boolean): void {
    this.store$.dispatch(
      this.actions.changeLoading(value)
    );
  }

  fetchImages(url: string): Observable<any> {
    const hasCacheData = this.cache.has(url);
    if (hasCacheData) {
      const cache = this.cache.get(url);
      return Observable.of(cache);
    }

    return this.http.get(url)
      .map(response => response.json())
      .map(records => {
        return records.map((record: any) => {
          return {
            id: record.id,
            thumb: record.urls.thumb
          };
        });
      })
      .do(data => {
        !hasCacheData && this.cache.set(url, data);
        return data;
      })
      .catch(error => Observable.throw('Error fetching images from Unsplash API. Please try again later.'));
  }
}
