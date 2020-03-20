import * as uuid from 'uuid';

export function generateLocalUUID(): string {
  return uuid.v1().toString();
}

export function integerFromJSON(value: any): number {
  const n = numberFromJSON(value);
  if (!Number.isInteger(n)) {
    throw new Error(`Value expected to be an integer`);
  }
  return n;
}

export function isObject(value: any): value is Object {
  return typeof value === 'object' && value !== null;
}

export function isNumber(value: any): value is number {
  return typeof value === 'number';
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function numberFromJSON(value: any): number {
  if (!isNumber(value)) {
    throw new Error('Value must be a number');
  }
  return value;
}

export function padLeft(s: string, pad: string) {
  const length = Math.max(s.length, pad.length);
  return `${pad}${s}`.slice(pad.length + s.length - length);
}

export function stringFromJSON(value: any): string {
  if (!isString(value)) {
    throw new Error('Value must be a string');
  }
  return value;
}
