import { chakra, Grid, Text } from '@chakra-ui/react';
import type { GolemBaseCreate } from 'golem-base-sdk';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';

import type { EntityFormFields } from './utils/types';

import { useGolemBaseClient } from 'lib/golemBase/useGolemBaseClient';
import { Button } from 'toolkit/chakra/button';
import ContentLoader from 'ui/shared/ContentLoader';

import EntityFieldAnnotations from './fields/EntityFieldAnnotations';
import EntityFieldBtl from './fields/EntityFieldBtl';
import EntityFieldData from './fields/EntityFieldData';
import { mapEntityFormDataToGolemCreate } from './utils/utils';

interface Props {
  onSubmit?: (data: GolemBaseCreate) => Promise<void>;
  initialValues?: Partial<EntityFormFields> | null;
  submitText?: string;
  edit?: boolean;
}

const EntityForm = ({
  onSubmit,
  initialValues,
  edit = false,
}: Props) => {
  const formApi = useForm<EntityFormFields>({
    mode: 'all',
    defaultValues: {
      dataText: '',
      dataFile: [],
      btl: '',
      stringAnnotations: [],
      numericAnnotations: [],
      ...initialValues,
    },
  });
  const { handleSubmit, formState, setError } = formApi;

  const { isConnected, isLoading } = useGolemBaseClient();

  const onFormSubmit: SubmitHandler<EntityFormFields> = React.useCallback(async(data) => {
    if (!isConnected) {
      setError('root', { message: 'Not connected to Golem Base' });
      return;
    }

    try {
      const mappedData = await mapEntityFormDataToGolemCreate(data);
      await onSubmit?.(mappedData);
    } catch {
      setError('root', { message: `Failed to ${ edit ? 'update' : 'create' } entity` });
    }
  }, [ isConnected, setError, onSubmit, edit ]);

  const handleFormChange = React.useCallback(() => {
    setError('root', { message: undefined });
  }, [ setError ]);

  if (isLoading) {
    return <ContentLoader/>;
  }

  if (!isConnected) {
    return (
      <Text color="text.error" textAlign="center">
        Not connected to Golem Base
      </Text>
    );
  }

  const submitText = edit ? 'Update entity' : 'Create entity';

  return (
    <FormProvider { ...formApi }>
      <chakra.form
        noValidate
        onSubmit={ handleSubmit(onFormSubmit) }
        onChange={ handleFormChange }
      >
        <Grid
          as="section"
          columnGap="30px"
          rowGap={{ base: 2, lg: 5 }}
          templateColumns={{ base: '1fr', lg: 'minmax(auto, 680px) minmax(0, 340px)' }}
        >
          <EntityFieldData hint="Choose between uploading a file or entering text data for your entity"/>

          <EntityFieldBtl hint="Block to Live - number of blocks until this entity expires"/>

          <EntityFieldAnnotations variant="string" hint="Add string metadata as key-value pairs"/>

          <EntityFieldAnnotations variant="numeric" hint="Add numeric metadata as key-value pairs"/>
        </Grid>

        { formState.errors.root?.message && (
          <Text color="text.error" mt={ 4 } fontSize="sm" whiteSpace="pre-wrap">
            { formState.errors.root.message }
          </Text>
        ) }

        <Button
          size="lg"
          type="submit"
          mt={ 12 }
          loading={ formState.isSubmitting }
          loadingText={ submitText }
        >
          { submitText }
        </Button>
      </chakra.form>
    </FormProvider>
  );
};

export default React.memo(EntityForm);
