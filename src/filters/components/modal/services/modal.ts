import { Injectable, Injector, ComponentFactoryResolver } from '@angular/core';
import { ModalStack } from './modal-stack';
import { ModalRef } from './modal-ref';
import { ModalOptions } from '../interfaces';

@Injectable()
export class Modal {
  constructor(
    private _moduleCFR: ComponentFactoryResolver,
    private _injector: Injector,
    private _modalStack: ModalStack) {}

  open(content: any, options: ModalOptions = {}): ModalRef {
    return this._modalStack.open(this._moduleCFR, this._injector, content, options);
  }
}