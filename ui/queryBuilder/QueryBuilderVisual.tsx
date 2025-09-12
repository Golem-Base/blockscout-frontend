import type { SystemStyleObject } from '@chakra-ui/react';
import { Box, HStack, Input, Select, Text } from '@chakra-ui/react';
import { QueryBuilderChakra } from '@react-querybuilder/chakra';
import React from 'react';
import { QueryBuilder, type RuleGroupType, type ValueEditorProps } from 'react-querybuilder';

import 'react-querybuilder/dist/query-builder.css';

import { QUERY_FIELDS, QUERY_OPERATORS, QUERY_COMBINATORS, VALIDATION_PATTERNS, type AnnotationField } from './constants';
import { parseTextToVisual, convertQueryToString } from './utils';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const initialQuery: RuleGroupType = { combinator: 'and', rules: [] };

// Custom value editor for annotation fields
const AnnotationValueEditor = ({ value, handleOnChange, field }: ValueEditorProps) => {
  const fieldConfig = QUERY_FIELDS.find(f => f.name === field);
  const isAnnotation = fieldConfig?.inputType === 'annotation';
  
  if (!isAnnotation) {
    // For non-annotation fields, use default input
    return (
      <Input
        value={ value || '' }
        onChange={ (e) => handleOnChange(e.target.value) }
        placeholder={ field === '$owner' ? '0x1234...' : 'Enter value' }
        size="sm"
      />
    );
  }

  // Parse annotation value (format: "key=value" or "key~pattern")
  const parseAnnotationValue = (val: string): AnnotationField => {
    if (!val) return { key: '', value: '', dataType: fieldConfig?.dataType || 'string' };
    
    // Try different patterns
    const patterns = [
      /^(.+?)=(.+)$/,     // key=value
      /^(.+?)~(.+)$/,     // key~pattern  
      /^(.+?)!=(.+)$/,    // key!=value
      /^(.+?)!~(.+)$/,    // key!~pattern
      /^(.+?)(>=|<=|>|<)(.+)$/,  // key>=value, etc.
    ];
    
    for (const pattern of patterns) {
      const match = val.match(pattern);
      if (match) {
        return { 
          key: match[1] || '', 
          value: match[match.length - 1] || '', 
          dataType: fieldConfig?.dataType || 'string' 
        };
      }
    }
    
    return { key: val, value: '', dataType: fieldConfig?.dataType || 'string' };
  };

  const serializeAnnotationValue = (annotation: AnnotationField): string => {
    if (!annotation.key) return '';
    if (!annotation.value) return annotation.key;
    return `${ annotation.key }=${ annotation.value }`;
  };

  const annotation = parseAnnotationValue(value || '');
  
  const handleKeyChange = (newKey: string) => {
    const newAnnotation = { ...annotation, key: newKey };
    handleOnChange(serializeAnnotationValue(newAnnotation));
  };

  const handleValueChange = (newValue: string) => {
    const newAnnotation = { ...annotation, value: newValue };
    handleOnChange(serializeAnnotationValue(newAnnotation));
  };

  const isValidKey = !annotation.key || VALIDATION_PATTERNS.ANNOTATION_KEY.test(annotation.key);

  return (
    <HStack gap={ 2 } align="center">
      <Text fontSize="sm" color="gray.600" minW="30px">Key:</Text>
      <Input
        value={ annotation.key }
        onChange={ (e) => handleKeyChange(e.target.value) }
        placeholder="annotation_key"
        size="sm"
        minW="120px"
        _invalid={{ borderColor: 'red.500' }}
        aria-invalid={ !isValidKey }
      />
      <Text fontSize="sm" color="gray.600" minW="40px">Value:</Text>
      <Input
        value={ annotation.value }
        onChange={ (e) => handleValueChange(e.target.value) }
        placeholder={ fieldConfig?.dataType === 'numeric' ? '123' : 'annotation value' }
        type={ fieldConfig?.dataType === 'numeric' ? 'number' : 'text' }
        size="sm"
        minW="120px"
      />
    </HStack>
  );
};

const QueryBuilderVisual = ({ value, onChange }: Props) => {
  const [ query, setQuery ] = React.useState<RuleGroupType>(initialQuery);

  // Parse text query to visual on mount and when value changes
  React.useEffect(() => {
    if (value && value !== convertQueryToString(query)) {
      const parsedQuery = parseTextToVisual(value);
      setQuery(parsedQuery);
    }
  }, [ value ]);

  // Convert visual query to text when query changes
  const handleQueryChange = React.useCallback((newQuery: RuleGroupType) => {
    setQuery(newQuery);
    const queryString = convertQueryToString(newQuery);
    onChange(queryString);
  }, [ onChange ]);

  const queryBuilderStyles: SystemStyleObject = {
    '& .queryBuilder .chakra-native-select__root': {
      width: 'fit-content',
      display: 'inline-block',
    },
    '& .queryBuilder .chakra-input': {
      width: 'auto',
      display: 'inline-block',
    },
    '& .queryBuilder .ruleGroup': {
      border: '1px solid',
      borderColor: 'gray.200',
      borderRadius: 'md',
      padding: 4,
    },
    '& .queryBuilder .rule': {
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      marginBottom: 2,
    },
  };

  return (
    <Box css={ queryBuilderStyles }>
      <QueryBuilderChakra>
        <QueryBuilder
          fields={ QUERY_FIELDS }
          operators={ QUERY_OPERATORS }
          combinators={ QUERY_COMBINATORS }
          query={ query }
          onQueryChange={ handleQueryChange }
          controlElements={{
            valueEditor: AnnotationValueEditor,
          }}
          getOperators={ (field) => {
            const fieldConfig = QUERY_FIELDS.find(f => f.name === field);
            if (fieldConfig?.operators) {
              return QUERY_OPERATORS.filter(op => fieldConfig.operators.includes(op.name));
            }
            return QUERY_OPERATORS;
          } }
        />
      </QueryBuilderChakra>
    </Box>
  );
};

export default React.memo(QueryBuilderVisual);
