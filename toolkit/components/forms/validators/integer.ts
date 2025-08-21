export const INTEGER_REGEXP = /^-?\d+$/;

export function integerValidator(value: unknown) {
  if (typeof value !== 'string') {
    return true;
  }

  return INTEGER_REGEXP.test(value) ? true : 'Must be a valid integer';
}
