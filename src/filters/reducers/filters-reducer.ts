import { Action } from '@ngrx/store';
import { Map, List } from 'immutable';
import { FiltersActions } from '../services/filters-actions';
import { FilterStyle, OverlayStyle, presets } from 'src/filters';


export type FiltersState = Map<string, any>;
const defaultImage: string = 'https://source.unsplash.com/W_9mOGUwR08/800x600';
const DEFAULTS = Map({
  contrast:   100,
  brightness: 100,
  saturate:   100,
  sepia:      0,
  grayScale:  0,
  invert:     0,
  hueRotate:  0,
  blur:       0,
  blend:   'none',
  opacity: 50
});
const initialState: FiltersState = Map({
  contrast:   100,
  brightness: 100,
  saturate:   100,
  sepia:      0,
  grayScale:  0,
  invert:     0,
  hueRotate:  0,
  blur:       0,
  blend:   'none',
  opacity: 50,
  styles: Map({
    position: 'relative',
    WebkitFilter: null,
    filter: null
  }),
  overlay: Map({
    content: ' ',
    display: 'block',
    height: '100%',
    width: '100%',
    top: '0',
    left: '0',
    pointerEvents: 'none',
    position: 'absolute',
    mixBlendMode: 'normal'
  }),
  selectedImage: defaultImage,
  images: List(),
  error: null,
  loading: false
});

export function filtersReducer(state: FiltersState = initialState, { type, payload }: Action): FiltersState {
  switch (type) {
    case FiltersActions.CHANGE_CONTRAST:
    case FiltersActions.CHANGE_BRIGHTNESS:
    case FiltersActions.CHANGE_SATURATE:
    case FiltersActions.CHANGE_SEPIA:
    case FiltersActions.CHANGE_GRAYSCALE:
    case FiltersActions.CHANGE_INVERT:
    case FiltersActions.CHANGE_HUEROTATE:
    case FiltersActions.CHANGE_BLUR:
    case FiltersActions.CHANGE_BLEND:
    case FiltersActions.CHANGE_SELECTED_IMAGE:
      return state.withMutations(filtersState => {
        const { value, type } = payload;
        filtersState
          .merge({ [`${type}`]: value })
          .merge(updateFilterStyle(filtersState))
          .merge(updateOverlayStyle(filtersState));
      });

    case FiltersActions.LOADING:
      return state.withMutations(filtersState => {
        const { value } = payload;
        filtersState
          .merge({ loading: value })
      });

    case FiltersActions.CHANGE_PRESET:
      return state.withMutations(filtersState => {
        const { figureStyle, overlayStyle, key } = payload;
        const preset = presets[key];
        const { filter, overlay } = preset;
        filtersState
          .merge({ 'contrast'   : filter.get('contrast')    || 100    })
          .merge({ 'brightness' : filter.get('brightness')  || 100    })
          .merge({ 'saturate'   : filter.get('saturate')    || 100    })
          .merge({ 'sepia'      : filter.get('saturate')    || 0      })
          .merge({ 'grayScale'  : filter.get('grayscale')   || 0      })
          .merge({ 'invert'     : filter.get('invert')      || 0      })
          .merge({ 'hueRotate'  : filter.get('hueRotate')   || 0      })
          .merge({ 'blur'       : filter.get('blur')        || 0      })
          .merge({ 'blend'      : filter.get('blend')       || 'none' })
          .merge({ 'opacity'    : filter.get('opacity')     || 50     })
          .set('styles', figureStyle)
          .set('overlay', overlayStyle);
      });

    case FiltersActions.FETCH_IMAGES_FULFILLED:
      return state.withMutations(filtersState => {
        const { data } = payload;
        filtersState.merge({
          images: data
        });
      });

    case FiltersActions.FETCH_IMAGES_FAILED:
      return state.withMutations(filtersState => {
        const { error } = payload;
        filtersState.merge({
          error: error
        });
      });

    case FiltersActions.RESET_DEFAULTS:
      return state.withMutations(filtersState => {
        filtersState
          .merge({ 'contrast'   : 100   })
          .merge({ 'brightness' : 100   })
          .merge({ 'saturate'   : 100   })
          .merge({ 'sepia'      : 0     })
          .merge({ 'grayScale'  : 0     })
          .merge({ 'invert'     : 0     })
          .merge({ 'hueRotate'  : 0     })
          .merge({ 'blur'       : 0     })
          .merge({ 'blend'      : 'none'})
          .merge({ 'opacity'    : 50    })
          .merge(updateFilterStyle(DEFAULTS))
          .merge(updateOverlayStyle(DEFAULTS));
      });

    default:
      return state.withMutations(filtersState => {
        filtersState
          .merge(updateFilterStyle(filtersState))
          .merge(updateOverlayStyle(filtersState));
      });
  }
}

