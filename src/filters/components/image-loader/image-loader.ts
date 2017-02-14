import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input } from '@angular/core';
import './image-loader.scss';

@Component({
  selector: 'image-loader',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template:`
  <div class="imageLoader">
    <img [src]="image">
  </div> 
  `
})
export class ImageLoaderComponent {
  @Input() image: string;
}