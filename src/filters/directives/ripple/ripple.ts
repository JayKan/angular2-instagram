import  {
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChange
} from '@angular/core';
import {
  RippleRenderer,
  ForegroundRipple,
  ForegroundRippleState
} from './ripple-renderer';
import './ripple.scss';

@Directive({ selector: '[md-ripple]' })
export class MdRippleDirective implements OnInit, OnDestroy, OnChanges {
  @Input('md-ripple-trigger') trigger: HTMLElement|HTMLElement;
  @Input('md-ripple-centered') centered: boolean;
  @Input('md-ripple-disabled') disabled: boolean;
  @Input('md-ripple-max-radius') maxRadius: number = 0;
  @Input('md-ripple-speed-factor') speedFactor: number = 1;
  @Input('md-ripple-color') color: string;
  @Input('md-ripple-background-color') backgroundColor: string;

  @HostBinding('class.md-ripple-focused')
  @Input('md-ripple-focused') focused: boolean;

  @HostBinding('class.md-ripple-unbounded')
  @Input('md-ripple-unbounded') unbounded: boolean;

  private _rippleRenderer: RippleRenderer;

  constructor(_elementRef: ElementRef) {
    // These event handlers are attached to the element that triggers the ripple animations.
    const eventHandlers = new Map<string, (e: Event) => void>();
    eventHandlers.set('mousedown', (event: MouseEvent) => this._mouseDown(event));
    eventHandlers.set('click', (event: MouseEvent) => this._click(event));
    eventHandlers.set('mouseleave', (event: MouseEvent) => this._mouseLeave(event));
    this._rippleRenderer = new RippleRenderer(_elementRef, eventHandlers);
  }

  ngOnInit(): void {
    // use the host element if the trigger element was not explicitly set.
    if (!this.trigger) {
      this._rippleRenderer.setTriggerElementToHost();
    }
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }): void {
    // If the trigger element changed (or is being initially set), add event listeners to it.
    const changedInputs = Object.keys(changes);
    if (changedInputs.indexOf('trigger') !== -1) {
      this._rippleRenderer.setTriggerElement(this.trigger);
    }
  }

  ngOnDestroy(): void {
    // Remove event listeners on the trigger element.
    this._rippleRenderer.clearTriggerElement();
  }

  /**
   * @description
   * Responds to the start of a ripple animation trigger by fading the background in.
   * @name start
   * @returns {void}
   */
  start(): void {
    this._rippleRenderer.fadeInRippleBackground(this.backgroundColor);
  }

  /**
   * @description Responds to the end of a ripple animation trigger by fading the background out, and creating a
   * foreground ripple that expands from the event location (or from the center of the element if
   * the "centered" property is set or forceCenter is true).
   * @name end
   * @param left {number}
   * @param top {number}
   * @param forceCenter {boolean}
   * @returns {void}
   */
  end(left: number, top: number, forceCenter: boolean = true): void {
    this._rippleRenderer.createForegroundRipple(
      left,
      top,
      this.color,
      this.centered || forceCenter,
      this.maxRadius,
      this.speedFactor,
      (ripple: ForegroundRipple, e: TransitionEvent) => this._rippleTransitionEnded(ripple, e)
    );
    this._rippleRenderer.fadeOutRippleBackground();
  }

  /**
   * @private
   * @name _rippleTransitionEnded
   * @param ripple {ForegroundRipple}
   * @param event {TransitionEvent}
   * @returns {void}
   */
  private _rippleTransitionEnded(ripple: ForegroundRipple, event: TransitionEvent): void {
    if (event.propertyName === 'opacity') {
      // If the ripple finished expanding, start fading it out. If it finished fading out,
      // remove it from the DOM.
      switch (ripple.state) {
        case ForegroundRippleState.EXPANDING:
          this._rippleRenderer.fadeOutForegroundRipple(ripple.rippleElement);
          ripple.state = ForegroundRippleState.FADING_OUT;
          break;
        case ForegroundRippleState.FADING_OUT:
          this._rippleRenderer.removeRippleFromDom(ripple.rippleElement);
          break;
      }
    }
  }

  /**
   * @private
   * @description Called when the trigger element receives a mousedown event. Starts the ripple animation by
   * fading in the background.
   * @name _mouseDown
   * @param event {MouseEvent}
   * @returns {void}
   */
  private _mouseDown(event: MouseEvent): void {
    if (!this.disabled && event.button === 0) {
      this.start();
    }
  }

  /**
   * @private
   * @description Called when the trigger element receives a click event. Creates a foreground ripple and
   * runs its animation.
   * @name _click
   * @param event {MouseEvent}
   * @returns {void}
   */
  private _click(event: MouseEvent): void {
    if (!this.disabled && event.button === 0) {
      // If screen and page positions are all 0, this was probably triggered by a keypress.
      // In that case, use the center of the bounding rect as the ripple origin.
      const isKeyEvent =
        (event.screenX === 0 && event.screenY === 0 && event.pageX === 0 && event.pageY === 0);
      this.end(event.pageX, event.pageY, isKeyEvent);
    }
  }

  /**
   * @private
   * @description Called when the trigger element receives a mouseleave event. Fades out the background.
   * @name _mouseLeave
   * @param event {MouseEvent}
   * @returns {void}
   */
  private _mouseLeave(event: MouseEvent): void {
    // We can always fade out the background here; It's a no-op if it was already inactive.
    this._rippleRenderer.fadeOutRippleBackground();
  }
}