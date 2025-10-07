import { addressValidator, annotationKeyValidator, OWNER_KEY } from 'toolkit/components/forms/validators';

export interface ValidationResult {
  isValid: boolean;
  errors: Array<string>;
}

export const validateQuery = (query: string): ValidationResult => {
  const errors: Array<string> = [];

  if (!query.trim()) {
    return { isValid: true, errors: [] };
  }

  // eslint-disable-next-line regexp/no-unused-capturing-group
  const ownerMatches = [ ...query.matchAll(/\$owner\s*(=|!=)\s*"([^"]+)"/g) ];
  for (const match of ownerMatches) {
    const address = match[2];
    const result = addressValidator(address);
    if (result !== true) {
      errors.push(result);
    }
  }

  const annotationMatches = [
    ...query.matchAll(/([\p{L}_][\p{L}\p{N}_]*)\s*!?[=<>]=?\s*"[^"]+"/gu),
    ...query.matchAll(/([\p{L}_][\p{L}\p{N}_]*)\s*!?[=<>]=?\s*\d+(?:\.\d+)?/gu),
  ];

  for (const match of annotationMatches) {
    const key = match[1];
    if (key.startsWith('$')) continue;

    const result = annotationKeyValidator(key);
    if (result !== true) {
      errors.push(result);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export { OWNER_KEY };
