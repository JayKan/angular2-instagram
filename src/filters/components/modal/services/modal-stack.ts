import { Injectable, Injector, ComponentFactoryResolver } from '@angular/core';
import { ModalRef } from './modal-ref';
import { ModalContainer } from '../directives/modal-container';

@Injectable()
export class ModalStack {
  private modalContainer: ModalContainer;

  open(
    moduleCFR: ComponentFactoryResolver,
    contentInjector: Injector,
    content: any,
    options: Object = {}
  ): ModalRef {
    if (!this.modalContainer) {
      throw new Error(
        'Missing modal container, add <template ModalContainer></template> to one of your application templates.');
    }
    return this.modalContainer.open(moduleCFR, contentInjector, content, options);
  }

  registerContainer(modalContainer: ModalContainer): void {
    this.modalContainer = modalContainer;
  }
}