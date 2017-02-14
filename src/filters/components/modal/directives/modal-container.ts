import {
  Directive,
  Injector,
  ReflectiveInjector,
  Renderer,
  TemplateRef,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentFactory,
  ComponentRef
} from '@angular/core';

import { isDefined, isString, ContentRef } from '../utils';

import { ModalBackdropComponent } from '../components/modal-backdrop';
import { ModalWindowComponent } from '../components/modal-window';
import { ModalStack } from '../services/modal-stack';
import { ActiveModal, ModalRef } from '../services/modal-ref';

@Directive({ selector: 'template[ModalContainer], div[ModalContainer]' })
export class ModalContainer {
  private _backdropFactory: ComponentFactory<ModalBackdropComponent>;
  private _windowFactory: ComponentFactory<ModalWindowComponent>;

  constructor(
    private _injector: Injector,
    private _renderer: Renderer,
    private _viewContainerRef: ViewContainerRef,
    private _componentFactoryResolver: ComponentFactoryResolver,
    ngbModalStack: ModalStack
  ) {
    this._backdropFactory = _componentFactoryResolver.resolveComponentFactory(ModalBackdropComponent);
    this._windowFactory = _componentFactoryResolver.resolveComponentFactory(ModalWindowComponent);
    ngbModalStack.registerContainer(this);
  }

  open(
    moduleCFR: ComponentFactoryResolver,
    contentInjector: Injector,
    content: string | TemplateRef<any>,
    options: any
  ): ModalRef {
    const activeModal = new ActiveModal();
    const contentRef = this._getContentRef(moduleCFR, contentInjector, content, activeModal);
    let windowCmptRef: ComponentRef<ModalWindowComponent>;
    let backdropCmptRef: ComponentRef<ModalBackdropComponent>;
    let ngbModalRef: ModalRef;

    if (options.backdrop !== false) {
      backdropCmptRef = this._viewContainerRef.createComponent(this._backdropFactory, 0, this._injector);
    }

    windowCmptRef = this._viewContainerRef.createComponent(
      this._windowFactory, this._viewContainerRef.length - 1, this._injector, contentRef.nodes);

    ngbModalRef = new ModalRef(this._viewContainerRef, windowCmptRef, contentRef, backdropCmptRef);

    activeModal.close = (result: any) => { ngbModalRef.close(result); };
    activeModal.dismiss = (reason: any) => { ngbModalRef.dismiss(reason); };

    this._applyWindowOptions(windowCmptRef.instance, options);

    return ngbModalRef;
  }

  private _applyWindowOptions(windowInstance: ModalWindowComponent, options: Object): void {
    ['backdrop', 'keyboard', 'size', 'windowClass'].forEach((optionName: string) => {
      if (isDefined(options[optionName])) {
        windowInstance[optionName] = options[optionName];
      }
    });
  }

  private _getContentRef(
    moduleCFR: ComponentFactoryResolver,
    contentInjector: Injector,
    content: any,
    context: ActiveModal
  ): ContentRef {
    if (!content) {
      return new ContentRef([]);
    } else if (content instanceof TemplateRef) {
      const viewRef = this._viewContainerRef.createEmbeddedView(<TemplateRef<ActiveModal>>content, context);
      return new ContentRef([viewRef.rootNodes], viewRef);
    } else if (isString(content)) {
      return new ContentRef([[this._renderer.createText(null, `${content}`)]]);
    } else {
      const contentCmptFactory = moduleCFR.resolveComponentFactory(content);
      const modalContentInjector =
        ReflectiveInjector.resolveAndCreate([{provide: ActiveModal, useValue: context}], contentInjector);
      const componentRef = this._viewContainerRef.createComponent(contentCmptFactory, 0, modalContentInjector);
      return new ContentRef([[componentRef.location.nativeElement]], componentRef.hostView, componentRef);
    }
  }
}
