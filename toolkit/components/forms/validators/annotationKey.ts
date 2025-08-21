export const ANNOTATION_KEY_REGEXP = /^[\p{L}_][\p{L}\p{N}_]*$/u;

export function annotationKeyValidator(value: unknown) {
  if (typeof value !== 'string' || value === '') {
    return true;
  }

  return ANNOTATION_KEY_REGEXP.test(value) ? true : 'Must start with a letter or _, followed by letters, numbers, or _';
}
