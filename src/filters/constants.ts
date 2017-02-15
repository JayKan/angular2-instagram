import { Map } from 'immutable';

export const presets = {
  '1977': {
    filter: Map({
      contrast: '110',
      brightness: '110',
      saturate: '130',
      opacity: '100',
      blend: 'screen'
    }),
    overlay: Map({
      type: 'solid',
      color: Map({ a: 0.3, b: 188, g: 106, r: 243 })
    })
  },
  'aden': {
    filter: Map({
      hueRotate: '20',
      contrast: '90',
      saturate: '85',
      brightness: '120',
      opacity: '100',
      blend: 'darken'
    }),
    overlay: Map({
      type: 'linear',
      direction: 'to right',
      color1: Map({
        color: Map({ a: 0.2, b: 14, g: 10, r: 66 }),
        stop: 1
      }),
      color2: Map({
        color: Map({ a: 0, b: 14, g: 10, r: 66 }),
        stop: 100
      })
    })
  },
  'brooklyn': {
    filter: Map({
      contrast: '90',
      brightness: '110',
      opacity: '100',
      blend: 'overlay'
    }),
    overlay: Map({
      type: 'radial',
      position: 'center center',
      size: 'closest-corner',
      color1: Map({
        color: Map({ a: 0.4, b: 193, g: 223, r: 168 }),
        stop: 1
      }),
      color2: Map({
        color: Map({ a: 0.2, b: 200, g: 196, r: 183 }),
        stop: 100
      })
    })
  },
  'gingham': {
    filter: Map({
      brightness: '105',
      hueRotate: '350',
      blend: 'darken',
      opacity: '100'
    }),
    overlay: Map({
      type: 'linear',
      direction: 'to right',
      color1: Map({
        color: Map({ a: 0.2, b: 14, g: 10, r: 66 }),
        stop: 1
      }),
      color2: Map({
        color: Map({ a: 0, b: 0, g: 0, r: 0 }),
        stop: 100
      })
    })
  },
  'earlybird': {
    filter: Map({
      contrast: '90',
      sepia: '20',
      blend: 'overlay',
      opacity: '100'
    }),
    overlay: Map({
      type: 'radial',
      color1: Map({
        color: Map({ a: 1, b: 142, g: 186, r: 208 }),
        stop: 20
      }),
      color2: Map({
        color: Map({ a: 0.2, b: 16, g: 2, r: 29 }),
        stop: 100
      })
    })
  },
  'hudson': {
    filter: Map({
      brightness: '120',
      contrast: '90',
      saturate: '110',
      blend: 'multiply',
      opacity: '50'
    }),
    overlay: Map({
      type: 'radial',
      color1: Map({
        color: Map({ a: 1, b: 166, g: 177, r: 255 }),
        stop: 50
      }),
      color2: Map({
        color: Map({ a: 1, b: 52, g: 33, r: 52 }),
        stop: 100
      })
    })
  },
  'inkwell': {
    filter: Map({
      sepia: '30',
      contrast: '110',
      brightness: '110',
      grayscale: '100',
      opacity: '100'
    }),
    overlay: Map({
      type: 'solid',
      color: Map({ a: 0, b: 0, g: 0, r: 0 })
    })
  },
  'lofi': {
    filter: Map({
      saturate: '110',
      contrast: '150',
      opacity: '100',
      blend: 'multiply'
    }),
    overlay: Map({
      type: 'radial',
      color1: Map({
        color: Map({ a: 0, b: 0, g: 0, r: 0 }),
        stop: 70
      }),
      color2: Map({
        color: Map({ a: 1, b: 34, g: 34, r: 34 }),
        stop: 100
      })
    })
  },
  'perpetua': {
    filter: Map({
      opacity: '50',
      blend: 'soft-light'
    }),
    overlay: Map({
      type: 'linear',
      direction: 'to bottom',
      color1: Map({
        color: Map({ a: 1, b: 154, g: 91, r: 0 }),
        stop: 1
      }),
      color2: Map({
        color: Map({ a: 0, b: 230, g: 193, r: 61 }),
        stop: 100
      })
    })
  },
  'toaster': {
    filter: Map({
      contrast: '150',
      brightness: '90',
      opacity: '50',
      blend: 'screen'
    }),
    overlay: Map({
      type: 'radial',
      color1: Map({
        color: Map({ a: 1, b: 128, g: 78, r: 15 }),
        stop: 1
      }),
      color2: Map({
        color: Map({ a: 1, b: 59, g: 0, r: 59 }),
        stop: 100
      })
    })
  },
  'xpro2': {
    filter: Map({
      sepia: '30',
      opacity: '100',
      blend: 'color-burn'
    }),
    overlay: Map({
      type: 'radial',
      color1: Map({
        color: Map({ a: 1, b: 230, g: 231, r: 224 }),
        stop: 40
      }),
      color2: Map({
        color: Map({ a: 0.6, b: 161, g: 42, r: 43 }),
        stop: 100
      })
    })
  }
};

export const overlayOptions: Object[] = [
  { val: 'none',              label: 'None'               },
  { val: 'solid_background',  label: 'Solid Background'   },
  { val: 'linear_gradient',   label: 'Linear Gradient'    },
  { val: 'radial_gradient',   label: 'Radial Gradient'    }
];