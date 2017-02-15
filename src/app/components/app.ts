import { Component, ViewEncapsulation } from '@angular/core';
import './app.scss';

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  template:`  
  <app-header></app-header>
  <router-outlet></router-outlet> 
  `
})
export class AppComponent {}