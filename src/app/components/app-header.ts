import { Component, ViewEncapsulation } from '@angular/core';
import './app-header.scss';

@Component({
  selector: 'app-header',
  encapsulation: ViewEncapsulation.None,
  template:`
  <header class="header">
    <div class="header-gradient"></div>
    <div class="container">     
      <a href="https://github.com/JayKan/angular2-instagram" target="_blank">
        <span class="header-github">
          <i class="fa fa-github" aria-hidden="true"></i>
        </span>        
      </a>     
    </div>
  </header>
  `
})
export class AppHeaderComponent {}