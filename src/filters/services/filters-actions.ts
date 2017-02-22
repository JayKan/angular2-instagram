import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

@Injectable()
export class FiltersActions {
  static CHANGE_CONTRAST: string        = 'CHANGE_CONTRAST';
  static CHANGE_BRIGHTNESS: string      = 'CHANGE_BRIGHTNESS';
  static CHANGE_SATURATE: string        = 'CHANGE_SATURATE';
  static CHANGE_SEPIA: string           = 'CHANGE_SEPIA';
  static CHANGE_GRAYSCALE: string       = 'CHANGE_GRAYSCALE';
  static CHANGE_INVERT: string          = 'CHANGE_INVERT';
  static CHANGE_HUEROTATE: string       = 'CHANGE_HUEROTATE';
  static CHANGE_BLUR: string            = 'CHANGE_BLUR';
  static CHANGE_BLEND: string           = 'CHANGE_BLEND';
  static CHANGE_PRESET: string          = 'CHANGE_PRESET';
  static LOAD_IMAGES: string            = 'LOAD_IMAGES';
  static FETCH_IMAGES_FAILED: string    = 'FETCH_IMAGES_FAILED';
  static FETCH_IMAGES_FULFILLED: string = 'FETCH_IMAGES_FULFILLED';
  static CHANGE_SELECTED_IMAGE: string  = 'CHANGE_SELECTED_IMAGE';
  static RESET_DEFAULTS: string         = 'RESET_DEFAULTS';
  static API: string = 'https://api.unsplash.com/photos/?per_page=50&client_id=86f6167ee81be7b8aea6aa0d999c1bae79b3351b43e8df03c8baaa9c630f24ba';

  changeContrast(value: number, type: string = 'contrast'): Action {
    return {
      type: FiltersActions.CHANGE_CONTRAST,
      payload: {
        value,
        type
      }
    };
  }

  changeBrightness(value: number, type: string = 'brightness'): Action {
    return {
      type: FiltersActions.CHANGE_BRIGHTNESS,
      payload: {
        value,
         type
      }
    };
  }

  changeSaturate(value: number, type: string = 'saturate'): Action {
    return {
      type: FiltersActions.CHANGE_SATURATE,
      payload: {
        value,
        type
      }
    };
  }

  changeSepia(value: number, type: string = 'sepia'): Action {
    return {
      type: FiltersActions.CHANGE_SEPIA,
      payload: {
        value,
        type
      }
    };
  }

  changeGrayScale(value: number, type: string = 'grayScale'): Action {
    return {
      type: FiltersActions.CHANGE_GRAYSCALE,
      payload: {
        value,
        type
      }
    };
  }

  changeInvert(value: number, type: string = 'invert'): Action {
    return {
      type: FiltersActions.CHANGE_INVERT,
      payload: {
        value,
        type
      }
    };
  }

  changeHueRotate(value: number, type: string = 'hueRotate'): Action {
    return {
      type: FiltersActions.CHANGE_HUEROTATE,
      payload: {
        value,
        type
      }
    };
  }

  changeBlur(value: number, type: string = 'blur'): Action {
    return {
      type: FiltersActions.CHANGE_BLUR,
      payload: {
        value,
        type
      }
    };
  }

  changeBlend(value: string, type: string = 'blend'): Action {
    return {
      type: FiltersActions.CHANGE_BLEND,
      payload: {
        value,
        type
      }
    };
  }

  changePreset({ figureStyle, overlayStyle }: { figureStyle: any, overlayStyle: any }): Action {
    return {
      type: FiltersActions.CHANGE_PRESET,
      payload: {
        figureStyle,
        overlayStyle
      }
    };
  }

  loadImages(): Action {
    return {
      type: FiltersActions.LOAD_IMAGES,
      payload: {
        api: FiltersActions.API
      }
    };
  }

  fetchImagesFailed(error: any): Action {
    return {
      type: FiltersActions.FETCH_IMAGES_FAILED,
      payload: {
        error
      }
    };
  }

  fetchImagesFulfilled(data: any): Action {
    return {
      type: FiltersActions.FETCH_IMAGES_FULFILLED,
      payload: {
        data: Object.assign([], data)
      }
    };
  }

  changeSelectImage(value: string, type: string = 'selectedImage'): Action {
    return {
      type: FiltersActions.CHANGE_SELECTED_IMAGE,
      payload: {
        value,
        type
      }
    };
  }

  resetToDefaults(): Action {
    return {
      type: FiltersActions.RESET_DEFAULTS
    };
  }
}