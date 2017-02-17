import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/of';
import { Component, ViewEncapsulation } from '@angular/core';
import { overlayOptions } from 'src/filters';
import { FiltersService } from '../services/filters-service';
import { Modal } from '../components/modal/services/modal';
import { ModalDismissReasons } from '../components/modal';
import './filters-landing-page.scss';

@Component({
  selector: 'filters-landing-page',
  encapsulation: ViewEncapsulation.None,
  template:`
  <main class="main">      
    <section class="gallery-section">         
      <gallery 
       [image]="filters.selectedImage$ | async"
       [active]="!isActive"
       (onSelect)="select($event)">      
      </gallery>
         
      <main class="main-photo">
        <section class="modal-trigger-cont">
          <p class="modal-trigger" (click)="openModal(content)">
            <i class="fa fa-picture-o" aria-hidden="true"></i>
            Select an image from Unsplash
          </p>
          <p class="gallery-trigger" (click)="isActive = !isActive">
            <i class="fa fa-sliders" aria-hidden="true"></i>
            <span>Hide Presets</span>
          </p>
        </section>
        <photo
         [overlay]="filters.overlayStyle$ | async"
         [filter]="filters.filterStyle$ | async"
         [image]="filters.selectedImage$ | async">         
        </photo>               
        <div class="credits">
          <p class="credits-cite"> 
            <i class="fa fa-code" aria-hidden="true"></i> 
            by <a href="https://github.com/jaykan" target="_blank">Jay Kan</a> with
            <i class="fa fa-heart" aria-hidden="true"></i>
          </p>
        </div> 
      </main>                  
    </section>
        
    <aside class="filters-section" nano>  
      <div nano-content>
        <section class="filters-header-container">
          <p class="header">Filters:</p>
          <p class="clear-all" (click)="filters.resetToDefaults()">Clear All</p>
        </section>        
        <div class="filters">
          <section>
            <p class="slider-label">Contrast</p>
            <p class="slider-value">{{ filters.contrast$ | async }}%</p>
          </section>       
          <md-slider
           thumb-label
           [min]="'0'"
           [max]="'200'"
           [filterType]="'contrast'"
           [value]="filters.contrast$ | async"         
           (valueChange)="change($event)">         
          </md-slider>                  
                    
          <section>
            <p class="slider-label">Brightness</p>
            <p class="slider-value">{{ filters.brightness$ | async }}%</p>
          </section>       
          <md-slider
            thumb-label
            [min]="'0'"
            [max]="'200'"
            [filterType]="'brightness'"
            [value]="filters.brightness$ | async"
            (valueChange)="change($event)">          
          </md-slider>
          
          <section>
            <p class="slider-label">Saturate</p>
            <p class="slider-value">{{ filters.saturate$ | async }}%</p>
          </section>                                                     
          <md-slider
           thumb-label
           [min]="'0'"
           [max]="'200'"
           [filterType]="'saturate'"
           [value]="filters.saturate$ | async"
           (valueChange)="change($event)">        
          </md-slider>
          
          <section>
            <p class="slider-label">Sepia</p>
            <p class="slider-value">{{ filters.sepia$ | async }}%</p>
          </section>                
          <md-slider
            thumb-label
            [min]="'0'"
            [max]="'100'"
            [filterType]="'sepia'"
            [value]="filters.sepia$ | async"
            (valueChange)="change($event)">        
          </md-slider>
          
          <section>
            <p class="slider-label">Grayscale</p>
            <p class="slider-value">{{ filters.grayscale$ | async }}%</p>
          </section>           
          <md-slider
            thumb-label
            [min]="'0'"
            [max]="'100'"
            [filterType]="'grayScale'"
            [value]="filters.grayscale$ | async"
            (valueChange)="change($event)">          
          </md-slider>
          
          <section>
            <p class="slider-label">Invert</p>
            <p class="slider-value">{{ filters.invert$ | async }}%</p>
          </section>         
          <md-slider
            thumb-label
            [min]="'0'"
            [max]="'100'"
            [filterType]="'invert'"
            [value]="filters.invert$ | async"
            (valueChange)="change($event)">          
          </md-slider>
          
          <section>
            <p class="slider-label">Hue Rotate</p>
            <p class="slider-value">{{ filters.hueRotate$ | async }}deg</p>
          </section>  
          <md-slider
            thumb-label
            [min]="'0'"
            [max]="'360'"
            [filterType]="'hueRotate'"
            [value]="filters.hueRotate$ | async"
            (valueChange)="change($event)">          
          </md-slider>
          
          <section>
            <p class="slider-label">Blur</p>
            <p class="slider-value">{{ filters.blur$ | async }}px</p>
          </section>        
          <md-slider
            thumb-label
            [min]="'0'"
            [max]="'10'"
            [filterType]="'blur'"
            [value]="filters.blur$ | async"
            (valueChange)="change($event)">          
          </md-slider>
          
          <div>
            <section>
              <p class="header overlay">Overlay:</p>           
            </section>         
            <md-radio-group [name]="'overlay_options'" [value]="filters.blend$ | async">
              <md-radio-button 
                *ngFor="let option of options" 
                [name]="'overlay_options'"               
                [value]="option.val"
                (change)="change($event)">
                {{ option.label }}
              </md-radio-button>
            </md-radio-group>                              
          </div>             
        </div>
      </div>
    </aside>
  </main>
   
  <template ModalContainer></template>  
  <template #content let-c="close" let-d="dismiss">
    <div class="modal-header">
      <h4 class="modal-title">Select an image</h4>
      <button type="button" class="close" aria-label="Close" (click)="d('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">     
      <article 
        class="image-thumb"
        *ngFor="let image of (filters.images$ | async)"
        (click)="selectImage(image.id, d)"
      >
        <img class="modal-image" [src]="image.thumb">       
      </article>     
      <section *ngIf="filters.error$ | async">{{ filters.error$ | async }}</section>
    </div>    
  </template>      
`
})
export class FiltersLandingPageComponent {
  options: Object[] = overlayOptions || [];
  isActive: boolean;

  constructor(
    public filters: FiltersService,
    private modalService: Modal
  ) {
    this.filters.loadAllImages();
  }

  select({ figureStyle, overlayStyle }: { figureStyle: any, overlayStyle: any }): void {
    this.filters.change({
      value: {
        figureStyle: figureStyle,
        overlayStyle: overlayStyle
      },
      type: FiltersService.PRESET
    });
  }

  change({ value, type }: { value: number, type: string }): void {
    this.filters.change({ value, type });
  }

  selectImage(image: string, callback: Function): void {
    const src: any = `https://source.unsplash.com/${image}/800x600`;
    this.change({ value: src, type: 'image' });
    callback('Exit from callback');
  }

  openModal(content: any): void {
    this.modalService.open(content).result.then((result) => {
      console.log(`Closed with: ${result}`);
    }, (reason) => {
      console.log(`Dismissed ${this.getDismissReason(reason)}`);
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}