/**
 * Represent options available when opening new modal windows.
 */
export interface ModalOptions {
  backdrop?: boolean | 'static';
  keyboard?: boolean;
  size?: 'sm' | 'lg';
  windowClass?: string;
}

export enum ModalDismissReasons {
  BACKDROP_CLICK,
  ESC
}
