import type { SystemStyleObject } from '@chakra-ui/react';
import { Box, Input } from '@chakra-ui/react';
import { QueryBuilderChakra } from '@react-querybuilder/chakra';
import React from 'react';
import { QueryBuilder, type RuleGroupType, type Field } from 'react-querybuilder';

import FieldSelector from './FieldSelector';

import 'react-querybuilder/dist/query-builder.css';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const initialQuery: RuleGroupType = { combinator: 'and', rules: [] };

const QueryBuilderVisual = ({ value, onChange }: Props) => {
  const [ query, setQuery ] = React.useState<RuleGroupType>(initialQuery);

  const queryBuilderStyles: SystemStyleObject = {
    '& .queryBuilder .chakra-native-select__root': {
      width: 'fit-content',
      display: 'inline-block',
    },
    '& .queryBuilder .chakra-input': {
      width: 'auto',
      display: 'inline-block',
    },
  };

  return (
    <Box css={ queryBuilderStyles }>
      <QueryBuilderChakra>
        <QueryBuilder
          query={ query }
          onQueryChange={ setQuery }
          controlElements={{
            fieldSelector: FieldSelector,
          }}
        />
      </QueryBuilderChakra>
      <code>
        { JSON.stringify(query, null, 2) }
      </code>
    </Box>
  );
};

export default React.memo(QueryBuilderVisual);
