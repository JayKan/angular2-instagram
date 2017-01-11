import {
  Component,
  ViewEncapsulation,
  Output,
  EventEmitter,
  Input,
  ElementRef,
  Renderer,
  OnInit,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { ModalDismissReasons } from '../interfaces';
import './modal-window.scss';

@Component({
  selector: 'modal-window',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': '"modal fade show" + (windowClass ? " " + windowClass : "")',
    'role': 'dialog',
    'tabindex': '-1',
    'style': 'display: block;',
    '(keyup.esc)': 'escKey($event)',
    '(click)': 'backdropClick($event)'
  },
  template:`
   <div [class]="'modal-dialog' + (size ? ' modal-' + size : '')" role="document">
      <div class="modal-content"><ng-content></ng-content></div>
  </div>
  `
})
export class ModalWindowComponent implements OnInit, AfterViewInit, OnDestroy {

  private _elWithFocus: Element;  // element that is focused prior to modal opening

  @Input() backdrop: boolean | string = true;
  @Input() keyboard: boolean = true;
  @Input() size: string;
  @Input() windowClass: string;

  @Output('dismiss') dismissEvent: EventEmitter<any> = new EventEmitter<any>(false);

  constructor(private _elRef: ElementRef, private _renderer: Renderer) {}

  backdropClick($event: any): void {
    if (this.backdrop === true && this._elRef.nativeElement === $event.target) {
      this.dismiss(ModalDismissReasons.BACKDROP_CLICK);
    }
  }

  escKey($event: any): void {
    if (this.keyboard && !$event.defaultPrevented) {
      this.dismiss(ModalDismissReasons.ESC);
    }
  }

  dismiss(reason: any): void {
    this.dismissEvent.emit(reason);
  }

  ngOnInit(): void {
    this._elWithFocus = document.activeElement;
    this._renderer.setElementClass(document.body, 'modal-open', true);
  }

  ngAfterViewInit(): void {
    if (!this._elRef.nativeElement.contains(document.activeElement)) {
      this._renderer.invokeElementMethod(this._elRef.nativeElement, 'focus', []);
    }
  }

  ngOnDestroy(): void {
    if (this._elWithFocus && document.body.contains(this._elWithFocus)) {
      this._renderer.invokeElementMethod(this._elWithFocus, 'focus', []);
    } else {
      this._renderer.invokeElementMethod(document.body, 'focus', []);
    }

    this._elWithFocus = null;
    this._renderer.setElementClass(document.body, 'modal-open', false);
  }
}
