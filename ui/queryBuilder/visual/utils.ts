import { type RuleGroupTypeAny, type RuleType, type ValidationMap } from 'react-querybuilder';

import {
  addressValidator,
  annotationKeyValidator,
  integerValidator,
  OWNER_KEY,
} from 'toolkit/components/forms/validators';

import { getOperatorsForField } from '../shared/operators';

type FieldType = 'owner' | 'string' | 'numeric';

export function parseField(value?: string): [FieldType, string] {
  if (!value) return [ 'string', '' ];
  if (value === OWNER_KEY) {
    return [ 'owner', OWNER_KEY ];
  }
  const [ fieldType ] = value.split(':', 2);
  const fieldName = value.replace(/^(?:string:|numeric:)/, '');

  return [ fieldType as FieldType, fieldName ];
}

export function getOperators(field: string) {
  if (field === OWNER_KEY) {
    return getOperatorsForField('owner');
  }
  if (field.startsWith('numeric:')) {
    return getOperatorsForField('numeric');
  }
  return getOperatorsForField('string');
}

export function validateQuery(query: RuleGroupTypeAny): ValidationMap {
  const validationMap: ValidationMap = {};

  const validateRule = (rule: RuleType) => {
    const { id, field, value } = rule;
    if (!id) return;

    const reasons: Array<string> = [];

    if (field === OWNER_KEY) {
      if (value && addressValidator(value) !== true) {
        reasons.push(addressValidator(value) as string);
      }
      validationMap[id] = { valid: reasons.length === 0, reasons };
      return;
    }

    if (field?.includes(':')) {
      const [ fieldType, fieldName ] = field.split(':', 2);

      if (fieldName && annotationKeyValidator(fieldName) !== true) {
        reasons.push('Invalid key format');
      }

      if (fieldType === 'numeric' && value && integerValidator(value) !== true) {
        reasons.push('Must be a valid integer');
      }
    }

    validationMap[id] = { valid: reasons.length === 0, reasons };
  };

  const traverse = (rules: RuleGroupTypeAny['rules']) => {
    rules.forEach(item => {
      if (typeof item === 'object' && item && 'rules' in item) {
        traverse((item as RuleGroupTypeAny).rules);
      } else {
        validateRule(item as RuleType);
      }
    });
  };

  traverse(query.rules);
  return validationMap;
}
