import { Box } from '@chakra-ui/react';
import React from 'react';

import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'toolkit/chakra/tabs';

// import QueryBuilderInput from './QueryBuilderInput';
import QueryBuilderVisual from './visual/QueryBuilderVisual';

interface Props {
  initialValue: string;
  onSubmit: (value: string) => void;
  isLoading?: boolean;
}

const QueryBuilder = (props: Props) => {
  return (
    <Box>
      <TabsRoot defaultValue="visual" variant="segmented" size="sm">
        <TabsList mb={ 4 }>
          <TabsTrigger value="visual">Query Builder</TabsTrigger>
          <TabsTrigger value="input">Text Input</TabsTrigger>
        </TabsList>

        <TabsContent value="visual">
          <QueryBuilderVisual { ...props }
          />
        </TabsContent>
        <TabsContent value="input">
          { /* <QueryBuilderInput
            value={ queryValue }
            onChange={ setQueryValue }
          /> */ }
        </TabsContent>
      </TabsRoot>
    </Box>
  );
};

export default React.memo(QueryBuilder);
