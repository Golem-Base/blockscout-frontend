import type { SystemStyleObject } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import { QueryBuilderChakra } from '@react-querybuilder/chakra';
import React from 'react';
import { QueryBuilder, type RuleGroupType } from 'react-querybuilder';

import 'react-querybuilder/dist/query-builder.css';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const initialQuery: RuleGroupType = { combinator: 'and', rules: [] };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
          fields={ [
            { name: 'field1', label: 'Field 1' },
            { name: 'field2', label: 'Field 2' },
          ] }
          operators={ [
            { name: '=', label: 'Equals' },
            { name: '!=', label: 'Not Equals' },
          ] }
          combinators={ [
            { name: 'and', label: 'AND' },
            { name: 'or', label: 'OR' },
          ] }
          query={ query }
          onQueryChange={ setQuery }
        />
      </QueryBuilderChakra>
    </Box>
  );
};

export default React.memo(QueryBuilderVisual);
