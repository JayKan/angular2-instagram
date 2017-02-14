import { ElementRef } from '@angular/core';

export enum ForegroundRippleState {
  NEW,
  EXPANDING,
  FADING_OUT
}

/**
 * @description Wrapper for a foreground ripple DOM element and its animation state.
 */
export class ForegroundRipple {
  public state = ForegroundRippleState.NEW;
  constructor(public rippleElement: Element) {}
}

const RIPPLE_SPEED_PX_PER_SECOND   = 1000;
const MIN_RIPPLE_FILL_TIME_SECONDS = 0.1;
const MAX_RIPPLE_FILL_TIME_SECONDS = 0.3;

/**
 * @description Returns the distance from the point (x, y) to the furthest corner of a rectangle.
 * @param x {number}
 * @param y {number}
 * @param rect {ClientRect}
 * @returns {number}
 */
const distanceToFurthestCorner = (x: number, y: number, rect: ClientRect): number => {
  const distX: number = Math.max(Math.abs(x - rect.left), Math.abs(x - rect.right));
  const distY: number = Math.max(Math.abs(y - rect.top), Math.abs(y - rect.bottom));
  return Math.sqrt(distX * distX + distY * distY);
};

/**
 * Helper service that performs DOM manipulations. Not intended to be used outside this module.
 * The constructor takes a reference to the ripple directive's host element and a map of DOM
 * event handlers to be installed on the element that triggers ripple animations.
 * This will eventually become a custom renderer once Angular support exists.
 */
export class RippleRenderer {
  private _backgroundDiv: HTMLElement;
  private _rippleElement: HTMLElement;
  private _triggerElement: HTMLElement;

  constructor(_elementRef: ElementRef, private _eventHandlers: Map<string, (e: Event) => void>) {
    this._rippleElement = _elementRef.nativeElement;
    // It might be nice to delay creating the background until it's needed, but doing this in
    // fadeInRippleBackground causes the first click event to not be handled reliably.
    this._backgroundDiv = document.createElement('div');
    this._backgroundDiv.classList.add('md-ripple-background');
    this._rippleElement.appendChild(this._backgroundDiv);
  }

  /**
   * @description Installs event handlers on the given trigger element, and removes event handlers from the
   * previous trigger if needed.
   * @name setTriggerElement
   * @param newTrigger {HTMLElement}
   * @returns {void}
   */
  setTriggerElement(newTrigger: HTMLElement): void {
    if (this._triggerElement !== newTrigger) {
      if (this._triggerElement) {
        this._eventHandlers.forEach((eventHandler, eventName) => {
          this._triggerElement.removeEventListener(eventName, eventHandler);
        });
      }
      this._triggerElement = newTrigger;
      if (this._triggerElement) {
        this._eventHandlers.forEach((eventHandler, eventName) => {
          this._triggerElement.addEventListener(eventName, eventHandler);
        });
      }
    }
  }


  /**
   * @description Installs event handlers on the host element of the md-ripple directive.
   * @name setTriggerElementToHost
   * @returns {void}
   */
  setTriggerElementToHost(): void {
    this.setTriggerElement(this._rippleElement);
  }

  /**
   * @description Removes event handlers from the current trigger element if needed.
   * @name clearTriggerElement
   * @returns {void}
   */
  clearTriggerElement(): void {
    this.setTriggerElement(null);
  }

