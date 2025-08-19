import React from 'react';
import { useFormContext } from 'react-hook-form';

import type { EntityFormFields } from '../types';

import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'toolkit/chakra/tabs';

import EntityFormRow from '../EntityFormRow';
import EntityFieldFile from './EntityFieldFile';
import EntityFieldText from './EntityFieldText';

interface Props {
  hint?: string;
}

const EntityFieldData = ({ hint }: Props) => {
  const { resetField } = useFormContext<EntityFormFields>();

  const handleTabChange = React.useCallback((details: { value: string }) => {
    resetField(details.value === 'file' ? 'dataText' : 'dataFile');
  }, [ resetField ]);

  return (
    <EntityFormRow>
      <TabsRoot defaultValue="file" variant="segmented" size="sm" onValueChange={ handleTabChange }>
        <TabsList>
          <TabsTrigger value="file">File</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
        </TabsList>

        <TabsContent value="file" pt={ 3 }>
          <EntityFieldFile/>
        </TabsContent>

        <TabsContent value="text" pt={ 3 }>
          <EntityFieldText/>
        </TabsContent>
      </TabsRoot>
      { hint ? <span>{ hint }</span> : null }
    </EntityFormRow>
  );
};

export default React.memo(EntityFieldData);