function getFilterStyles(state: FiltersState): string {
  let filters = '';
  filters += `contrast(${state.get('contrast')}%) `;
  filters += `brightness(${state.get('brightness')}%) `;
  filters += `saturate(${state.get('saturate')}%) `;
  filters += `sepia(${state.get('sepia')}%) `;
  filters += `grayscale(${state.get('grayScale')}%) `;
  filters += `invert(${state.get('invert')}%) `;
  filters += `hue-rotate(${state.get('hueRotate')}deg) `;
  filters += `blur(${state.get('blur')}px) `;
  return filters;
}

function updateFilterStyle(state: FiltersState): { styles: FilterStyle } {
  let styles: FilterStyle = {
    WebkitFilter: getFilterStyles(state),
    filter: getFilterStyles(state),
    position: 'relative'
  };

  return {
    styles
  };
}

function getOverlayColor(overlayType: string): string {
  const solidBackground = Map({
    a: 0.5,
    b: 253,
    g: 162,
    r: 62
  });
  const linearBackground = Map({
    a: 0.5,
    b: 253,
    g: 162,
    r: 62,
    stop: 10,
    direction: 'to bottom'
  });
  const radialBackground = Map({
    a: 0.04,
    b: 70,
    g: 70,
    r: 70,
    stop: 100,
    position: 'center center',
    size: 'closest-corner'
  });

  const stop1 = linearBackground.get('stop');
  const stop2 = radialBackground.get('stop');
  const color1 = `rgba(${linearBackground.get('r')}, ${linearBackground.get('g')}, ${linearBackground.get('b')}, ${linearBackground.get('a')})`;
  const color2 = `rgba(${radialBackground.get('r')}, ${radialBackground.get('g')}, ${radialBackground.get('b')}, ${radialBackground.get('a')})`;

  switch (overlayType) {
    case 'solid_background':
      return `rgba(${solidBackground.get('r')}, ${solidBackground.get('g')}, ${solidBackground.get('b')}, ${solidBackground.get('a')})`;
    case 'linear_gradient':
      const direction = linearBackground.get('direction');
      return `linear-gradient(${direction}, ${color1} ${stop1}%, ${color2} ${stop2}%)`;
    case 'radial_gradient':
      const position = radialBackground.get('position');
      const size = radialBackground.get('size');
      return `-webkit-radial-gradient(${position}, circle ${size}, ${color1} ${stop1}%, ${color2} ${stop2}%)`;
    case 'none':
      return null;
  }
}

function updateOverlayStyle(state: FiltersState): { overlay: OverlayStyle } {
  const opacity: number = state.get('opacity');
  const overlayBackground: string = state.get('blend');
  const background: string = getOverlayColor(overlayBackground);

  let overlay: OverlayStyle = {
    content: ' ',
    display: 'block',
    height: '100%',
    width: '100%',
    top: '0',
    left: '0',
    pointerEvents: 'none',
    position: 'absolute',
    mixBlendMode: 'normal',
    opacity: (opacity/100),
    background: background
  };

  return {
    overlay
  };
}
