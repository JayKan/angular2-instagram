import { Injectable, ComponentRef, ViewContainerRef } from '@angular/core';

import { ModalBackdropComponent } from '../components/modal-backdrop';
import { ModalWindowComponent } from '../components/modal-window';

import { ContentRef } from '../utils';

/**
 * A reference to an active (currently opened) modal. Instances of this class
 * can be injected into components passed as modal content.
 */
@Injectable()
export class ActiveModal {
  /**
   * Can be used to close a modal, passing an optional result.
   */
  close(result?: any): void {}

  /**
   * Can be used to dismiss a modal, passing an optional reason.
   */
  dismiss(reason?: any): void {}
}

/**
 * A reference to a newly opened modal.
 */
@Injectable()
export class ModalRef {
  private _resolve: (result?: any) => void;
  private _reject: (reason?: any) => void;

  result: Promise<any>;

  get componentInstance(): any {
    if (this._contentRef.componentRef) {
      return this._contentRef.componentRef.instance;
    }
  }
  // only needed to keep TS1.8 compatibility
  set componentInstance(instance: any) {}

  constructor(
    private _viewContainerRef: ViewContainerRef,
    private _windowCmptRef: ComponentRef<ModalWindowComponent>,
    private _contentRef: ContentRef,
    private _backdropCmptRef?: ComponentRef<ModalBackdropComponent>
  ) {
    _windowCmptRef.instance.dismissEvent.subscribe((reason: any) => { this.dismiss(reason); });

    this.result = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });

    this.result.then(null, () => {});
  }

  close(result?: any): void {
    if (this._windowCmptRef) {
      this._resolve(result);
      this._removeModalElements();
    }
  }

  dismiss(reason?: any): void {
    if (this._windowCmptRef) {
      this._reject(reason);
      this._removeModalElements();
    }
  }

  private _removeModalElements(): void {
    this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._windowCmptRef.hostView));
    if (this._backdropCmptRef) {
      this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._backdropCmptRef.hostView));
    }
    if (this._contentRef && this._contentRef.viewRef) {
      this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._contentRef.viewRef));
    }

    this._windowCmptRef = null;
    this._backdropCmptRef = null;
    this._contentRef = null;
  }
}

