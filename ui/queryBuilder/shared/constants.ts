export const SUPPORTED_OPERATORS = {
  EQUAL: '=',
  NOT_EQUAL: '!=',
  LESS_THAN: '<',
  GREATER_THAN: '>',
} as const;

export type FieldType = 'owner' | 'string' | 'numeric';
export type Operator = typeof SUPPORTED_OPERATORS[keyof typeof SUPPORTED_OPERATORS];

export interface OperatorConfig {
  name: Operator;
  label: string;
  description: string;
  supportedFields: Array<FieldType>;
}

export const OPERATOR_CONFIGS: Array<OperatorConfig> = [
  {
    name: '=',
    label: '=',
    description: 'Equals operator',
    supportedFields: [ 'owner', 'string', 'numeric' ],
  },
  {
    name: '!=',
    label: '!=',
    description: 'Not equal operator',
    supportedFields: [ 'owner', 'string', 'numeric' ],
  },
  {
    name: '<',
    label: '<',
    description: 'Less than operator',
    supportedFields: [ 'numeric' ],
  },
  {
    name: '>',
    label: '>',
    description: 'Greater than operator',
    supportedFields: [ 'numeric' ],
  },
];

export const KEYWORDS = [ '$owner' ];
