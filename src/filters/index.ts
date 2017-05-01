import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { SharedModule } from 'src/shared';
import { Angular2InstagramCoreModule } from 'angular2-instagram-core';

import { ModalModule } from './components/modal';
import { FiltersLandingPageComponent } from './pages/filters-landing-page';
import { PhotoComponent } from './components/photo';
import { ImageLoaderComponent } from './components/image-loader';
import { GalleryComponent } from './components/gallery';
import { SpinnerLoaderComponent } from './components/spinner-loader';
import { MdSliderComponent } from './components/slider';
import { MdRadioGroup, MdRadioButton } from './components/radio';
import { MdRippleDirective } from './directives/ripple';
import { NANO_DIRECTIVES } from './directives/nano';

import { MdGestureConfig, UniqueSelectionDispatcher } from './core';

export { filtersReducer, FiltersState, FilterStyle, OverlayStyle, overlayOptions, presets } from 'angular2-instagram-core';
export { GalleryModel, HammerInstance } from './interfaces';
export { MdGestureConfig, coerceBooleanProperty, applyCssTransform } from './core';

const routes: Routes = [
  { path: '', component: FiltersLandingPageComponent },
  { path: '**', component: FiltersLandingPageComponent }
];

@NgModule({
  imports: [
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    HttpModule,
    ModalModule,
    SharedModule,
    Angular2InstagramCoreModule.forChild()
  ],
  declarations: [
    MdRippleDirective,
    NANO_DIRECTIVES,
    PhotoComponent,
    ImageLoaderComponent,
    GalleryComponent,
    MdSliderComponent,
    MdRadioGroup,
    MdRadioButton,
    SpinnerLoaderComponent,
    FiltersLandingPageComponent,
  ],
  providers: [
    UniqueSelectionDispatcher,
    { provide: HAMMER_GESTURE_CONFIG, useClass: MdGestureConfig },
  ]
})
export class FiltersModule {}
