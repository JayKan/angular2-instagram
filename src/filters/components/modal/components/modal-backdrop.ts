import { Component, ViewEncapsulation } from '@angular/core';
import './modal-backdrop.scss';

@Component({
  selector: 'modal-backdrop',
  encapsulation: ViewEncapsulation.None,
  template: '',
  host: {
    'class': 'modal-backdrop fade show'
  }
})
export class ModalBackdropComponent {}
