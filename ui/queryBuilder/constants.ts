export const QUERY_FIELDS = [
  {
    name: '$owner',
    label: 'Owner Address',
    type: 'text' as const,
    inputType: 'owner' as const,
    operators: [ '=', '!=' ],
  },
  {
    name: 'string_annotation',
    label: 'String Annotation',
    type: 'text' as const,
    inputType: 'annotation' as const,
    dataType: 'string' as const,
    operators: [ '=', '!=', '~', '!~', '<', '<=', '>', '>=' ],
  },
  {
    name: 'numeric_annotation',
    label: 'Numeric Annotation',
    type: 'number' as const,
    inputType: 'annotation' as const,
    dataType: 'numeric' as const,
    operators: [ '=', '!=', '<', '<=', '>', '>=' ],
  },
];

export type AnnotationDataType = 'string' | 'numeric';

export interface AnnotationField {
  key: string;
  value: string;
  dataType: AnnotationDataType;
}

export const QUERY_OPERATORS = [
  { name: '=', label: 'Equals' },
  { name: '!=', label: 'Not Equals' },
  { name: '>', label: 'Greater Than' },
  { name: '>=', label: 'Greater Than or Equal' },
  { name: '<', label: 'Less Than' },
  { name: '<=', label: 'Less Than or Equal' },
  { name: '~', label: 'Contains' },
  { name: '!~', label: 'Does Not Contain' },
];

export const QUERY_COMBINATORS = [
  { name: 'and', label: 'AND' },
  { name: 'or', label: 'OR' },
];

export const OPERATOR_MAP: Record<string, string> = {
  '=': '=',
  '!=': '!=',
  '>': '>',
  '>=': '>=',
  '<': '<',
  '<=': '<=',
  '~': '~',
  '!~': '!~',
};

export const COMBINATOR_MAP: Record<string, string> = {
  and: '&&',
  or: '||',
};

export const KEYWORDS = [ '$owner' ];

export const MONACO_OPERATORS = [
  '=', '!=', '>=', '<=', '>', '<', '~', '!~', '&&', '||', '!',
];

export const VALIDATION_PATTERNS = {
  OWNER_ADDRESS: /^0x[a-fA-F0-9]{40}$/,
  // Based on entity.AnnotationIdentRegex from Go code - supports Unicode letters, numbers, and underscore
  ANNOTATION_KEY: /^[\p{L}_][\p{L}\p{N}_]*$/u,
  STRING_KEY: /^[a-z_]\w*$/i,
  NUMERIC_KEY: /^[a-z_]\w*$/i,
} as const;
