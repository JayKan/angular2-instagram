import { Injectable } from '@angular/core';

// Users of the Dispatcher never need to see this type, but TypeScript requires it to be exported.
export type UniqueSelectionDispatcherListener = (id: string, name: string) => void;

@Injectable()
export class UniqueSelectionDispatcher {
  private _listeners: UniqueSelectionDispatcherListener[] = [];

  /**
   * @description Notify other items that selection for the given name has been set.
   * @name notify
   * @param id {string}
   * @param name {string}
   * @returns {void}
   */
  notify(id: string, name: string): void {
    for (let listener of this._listeners) {
      listener(id, name);
    }
  }

  /**
   * @description Listen for future changes to item selection.
   * @name listen
   * @param listener {UniqueSelectionDispatcherListener}
   * @returns {void}
   */
  listen(listener: UniqueSelectionDispatcherListener): void {
    this._listeners.push(listener);
  }
}