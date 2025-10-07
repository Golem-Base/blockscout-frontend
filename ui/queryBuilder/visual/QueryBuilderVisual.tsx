import type { SystemStyleObject } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import { QueryBuilderChakra } from '@react-querybuilder/chakra';
import React from 'react';
import { QueryBuilder, type RuleGroupType } from 'react-querybuilder';

import { Button } from 'toolkit/chakra/button';

import ActionButton from './ActionButton';
import { stringToRuleGroup, ruleGroupToString } from './converter';
import FieldSelector from './FieldSelector';
import RemoveAction from './RemoveAction';
import SmartSelector from './SmartSelector';
import { getOperators, validateQuery } from './utils';
import ValueEditor from './ValueEditor';

import 'react-querybuilder/dist/query-builder.css';

interface Props {
  initialValue: string;
  onSubmit: (value: string) => void;
  isLoading?: boolean;
}

const QueryBuilderVisual = ({ initialValue, onSubmit, isLoading }: Props) => {
  const [ query, setQuery ] = React.useState<RuleGroupType>(() => stringToRuleGroup(initialValue));

  const handleSubmit = React.useCallback(() => {
    onSubmit(ruleGroupToString(query));
  }, [ query, onSubmit ]);

  const isValid = React.useMemo(() => {
    return Object.values(validateQuery(query)).every(result =>
      typeof result === 'object' && result.valid,
    );
  }, [ query ]);

  const queryBuilderStyles: SystemStyleObject = {
    '& .queryBuilder .chakra-native-select__root': {
      width: 'fit-content',
      display: 'inline-block',
    },
    '& .queryBuilder .chakra-input': {
      width: 'auto',
      display: 'inline-block',
    },
    '& .queryBuilder-invalid .chakra-input': {
      borderColor: 'red.500',
      boxShadow: '0 0 0 1px red',
    },
    '& .queryBuilder-invalid .chakra-input:focus': {
      borderColor: 'red.500',
      boxShadow: '0 0 0 2px red',
    },
  };

  return (
    <Box css={ queryBuilderStyles }>
      <QueryBuilderChakra>
        <QueryBuilder
          query={ query }
          onQueryChange={ setQuery }
          getOperators={ getOperators }
          validator={ validateQuery }
          resetOnFieldChange={ false }
          controlElements={{
            fieldSelector: FieldSelector,
            valueEditor: ValueEditor,
            removeRuleAction: RemoveAction,
            removeGroupAction: RemoveAction,
            addRuleAction: (props) => <ActionButton { ...props }>+ Rule</ActionButton>,
            addGroupAction: (props) => <ActionButton { ...props }>+ Group</ActionButton>,
            operatorSelector: (props) => <SmartSelector { ...props } placeholder="Operator" name="operator" width="64px"/>,
            combinatorSelector: (props) => <SmartSelector { ...props } placeholder="Combinator" name="combinator"/>,
          }}
        />
      </QueryBuilderChakra>

      <Button
        size="sm"
        onClick={ handleSubmit }
        disabled={ !isValid || !query }
        loading={ isLoading }
        colorScheme="blue"
        mt={ 4 }
        ml="auto"
      >
        Run Query
      </Button>
    </Box>
  );
};

export default React.memo(QueryBuilderVisual);
