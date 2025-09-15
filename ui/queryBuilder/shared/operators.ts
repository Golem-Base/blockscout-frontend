import type { FieldType, Operator } from './constants';
import { OPERATOR_CONFIGS } from './constants';

export function getOperatorsForField(fieldType: FieldType): Array<{ name: Operator; label: string }> {
  return OPERATOR_CONFIGS
    .filter(config => config.supportedFields.includes(fieldType))
    .map(config => ({ name: config.name, label: config.label }));
}

export function getOperatorDescription(operator: Operator): string {
  const config = OPERATOR_CONFIGS.find(c => c.name === operator);
  return config?.description || `${ operator } operator`;
}
