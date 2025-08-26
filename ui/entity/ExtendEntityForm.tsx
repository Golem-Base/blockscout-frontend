import { chakra, Grid, Text } from '@chakra-ui/react';
import type { GolemBaseExtend } from 'golem-base-sdk';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';

import type { ExtendEntityFormFields } from './types';

import { useGolemBaseClient } from 'lib/golemBase/useGolemBaseClient';
import { Button } from 'toolkit/chakra/button';
import ContentLoader from 'ui/shared/ContentLoader';

import EntityFieldBtl from './fields/EntityFieldBtl';
import { mapExtendEntityFormDataToGolemExtend } from './utils';

interface Props {
  onSubmit?: (data: Omit<GolemBaseExtend, 'entityKey'>) => Promise<void>;
}

const submitText = 'Extend Entity';

const ExtendEntityForm = ({
  onSubmit,
}: Props) => {
  const formApi = useForm<ExtendEntityFormFields>({
    mode: 'all',
  });
  const { handleSubmit, formState, setError } = formApi;

  const { isConnected, isLoading } = useGolemBaseClient();

  const onFormSubmit: SubmitHandler<ExtendEntityFormFields> = React.useCallback(async(data) => {
    if (!isConnected) {
      setError('root', { message: 'Not connected to Golem Base' });
      return;
    }

    try {
      const mappedData = await mapExtendEntityFormDataToGolemExtend(data);
      await onSubmit?.(mappedData);
    } catch (e) {
      setError('root', { message: `Failed to extend entity` });
    }
  }, [ isConnected, setError, onSubmit ]);

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
          <EntityFieldBtl hint="Number of Blocks to add to current expiration"/>
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

export default React.memo(ExtendEntityForm);
