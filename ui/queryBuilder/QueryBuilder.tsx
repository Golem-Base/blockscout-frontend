import { Box } from '@chakra-ui/react';
import React from 'react';

import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'toolkit/chakra/tabs';

import QueryBuilderInput from './input/QueryBuilderInput';
import QueryBuilderVisual from './visual/QueryBuilderVisual';

interface Props {
  initialValue: string;
  onSubmit: (value: string) => void;
  isLoading?: boolean;
}

const QueryBuilder = ({ initialValue, onSubmit, isLoading }: Props) => {
  const [ currentValue, setCurrentValue ] = React.useState(initialValue);

  React.useEffect(() => {
    setCurrentValue(initialValue);
  }, [ initialValue ]);

  return (
    <Box>
      <TabsRoot defaultValue="visual" variant="segmented" size="sm">
        <TabsList mb={ 1 }>
          <TabsTrigger value="visual">Query Builder</TabsTrigger>
          <TabsTrigger value="input">Text Input</TabsTrigger>
        </TabsList>

        <TabsContent value="visual">
          <QueryBuilderVisual
            value={ currentValue }
            onValueChange={ setCurrentValue }
            onSubmit={ onSubmit }
            isLoading={ isLoading }
          />
        </TabsContent>
        <TabsContent value="input">
          <QueryBuilderInput
            value={ currentValue }
            onValueChange={ setCurrentValue }
            onSubmit={ onSubmit }
            isLoading={ isLoading }
          />
        </TabsContent>
      </TabsRoot>
    </Box>
  );
};

export default React.memo(QueryBuilder);