  /**
 * @description Creates a foreground ripple and sets its animation to expand and fade in from the position
 * given by rippleOriginLeft and rippleOriginTop (or from the center of the <md-ripple>
 * bounding rect if centered is true).
 * @name createForegroundRipple
 * @param rippleOriginLeft {number}
 * @param rippleOriginTop {number}
 * @param color {string}
 * @param centered {boolean}
 * @param radius {number}
 * @param speedFactor {number}
 * @param transitionEndCallback {Function}
 * @returns {void}
 */
createForegroundRipple(rippleOriginLeft: number,
                       rippleOriginTop: number,
                       color: string,
                       centered: boolean,
                       radius: number,
                       speedFactor: number,
                       transitionEndCallback: (r: ForegroundRipple, e: TransitionEvent) => void) {
    const parentRect: ClientRect = this._rippleElement.getBoundingClientRect();
    // Create a foreground ripple div with the size and position of the fully expanded ripple.
    // When the div is created, it's given a transform style that causes the ripple to be displayed
    // small and centered on the event location (or the center of the bounding rect if the centered
    // argument is true). Removing that transform causes the ripple to animate to its natural size.
    const startX: number = centered ? (parentRect.left + parentRect.width / 2) : rippleOriginLeft;
    const startY: number = centered ? (parentRect.top + parentRect.height / 2) : rippleOriginTop;
    const offsetX: number = startX - parentRect.left;
    const offsetY: number = startY - parentRect.top;
    const maxRadius: number = radius > 0 ? radius : distanceToFurthestCorner(startX, startY, parentRect);

    const rippleDiv = document.createElement('div');
    this._rippleElement.appendChild(rippleDiv);
    rippleDiv.classList.add('md-ripple-foreground');
    rippleDiv.style.left = `${offsetX - maxRadius}px`;
    rippleDiv.style.top = `${offsetY - maxRadius}px`;
    rippleDiv.style.width = `${2 * maxRadius}px`;
    rippleDiv.style.height = rippleDiv.style.width;
    // If color input is not set, this will default to the background color defined in CSS.
    rippleDiv.style.backgroundColor = color;
    // Start the ripple tiny.
    rippleDiv.style.transform = `scale(0.001)`;

    const fadeInSeconds = (1 / (speedFactor || 1)) * Math.max(
      MIN_RIPPLE_FILL_TIME_SECONDS,
      Math.min(MAX_RIPPLE_FILL_TIME_SECONDS, maxRadius / RIPPLE_SPEED_PX_PER_SECOND)
    );
    rippleDiv.style.transitionDuration = `${fadeInSeconds}s`;

    // https://timtaubert.de/blog/2012/09/css-transitions-for-dynamically-created-dom-elements/
    window.getComputedStyle(rippleDiv).opacity;

    rippleDiv.classList.add('md-ripple-fade-in');
    // Clearing the transform property causes the ripple to animate to its full size.
    rippleDiv.style.transform = '';
    const ripple = new ForegroundRipple(rippleDiv);
    ripple.state = ForegroundRippleState.EXPANDING;

    rippleDiv.addEventListener('transitionend',
      (event: TransitionEvent) => transitionEndCallback(ripple, event));
  }

  /**
   * @description Fades out a foreground ripple after it has fully expanded and faded in.
   * @name fadeOutForegroundRipple
   * @param ripple {Element}
   * @returns {void}}
   */
  fadeOutForegroundRipple(ripple: Element): void {
    ripple.classList.remove('md-ripple-fade-in');
    ripple.classList.add('md-ripple-fade-out');
  }

  /**
   * @description Removes a foreground ripple from the DOM after it has faded out.
   * @name removeRippleFromDom
   * @param ripple {Element}
   * @returns {void}
   */
  removeRippleFromDom(ripple: Element): void {
    ripple.parentElement.removeChild(ripple);
  }

  /**
   * @description Fades in the ripple background.
   * @name fadeInRippleBackground
   * @param color {string}
   * @returns {void}
   */
  fadeInRippleBackground(color: string): void {
    this._backgroundDiv.classList.add('md-ripple-active');
    this._backgroundDiv.style.backgroundColor = color;
  }

  /**
   * @description Fades out the ripple background.
   * @name fadeOutRippleBackground
   * @returns {void}
   */
  fadeOutRippleBackground(): void {
    if (this._backgroundDiv) {
      this._backgroundDiv.classList.remove('md-ripple-active');
    }
  }
}