import { NgModule } from '@angular/core';

import { ModalContainer } from './directives/modal-container';
import { ModalBackdropComponent } from './components/modal-backdrop';
import { ModalWindowComponent } from './components/modal-window';
import { ModalStack } from './services/modal-stack';
import { Modal } from './services/modal';

export { ModalDismissReasons } from './interfaces';

@NgModule({
  declarations:[
    ModalContainer,
    ModalBackdropComponent,
    ModalWindowComponent
  ],
  entryComponents: [
    ModalBackdropComponent,
    ModalWindowComponent
  ],
  providers: [
    Modal,
    ModalStack
  ],
  exports: [
    ModalContainer
  ]
})
export class ModalModule {}

