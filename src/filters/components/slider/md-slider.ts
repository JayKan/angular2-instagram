import {
  Component,
  ElementRef,
  HostBinding,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  AfterContentInit,
  AfterViewInit,
  forwardRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { applyCssTransform, coerceBooleanProperty } from '../../';
import { Input as HammerInput } from 'hammerjs';
import 'hammerjs';
import './md-slider.scss';

/**
 * Visually, a 30px separation between tick marks looks best. This is very subjective but it is
 * the default separation we chose.
 */
const MIN_AUTO_TICK_SEPARATION = 30;

/**
 * Provider Expression that allows md-slider to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)] and [formControl].
 */
export const MD_SLIDER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MdSliderComponent),
  multi: true
};

@Component({
  selector: 'md-slider',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MD_SLIDER_VALUE_ACCESSOR],
  host: {
    'tabindex': '0',
    '(click)': 'onClick($event)',
    '(slide)': 'onSlide($event)',
    '(slidestart)': 'onSlideStart($event)',
    '(slideend)': 'onSlideEnd()',
    '(window:resize)': 'onResize()',
    '(blur)': 'onBlur()',
  },
  template:`
  <div class="md-slider-wrapper">
    <div class="md-slider-container"
       [class.md-slider-sliding]="isSliding && isActive"
       [class.md-slider-active]="isActive"
       [class.md-slider-thumb-label-showing]="thumbLabel">
      <div class="md-slider-track-container">
        <div class="md-slider-track"></div>
        <div class="md-slider-track md-slider-track-fill"></div>
        <div class="md-slider-tick-container"></div>
        <div class="md-slider-last-tick-container"></div>
      </div>

      <div class="md-slider-thumb-container">
        <div class="md-slider-thumb-position">
          <div class="md-slider-thumb"></div>
          <div class="md-slider-thumb-label">
            <span class="md-slider-thumb-label-text">{{ value }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
})
export class MdSliderComponent implements AfterContentInit, AfterViewInit, ControlValueAccessor {
  private _renderer: SliderRenderer = null;
  private _sliderDimensions: ClientRect = null;

  private _disabled: boolean = false;
  @Input()
  @HostBinding('class.md-slider-disabled')
  @HostBinding('attr.aria-disabled')
  get disabled(): boolean { return this._disabled; }
  set disabled(value) { this._disabled = coerceBooleanProperty(value); }

  /** Whether or not to show the thumb label. */
  private _thumbLabel: boolean = false;

  @Input('thumb-label')
  get thumbLabel(): boolean { return this._thumbLabel; }
  set thumbLabel(value) { this._thumbLabel = coerceBooleanProperty(value); }

  /** The minimum value that the slider can have. */
  private _min: number = 0;

  @Input()
  @HostBinding('attr.aria-valuemin')
  get min(): number { return this._min; }
  set min(v: number) {
    // This has to be forced as a number to handle the math later.
    this._min = Number(v);

    // If the value wasn't explicitly set by the user, set it to the min.
    if (!this._isInitialized) {
      this.value = this._min;
    }
    this.snapThumbToValue();
    this._updateTickSeparation();
  }

  /** The maximum value that the slider can have. */
  private _max: number = 100;

  @Input()
  @HostBinding('attr.aria-valuemax')
  get max(): number { return this._max; }
  set max(v: number) {
    this._max = Number(v);
    this.snapThumbToValue();
    this._updateTickSeparation();
  }

  /** The percentage of the slider that coincides with the value. */
  private _percent: number  = 0;

  private _controlValueAccessorChangeFn: (value: any) => void = (value) => {};

  onTouched: () => any = () => {};

  /** The values at which the thumb will snap. */
  @Input() step: number = 1;

  /**
   * How often to show ticks. Relative to the step so that a tick always appears on a step.
   * Ex: Tick interval of 4 with a step of 3 will draw a tick every 4 steps (every 12 values).
   */
  @Input('tick-interval') _tickInterval: 'auto' | number;

  /**
   * Whether or not the thumb is sliding.
   * Used to determine if there should be a transition for the thumb and fill track.
   */
  isSliding: boolean = false;

  /**
   * Whether or not the slider is active (clicked or sliding).
   * Used to shrink and grow the thumb as according to the Material Design spec.
   */
  isActive: boolean = false;

  /** Indicator for if the value has been set or not. */
  private _isInitialized: boolean = false;

  /** Value of the slider. */
  private _value: number = 0;

  @Input()
  @HostBinding('attr.aria-valuenow')
  get value(): number { return this._value; }
  set value(v: number) {
    // Only set the value to a valid number. v is casted to an any as we know it will come in as a
    // string but it is labeled as a number which causes parseFloat to not accept it.
    if (isNaN(parseFloat(<any> v))) {
      return;
    }

    this._value = Number(v);
    this._isInitialized = true;
    this._controlValueAccessorChangeFn(this._value);
    this.snapThumbToValue();
  }

  @Input() filterType: string;

  @Output() valueChange: EventEmitter<{ value: number, type: string }> = new EventEmitter<{ value: number, type: string }>(false);

  constructor(elementRef: ElementRef) {
    this._renderer = new SliderRenderer(elementRef);
  }

  ngAfterContentInit(): void {
    this._sliderDimensions = this._renderer.getSliderDimensions();
    // This needs to be called after content init because the value can be set to the min if the
    // value itself isn't set. If this happens, the control value accessor needs to be updated.
    this._controlValueAccessorChangeFn(this.value);
    this.snapThumbToValue();
    this._updateTickSeparation();
  }

  ngAfterViewInit(): void {
    this.onResize();
  }

  onClick(event: MouseEvent): void {
    if (this.disabled) {
      return;
    }
    this.isActive = true;
    this.isSliding = false;
    this._renderer.addFocus();
    this.updateValueFromPosition(event.clientX);
    this.snapThumbToValue();
  }

  onSlide(event: HammerInput): void {
    if (this.disabled) {
      return;
    }
    // Prevent the slide from selecting anything else.
    event.preventDefault();
    this.updateValueFromPosition(event.center.x);
  }

  onSlideStart(event: HammerInput): void {
    if (this.disabled) {
      return;
    }
    event.preventDefault();
    this.isSliding = true;
    this.isActive = true;
    this._renderer.addFocus();
    this.updateValueFromPosition(event.center.x);
  }

  onSlideEnd(): void {
    this.isSliding = false;
    this.snapThumbToValue();
  }

  onResize(): void {
    this.isSliding = true;
    this._sliderDimensions = this._renderer.getSliderDimensions();
    // Skip updating the value and position as there is no new placement.
    this._renderer.updateThumbAndFillPosition(this._percent, this._sliderDimensions.width);
  }

  onBlur(): void {
    this.isActive = false;
    this.onTouched();
  }

  /**
   * When the value changes without a physical position, the percentage needs to be recalculated
   * independent of the physical location.
   * This is also used to move the thumb to a snapped value once sliding is done.
   */
  updatePercentFromValue(): void {
    this._percent = this.calculatePercentage(this.value);
  }

  /**
   * Calculate the new value from the new physical location. The value will always be snapped.
   */
  updateValueFromPosition(pos: number): void {
    let offset = this._sliderDimensions.left;
    let size = this._sliderDimensions.width;

    // The exact value is calculated from the event and used to find the closest snap value.
    this._percent = this.clamp((pos - offset) / size);
    let exactValue = this.calculateValue(this._percent);

    // This calculation finds the closest step by finding the closest whole number divisible by the
    // step relative to the min.
    let closestValue = Math.round((exactValue - this.min) / this.step) * this.step + this.min;
    // The value needs to snap to the min and max.
    this.value = this.clamp(closestValue, this.min, this.max);

    if (this.filterType) {
      this.valueChange.emit({ value: this.value, type: this.filterType });
    }
    this._renderer.updateThumbAndFillPosition(this._percent, this._sliderDimensions.width);
  }

  /**
   * Snaps the thumb to the current value.
   * Called after a click or drag event is over.
   */
  snapThumbToValue(): void {
    this.updatePercentFromValue();
    if (this._sliderDimensions) {
      let renderedPercent = this.clamp(this._percent);
      this._renderer.updateThumbAndFillPosition(renderedPercent, this._sliderDimensions.width);
    }
  }

  /**
   * Calculates the separation in pixels of tick marks. If there is no tick interval or the interval
   * is set to something other than a number or 'auto', nothing happens.
   */
  private _updateTickSeparation(): void {
    if (!this._sliderDimensions) {
      return;
    }
    if (this._tickInterval == 'auto') {
      this._updateAutoTickSeparation();
    } else if (Number(this._tickInterval)) {
      this._updateTickSeparationFromInterval();
    }
  }

  /**
   * Calculates the optimal separation in pixels of tick marks based on the minimum auto tick
   * separation constant.
   */
  private _updateAutoTickSeparation(): void {
    // We're looking for the multiple of step for which the separation between is greater than the
    // minimum tick separation.
    let sliderWidth = this._sliderDimensions.width;

    // This is the total "width" of the slider in terms of values.
    let valueWidth = this.max - this.min;

    // Calculate how many values exist within 1px on the slider.
    let valuePerPixel = valueWidth / sliderWidth;

    // Calculate how many values exist in the minimum tick separation (px).
    let valuePerSeparation = valuePerPixel  * MIN_AUTO_TICK_SEPARATION;

    // Calculate how many steps exist in this separation. This will be the lowest value you can
    // multiply step by to get a separation that is greater than or equal to the minimum tick
    // separation.
    let stepsPerSeparation = Math.ceil(valuePerSeparation / this.step);

    // Get the percentage of the slider for which this tick would be located so we can then draw
    // it on the slider.
    let tickPercentage = this.calculatePercentage((this.step * stepsPerSeparation) + this.min);

    // The pixel value of the tick is the percentage * the width of the slider. Use this to draw
    // the ticks on the slider.
    this._renderer.drawTicks(sliderWidth * tickPercentage);
  }

  /**
   * Calculates the separation of tick marks by finding the pixel value of the tickInterval.
   */
  private _updateTickSeparationFromInterval(): void {
    // Force tickInterval to be a number so it can be used in calculations.
    let interval: number = <number> this._tickInterval;
    // Calculate the first value a tick will be located at by getting the step at which the interval
    // lands and adding that to the min.
    let tickValue = (this.step * interval) + this.min;

    // The percentage of the step on the slider is needed in order to calculate the pixel offset
    // from the beginning of the slider. This offset is the tick separation.
    let tickPercentage = this.calculatePercentage(tickValue);
    this._renderer.drawTicks(this._sliderDimensions.width * tickPercentage);
  }

  calculatePercentage(value: number): number {
    return (value - this.min) / (this.max - this.min);
  }

  /**
   * Calculates the value a percentage of the slider corresponds to.
   */
  calculateValue(percentage: number): number {
    return this.min + (percentage * (this.max - this.min));
  }

  /**
   * Return a number between two numbers.
   */
  clamp(value: number, min = 0, max = 1): number {
    return Math.max(min, Math.min(value, max));
  }

  /**
   * Implemented as part of ControlValueAccessor.
   * TODO: internal
   */
  writeValue(value: any): void {
    this.value = value;

    if (this._sliderDimensions) {
      this.snapThumbToValue();
    }
  }

  /**
   * Implemented as part of ControlValueAccessor.
   * TODO: internal
   */
  registerOnChange(fn: (value: any) => void): void {
    this._controlValueAccessorChangeFn = fn;
  }

  /**
   * Implemented as part of ControlValueAccessor.
   * TODO: internal
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Implemented as part of ControlValueAccessor
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}

export class SliderRenderer {
  private _sliderElement: HTMLElement;

  constructor(elementRef: ElementRef) {
    this._sliderElement = elementRef.nativeElement;
  }

  /**
   * @description Get the bounding client rect of the slider track element.
   * The track is used rather than the native element to ignore the extra space that the thumb can
   * take up.
   * @name getSliderDimensions
   * @returns {ClientRect}
   */
  getSliderDimensions(): ClientRect {
    let trackElement = this._sliderElement.querySelector('.md-slider-track');
    return trackElement.getBoundingClientRect();
  }

  /**
   * @description Update the physical position of the thumb and fill track on the slider.
   * @name updateThumbAndFillPosition
   * @param percent {number}
   * @param width {number}
   * @returns {void}
   */
  updateThumbAndFillPosition(percent: number, width: number): void {
    // A container element that is used to avoid overwriting the transform on the thumb itself.
    let thumbPositionElement: HTMLElement = <HTMLElement>this._sliderElement.querySelector('.md-slider-thumb-position');
    let fillTrackElement: HTMLElement = <HTMLElement>this._sliderElement.querySelector('.md-slider-track-fill');

    let position: number = Math.round(percent * width);

    fillTrackElement.style.width = `${position}px`;
    applyCssTransform(thumbPositionElement, `translateX(${position}px)`);
  }

  /**
   * @description Focuses the native element.
   * Currently only used to allow a blur event to fire but will be used with keyboard input later.
   * @returns {void}
   */
  addFocus(): void {
    this._sliderElement.focus();
  }

  /**
   * @description Draws ticks onto the tick container.
   * @name drawTicks
   * @param tickSeparation {number}
   * @returns {void}
   */
  drawTicks(tickSeparation: number): void {
    let sliderTrackContainer: HTMLElement = <HTMLElement>this._sliderElement.querySelector('.md-slider-track-container');
    let tickContainerWidth: number = sliderTrackContainer.getBoundingClientRect().width;
    let tickContainer: HTMLElement = <HTMLElement>this._sliderElement.querySelector('.md-slider-tick-container');
    // An extra element for the last tick is needed because the linear gradient cannot be told to
    // always draw a tick at the end of the gradient. To get around this, there is a second
    // container for ticks that has a single tick mark on the very right edge.
    let lastTickContainer: HTMLElement = <HTMLElement>this._sliderElement.querySelector('.md-slider-last-tick-container');

    // Subtracts 1 from the tick separation to center the tick.
    tickContainer.style.background = `repeating-linear-gradient(to right, black, black 2px, ` +
      `transparent 2px, transparent ${tickSeparation - 1}px)`;
    // Adds a tick to the very end by starting on the right side and adding a 2px black line.
    lastTickContainer.style.background = `linear-gradient(to left, black, black 2px, transparent ` +
      `2px, transparent)`;

    if (tickContainerWidth % tickSeparation < (tickSeparation / 2)) {
      // If the second to last tick is too close (a separation of less than half the normal
      // separation), don't show it by decreasing the width of the tick container element.
      tickContainer.style.width = tickContainerWidth - tickSeparation + 'px';
    } else {
      // If there is enough space for the second-to-last tick, restore the default width of the
      // tick container.
      tickContainer.style.width = '';
    }
  }
}
