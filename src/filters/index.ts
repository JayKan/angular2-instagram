import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from 'src/shared';

import { ModalModule } from './components/modal';
import { FiltersLandingPageComponent } from './pages/filters-landing-page';

import { FiltersService } from './services/filters-service';
import { FiltersActions } from './services/filters-actions';
import { FiltersEffects } from './services/filters-effects';

import { PhotoComponent } from './components/photo';
import { ImageLoaderComponent } from './components/image-loader';

import { GalleryComponent } from './components/gallery';
import { SlickSliderComponent } from './components/slick-slider';

import { MdSliderComponent } from './components/slider';
import { MdRadioGroup, MdRadioButton } from './components/radio';

import { MdRippleDirective } from './directives/ripple';
import { MdGestureConfig, UniqueSelectionDispatcher } from './core';

import { NANO_DIRECTIVES } from './directives/nano';
export { filtersReducer, FiltersState } from './reducers/filters-reducer';
export { FilterStyle, OverlayStyle, GalleryModel, HammerInstance } from './interfaces';
export { presets, overlayOptions } from './constants';
export { MdGestureConfig, coerceBooleanProperty, applyCssTransform } from './core';

const routes: Routes = [
  { path: '', component: FiltersLandingPageComponent                },
  { path: '**', component: FiltersLandingPageComponent              }
];

@NgModule({
  imports: [
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    EffectsModule.run(FiltersEffects),
    HttpModule,
    ModalModule,
    SharedModule,
  ],
  declarations: [
    MdRippleDirective,
    NANO_DIRECTIVES,
    FiltersLandingPageComponent,
    PhotoComponent,
    ImageLoaderComponent,
    GalleryComponent,
    SlickSliderComponent,
    MdSliderComponent,
    MdRadioGroup,
    MdRadioButton,
  ],
  providers: [
    FiltersService,
    FiltersActions,
    UniqueSelectionDispatcher,
    { provide: HAMMER_GESTURE_CONFIG, useClass: MdGestureConfig },
  ]
})
export class FiltersModule {}
