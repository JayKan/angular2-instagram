import { NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './components/app';
import { AppHeaderComponent } from './components/app-header';

import { SharedModule } from 'src/shared';
import { FiltersModule } from 'src/filters';

import { filtersReducer } from 'src/filters';
export { AppState } from './interfaces';

@NgModule({
  bootstrap: [
    AppComponent
  ],
  declarations: [
    AppComponent,
    AppHeaderComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([], { useHash: false }),
    StoreModule.provideStore({
      filters: filtersReducer,
    }),

    SharedModule,
    FiltersModule,
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
  ]
})
export class AppModule {}