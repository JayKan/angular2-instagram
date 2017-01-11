import { ViewRef, ComponentRef } from '@angular/core';

export class ContentRef {
  constructor(public nodes: any[], public viewRef?: ViewRef, public componentRef?: ComponentRef<any>) {}
}

export function isDefined(value: any): boolean {
  return value !== undefined && value !== null;
}

export function isString(value: any): boolean {
  return typeof value === 'string';
}