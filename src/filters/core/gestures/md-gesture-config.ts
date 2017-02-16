import { Injectable } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';

@Injectable()
export class MdGestureConfig extends HammerGestureConfig {
  /**
   * List of new event names to add to the gesture support list
   */
  events: string[] = [
    'drag',
    'dragright',
    'dragleft',
    'longpress',
    'slide',
    'slidestart',
    'slideend',
    'slideright',
    'slideleft'
  ];

  /**
   * Builds Hammer instance manually to add custom recognizers that match the Material Design spec.
   *
   * Our gesture names come from the Material Design gestures spec:
   * https://www.google.com/design/spec/patterns/gestures.html#gestures-touch-mechanics
   */
  buildHammer(element: HTMLElement): HammerManager {
    const mc: HammerManager = new Hammer(element);

    // Default hammer recognizers
    let pan: PanRecognizer = new Hammer.Pan();
    let swipe: SwipeRecognizer = new Hammer.Swipe();
    let press: PressRecognizer = new Hammer.Press();

    // Notices that a HammerJS recognizer can only depend on one other recognizer once.
    // Otherwise the previous `recognizeWith` will be dropped.
    let slide: Recognizer = this._createRecognizer(pan, { event: 'slide', threshold: 0 }, swipe);
    let drag: Recognizer = this._createRecognizer(slide, { event: 'drag', threshold: 0 }, swipe);
    let longpress: Recognizer = this._createRecognizer(press, { event: 'longpress', time: 500 });

    // Overwrites the default `pan` event to use the swipe event.
    pan.recognizeWith(swipe);

    // Adds customized gestures to Hammer manager
    mc.add([swipe, press, pan, drag, slide, longpress]);

    return mc;
  }

  /**
   * Creates a new recognizer, without affecting the default recognizers of HammerJS
   */
  private _createRecognizer(base: Recognizer, options: any, ...inheritances: Recognizer[]): Recognizer {
    let recognizer: Recognizer = new (<RecognizerStatic>base.constructor)(options);

    inheritances.push(base);
    inheritances.forEach((item: Recognizer) => recognizer.recognizeWith(item));

    return recognizer;
  }
}