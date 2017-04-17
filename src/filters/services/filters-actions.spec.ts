import { FiltersActions } from './filters-actions';

describe('filters', () => {
  describe('FiltersActions', () => {
    let actions: FiltersActions;

    beforeEach(() => {
      actions = new FiltersActions();
    });

    describe('changeContrast()', () => {
      it('should create an action', () => {
        const value = 3;
        const type = 'contrast';
        let action = actions.changeContrast(value);

        expect(action).toEqual({
          type: FiltersActions.CHANGE_CONTRAST,
          payload: {
            value, type
          }
        });
      });
    });

    describe('changeBrightness()', () => {
      it('should create an action', () => {
        const value = 3;
        const type = 'brightness';
        let action = actions.changeBrightness(value);

        expect(action).toEqual({
          type: FiltersActions.CHANGE_BRIGHTNESS,
          payload: { value, type }
        });
      });
    });

    describe('changeSaturate()', () => {
      it('should create an action', () => {
        const value = 3;
        const type = 'saturate';
        const action = actions.changeSaturate(value);

        expect(action).toEqual({
          type: FiltersActions.CHANGE_SATURATE,
          payload: { value, type }
        });
      });
    });

    describe('changeSepia()', () => {
      it('should create an action', () => {
        const value = 3;
        const type = 'sepia';
        const action = actions.changeSepia(value);

        expect(action).toEqual({
          type: FiltersActions.CHANGE_SEPIA,
          payload: { value, type }
        });
      });
    });

    describe('changeGrayScale()', () => {
      it('should create an action', () => {
        const value = 3;
        const type = 'grayScale';
        const action = actions.changeGrayScale(value);

        expect(action).toEqual({
          type: FiltersActions.CHANGE_GRAYSCALE,
          payload: { value, type }
        });
      });
    });

    describe('changeInvert()', () => {
      it('should create an action', () => {
        const value = 3;
        const type = 'invert';
        const action = actions.changeInvert(value);

        expect(action).toEqual({
          type: FiltersActions.CHANGE_INVERT,
          payload: { value, type }
        });
      });
    });

    describe('changeHueRotate()', () => {
      it('should create an action', () => {
        const value = 3;
        const type = 'hueRotate';
        const action = actions.changeHueRotate(value);

        expect(action).toEqual({
          type: FiltersActions.CHANGE_HUEROTATE,
          payload: { value, type }
        });
      });
    });

    describe('changeBlur()', () => {
      it('should create an action', () => {
        const value = 3;
        const type = 'blur';
        const action = actions.changeBlur(value);

        expect(action).toEqual({
          type: FiltersActions.CHANGE_BLUR,
          payload: { value, type }
        });
      });
    });

    describe('changeBlend()', () => {
      it('should create an action', () => {
        const value = '3';
        const type = 'blend';
        const action = actions.changeBlend(value);

        expect(action).toEqual({
          type: FiltersActions.CHANGE_BLEND,
          payload: { value, type }
        });
      });
    });

    describe('changePreset()', () => {
      it('should create an action', () => {
        const value = { figureStyle: {}, overlayStyle: {}, key: '' };
        const action = actions.changePreset(value);

        expect(action).toEqual({
          type: FiltersActions.CHANGE_PRESET,
          payload: value
        });
      });
    });

    describe('changeLoading()', () => {
      it('should create an action', () => {
        const type = 'loading';
        const value = true;
        const action = actions.changeLoading(value);

        expect(action).toEqual({
          type: FiltersActions.LOADING,
          payload: { type, value }
        });
      });
    });

    describe('loadImages()', () => {
      it('should create an action', () => {
        const action = actions.loadImages();

        expect(action).toEqual({
          type: FiltersActions.LOAD_IMAGES,
          payload: {
            api: FiltersActions.API
          }
        });
      });
    });

    describe('fetchImagesFulfilled()', () => {
      it('should create an action', () => {
        const data = [1, 2, 3];
        const action = actions.fetchImagesFulfilled(data);

        expect(action).toEqual({
          type: FiltersActions.FETCH_IMAGES_FULFILLED,
          payload: {
            data: Object.assign([], data)
          }
        });
      });
    });

    describe('fetchImagesFailed()', () => {
      it('should create an action', () => {
        const error = { msg: 'Test error' };
        const action = actions.fetchImagesFailed(error);

        expect(action).toEqual({
          type: FiltersActions.FETCH_IMAGES_FAILED,
          payload: { error }
        });
      });
    });

    describe('changeSelectImage()', () => {
      it('should create an action', () => {
        const value = '123';
        const type = 'selectedImage';
        const action = actions.changeSelectImage(value);

        expect(action).toEqual({
          type: FiltersActions.CHANGE_SELECTED_IMAGE,
          payload: { value, type }
        });
      });
    });
  });
});
