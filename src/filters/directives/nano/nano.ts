import { Directive, ElementRef } from '@angular/core';
import * as jQuery from 'jquery';
import 'nanoscroller';

@Directive({
  selector: '[nano]',
  host: { 'class': 'nano' }
})
export class NanoScroller {
  constructor(element: ElementRef) {
    setTimeout(() => jQuery(element.nativeElement)['nanoScroller'](), 200);
  }
}

@Directive({
  selector: '[nano-content]',
  host: { 'class': 'nano-content' }
})
export class NanoScrollerContent {}
