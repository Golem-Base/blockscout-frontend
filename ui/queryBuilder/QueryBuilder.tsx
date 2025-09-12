import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import { Button } from 'toolkit/chakra/button';
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'toolkit/chakra/tabs';

import QueryBuilderInput from './QueryBuilderInput';
import QueryBuilderVisual from './QueryBuilderVisual';

interface Props {
  defaultValue: string;
  onSubmit: (value: string) => void;
}

const QueryBuilder = ({ defaultValue, onSubmit }: Props) => {
  const [ queryValue, setQueryValue ] = React.useState<string>(defaultValue);

  const handleSubmit = React.useCallback(() => {
    onSubmit(queryValue);
  }, [ queryValue, onSubmit ]);

  return (
    <Box>
      <TabsRoot defaultValue="input" variant="segmented" size="sm">
        <Flex justify="space-between" align="center" mb={ 4 }>
          <TabsList>
            <TabsTrigger value="input">Text Input</TabsTrigger>
            <TabsTrigger value="visual">Query Builder</TabsTrigger>
          </TabsList>

          <Button
            colorScheme="blue"
            size="sm"
            onClick={ handleSubmit }
          >
            Submit Query
          </Button>
        </Flex>

        <TabsContent value="visual">
          <QueryBuilderVisual
            value={ queryValue }
            onChange={ setQueryValue }
          />
        </TabsContent>
        <TabsContent value="input">
          <QueryBuilderInput
            value={ queryValue }
            onChange={ setQueryValue }
          />
        </TabsContent>
      </TabsRoot>
    </Box>
  );
};

export default React.memo(QueryBuilder);
