export interface FilterStyle {
  WebkitFilter: string;
  filter: string;
  position: string;
}

export interface OverlayStyle {
  content: string;
  display: string;
  height: string;
  width: string;
  top: string;
  left: string;
  pointerEvents: string;
  position: string;
  mixBlendMode?: string;
  opacity: number;
  background: string;
}

export interface GalleryModel {
  key: string;
  figureStyle: FilterStyle;
  overlayStyle: OverlayStyle;
  image: string;
  labelName: string;
}

export interface HammerInstance {
  on(eventName: string, callback: Function): void;
  off(eventName: string, callback: Function): void;
}