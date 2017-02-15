import {
  Component,
  AfterContentInit,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Optional,
  Output,
  QueryList,
  forwardRef,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { coerceBooleanProperty } from 'src/filters';
import { UniqueSelectionDispatcher } from '../../core/coordination';
import './radio.scss';

/**
 * Provider Expression that allows md-radio-group to register as a ControlValueAccessor. This
 * allows it to support [(ngModel)] and ngControl.
 */
export const MD_RADIO_GROUP_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MdRadioGroup),
  multi: true
};

let _uniqueIdCounter = 0;

export class MdRadioChange {
  public source: MdRadioButton;
  public value: any;
  public type: string;
}

@Directive({
  selector: 'md-radio-group',
  providers: [MD_RADIO_GROUP_CONTROL_VALUE_ACCESSOR],
  host: {
    'role': 'radiogroup',
  }
})
export class MdRadioGroup implements AfterContentInit, ControlValueAccessor {
  private _value: any = null;
  private _name: string = `md-radio-group-${_uniqueIdCounter++}`;
  private _disabled: boolean = false;
  private _selected: MdRadioButton = null;
  private _isInitialized: boolean = false;

  _controlValueAccessorChangeFn: (value: any) => void = (value) => {};
  onTouched: () => any = () => {};

  @Output()
  change: EventEmitter<MdRadioChange> = new EventEmitter<MdRadioChange>(false);

  @ContentChildren(forwardRef(() => MdRadioButton))
  _radios: QueryList<MdRadioButton> = null;

  @Input() align: 'start' | 'end';

  @Input()
  get name(): string { return this._name; }
  set name(value: string) {
    this._name = value;
    this._updateRadioButtonNames();
  }

  @Input()
  get disabled(): boolean { return this._disabled; }
  set disabled(value: boolean) {
    this._disabled = (value != null && value !== false) ? true : null;
  }

  @Input()
  get value(): any { return this._value; }
  set value(newValue: any) {
    if (this._value != newValue) {
      // Set this before proceeding to ensure no circular loop occurs with selection.
      this._value = newValue;

      this._updateSelectedRadioFromValue();

      // Only fire a change event if this isn't the first time the value is ever set.
      if (this._isInitialized) {
        this._emitChangeEvent();
      }
    }
  }

  @Input()
  get selected(): MdRadioButton { return this._selected; }
  set selected(selected: MdRadioButton) {
    this._selected = selected;
    this.value = selected ? selected.value : null;

    if (selected && !selected.checked) {
      selected.checked = true;
    }
  }

  ngAfterContentInit(): void {
    // Mark this component as initialized in AfterContentInit because the initial value can
    // possibly be set by NgModel on MdRadioGroup, and it is possible that the OnInit of the
    // NgModel occurs *after* the OnInit of the MdRadioGroup.
    this._isInitialized = true;
  }

  /**
   * @description
   * Mark this group as being "touched" (for ngModel). Meant to be called by the contained
   * radio buttons upon their blur.
   * @name _touch
   * @returns {void}
   */
  _touch(): void {
    if (this.onTouched) {
      this.onTouched();
    }
  }

  /**
   * @private
   * @name _updateRadioButtonNames
   * @returns {void}
   */
  private _updateRadioButtonNames(): void {
    if (this._radios) {
      this._radios.forEach(radio => radio.name = this.name);
    }
  }

  /**
   * @private
   * @description Updates the `selected` radio button from the internal _value state.
   * @name _updateSelectedRadioFromValue
   * @returns {void}
   */
  private _updateSelectedRadioFromValue(): void {
    // If the value already matches the selected radio, do nothing.
    let isAlreadySelected = this._selected != null && this._selected.value == this._value;

    if (this._radios != null && !isAlreadySelected) {
      let matchingRadio = this._radios.filter(radio => radio.value == this._value)[0];

      if (matchingRadio) {
        this.selected = matchingRadio;
      } else if (this.value == null) {
        this.selected = null;
        this._radios.forEach(radio => { radio.checked = false; });
      }
    }
  }

  /**
   * @private
   * @description Dispatch change event with current selection and group value
   * @name _emitChangeEvent
   * @returns {void}
   */
  private _emitChangeEvent(): void {
    let event = new MdRadioChange();
    event.source = this._selected;
    event.value = this._value;
    this.change.emit(event);
  }

  /**
   * @description Implemented as part of ControlValueAccessor
   * @name writeValue
   * @param value {any}
   * @returns {void}
   */
  writeValue(value: any): void {
    this.value = value;
  }

  /**
   * @description Implemented as part of ControlValueAccessor
   * @name registerOnChange
   * @param fn {Function}
   * @returns {void}
   */
  registerOnChange(fn: (value: any) => void): void {
    this._controlValueAccessorChangeFn = fn;
  }

