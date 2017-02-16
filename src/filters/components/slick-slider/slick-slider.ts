import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, AfterContentInit, ElementRef } from '@angular/core';
import * as jQuery from 'jquery';
import 'slick-carousel';
import './slick-slider.scss';

@Component({
  selector: 'slick-slider',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template:` 
  <ng-content></ng-content>
  `
})
export class SlickSliderComponent implements AfterContentInit {

  @Input() settings: any;
  @Input() gallery: any;

  defaultOptions: any = {};

  constructor(private el: ElementRef) {}

  ngAfterContentInit(): void {
    for (let key in this.settings) {
      if (this.settings.hasOwnProperty(key) && !this.defaultOptions.hasOwnProperty(key)) {
        this.defaultOptions[key] = this.settings[key];
      }
    }
    jQuery(this.el.nativeElement).slice(this.defaultOptions);
  }
}