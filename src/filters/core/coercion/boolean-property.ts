/**
 * @description Coerces a data-bound value (typically a string) to a boolean.
 * @name coerceBooleanProperty
 * @param value {any}
 * @returns {boolean}
 */
export function coerceBooleanProperty(value: any): boolean {
  return value !== null && `${value}` !== 'false';
}