  /**
   * @description Implemented as part of ControlValueAccessor
   * @name registerOnTouched
   * @param fn {any}
   * @returns {void}
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}


@Component({
  selector: 'md-radio-button',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template:`
  <label [attr.for]="inputId" class="md-radio-label"> 
    <div class="md-radio-container">
      <div class="md-radio-outer-circle"></div>
      <div class="md-radio-inner-circle"></div>
      <div md-ripple *ngIf="!disableRipple" class="md-radio-ripple"
           [md-ripple-trigger]="getHostElement()"
           [md-ripple-centered]="true"
           [md-ripple-speed-factor]="0.3"
           [md-ripple-background-color]="'rgba(0, 0, 0, 0)'"></div>
    </div>

    <input #input class="md-radio-input md-visually-hidden" type="radio"
            [id]="inputId"
            [checked]="checked"
            [disabled]="disabled"
            [name]="name"
            [attr.aria-label]="ariaLabel"
            [attr.aria-labelledby]="ariaLabelledby"
            (change)="_onInputChange($event)"
            (focus)="_onInputFocus()"
            (blur)="_onInputBlur()"
            (click)="_onInputClick($event)">
 
    <div class="md-radio-label-content" [class.md-radio-align-end]="align === 'end'">
      <ng-content></ng-content>
    </div>
  </label>
  `
})
export class MdRadioButton implements OnInit {
  private _checked: boolean = false;
  private _disabled: boolean;
  private _value: any = null;
  private _disableRipple: boolean = true;
  private _align: 'start' | 'end';

  radioGroup: MdRadioGroup;

  @HostBinding('class.md-radio-focused')
  _isFocused: boolean;

  @HostBinding('id')
  @Input()
  id: string = `md-radio-${_uniqueIdCounter++}`;

  @Input()
  name: string;

  @Input('aria-label')
  ariaLabel: string;

  @Input('aria-labelledby')
  ariaLabelledby: string;

  @Input()
  get disableRipple(): boolean { return this._disableRipple; }
  set disableRipple(value) { this._disableRipple = coerceBooleanProperty(value); }

  @HostBinding('class.md-radio-checked')
  @Input()
  get checked(): boolean { return this._checked; }
  set checked(newCheckedState: boolean) {
    this._checked = newCheckedState;

    if (newCheckedState && this.radioGroup && this.radioGroup.value !== this.value) {
      this.radioGroup.selected = this;
    } else if (!newCheckedState && this.radioGroup && this.radioGroup.value === this.value) {
      // When unchecking the selected radio button, update the selected radio
      // property on the group.
      this.radioGroup.selected = null;
    }

    if (newCheckedState) {
      // Notify all radio buttons with the same name to un-check.
      this.radioDispatcher.notify(this.id, this.name);
    }
  }

  @Input()
  get value(): any { return this._value; }
  set value(value: any) {
    if (this._value !== value) {
      if (this.radioGroup !== null && this.checked) {
        this.radioGroup.value = value;
      }
      this._value = value;
    }
  }

  @Input()
  get align(): 'start' | 'end' {
    return this._align || (this.radioGroup !== null && this.radioGroup.align) || 'start';
  }
  set align(value: 'start' | 'end') {
    this._align = value;
  }

  @HostBinding('class.md-radio-disabled')
  @Input()
  get disabled(): boolean {
    return this._disabled || (this.radioGroup != null && this.radioGroup.disabled);
  }
  set disabled(value: boolean) {
    // The presence of *any* disabled value makes the component disabled, *except* for false.
    this._disabled = (value != null && value !== false) ? true : null;
  }

  @Output()
  change: EventEmitter<MdRadioChange> = new EventEmitter<MdRadioChange>(false);

  get inputId(): string {
    return `${this.id}-input`;
  }

  constructor(@Optional() radioGroup: MdRadioGroup,
              private _elementRef: ElementRef,
              public radioDispatcher: UniqueSelectionDispatcher) {
    this.radioGroup = radioGroup;

    radioDispatcher.listen((id: string, name: string) => {
      if (id !== this.id && name === this.name) {
        this.checked = false;
      }
    });
  }

  ngOnInit(): void {
    if (this.radioGroup) {
      // If the radio is inside a radio group, determine if it should be checked
      this.checked = this.radioGroup.value === this._value;
      // Copy name from parent radio group
      this.name = this.radioGroup.name;
    }
  }

  /**
   * @private
   * @description Dispatch change event with current value
   * @name _emitChangeEvent
   * @returns {void}
   */
  private _emitChangeEvent(): void {
    let event = new MdRadioChange();
    event.source = this;
    event.value = this._value;
    event.type = 'blend';
    this.change.emit(event);
  }

  /**
   * We use a hidden native input field to handle changes to focus state via keyboard navigation,
   * with visual rendering done separately. The native element is kept in sync with the overall
   * state of the component.
   */
  _onInputFocus(): void {
    this._isFocused = true;
  }

  _onInputBlur(): void {
    this._isFocused = false;

    if (this.radioGroup) {
      this.radioGroup._touch();
    }
  }

  _onInputClick(event: Event): void {
    // We have to stop propagation for click events on the visual hidden input element.
    // By default, when a user clicks on a label element, a generated click event will be
    // dispatched on the associated input element. Since we are using a label element as our
    // root container, the click event on the `radio-button` will be executed twice.
    // The real click event will bubble up, and the generated click event also tries to bubble up.
    // This will lead to multiple click events.
    // Preventing bubbling for the second event will solve that issue.
    event.stopPropagation();
  }

  /**
   * @description
   * Triggered when the radio button received a click or the input recognized any change.
   * Clicking on a label element, will trigger a change event on the associated input.
   * @param event {Event}
   * @returns {void}
   */
  _onInputChange(event: Event): void {
    // We always have to stop propagation on the change event.
    // Otherwise the change event, from the input element, will bubble up and
    // emit its event object to the `change` output.
    event.stopPropagation();

    this.checked = true;
    this._emitChangeEvent();

    if (this.radioGroup) {
      this.radioGroup._controlValueAccessorChangeFn(this.value);
      this.radioGroup._touch();
    }
  }

  getHostElement(): HTMLElement {
    return this._elementRef.nativeElement;
  }
}