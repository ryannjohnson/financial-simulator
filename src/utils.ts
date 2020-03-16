export function isObject(value: any): value is Object {
  return typeof value === 'object' && value !== null;
}

export function isNumber(value: any): value is number {
  return typeof value === 'number';
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function padLeft(s: string, pad: string) {
  const length = Math.max(s.length, pad.length);
  return `${pad}${s}`.slice(pad.length + s.length - length);
}
