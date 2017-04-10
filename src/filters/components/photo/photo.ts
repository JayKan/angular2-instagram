import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input } from '@angular/core';
import { FilterStyle, OverlayStyle } from 'src/filters';
import './photo.scss';

@Component({
  selector: 'photo',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template:`
  <div class="photo">
    <figure [ngStyle]="filter">
      <spinner-loader [loading]="loading"></spinner-loader>
      <div [ngStyle]="overlay"></div>
      <image-loader [image]="image"></image-loader>
    </figure>
  </div>
  `
})
export class PhotoComponent {
  @Input() overlay: OverlayStyle;
  @Input() filter: FilterStyle;
  @Input() image: string;
  @Input() loading: boolean;
}
