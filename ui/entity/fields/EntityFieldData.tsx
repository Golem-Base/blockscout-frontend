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
  const [ tab, setTab ] = React.useState<'file' | 'text'>('file');

  const { resetField, getValues } = useFormContext<EntityFormFields>();

  const handleTabChange = React.useCallback((details: { value: string }) => {
    setTab(details.value as 'file' | 'text');
    resetField(details.value === 'file' ? 'dataText' : 'dataFile');
  }, [ resetField, setTab ]);

  React.useEffect(() => {
    const { dataText, dataFile } = getValues();

    if (dataText && dataFile.length === 0) {
      setTab('text');
    }
  }, [ getValues, setTab ]);

  return (
    <EntityFormRow>
      <TabsRoot value={ tab } onValueChange={ handleTabChange } variant="segmented" size="sm">
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
