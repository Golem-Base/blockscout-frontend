import { chakra, Grid, Text, Flex } from '@chakra-ui/react';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';

import type { ArkivChangeEntityOwner, ChangeEntityOwnerFormFields } from './utils/types';

import { useArkivClient } from 'lib/arkiv/useArkivClient';
import { Button } from 'toolkit/chakra/button';
import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';

import EntityFieldNewOwnerAddress from './fields/EntityFieldNewOwnerAddress';
import ReturnButton from './ReturnButton';

interface Props {
  onSubmit?: (data: ArkivChangeEntityOwner) => Promise<void>;
}

const submitText = 'Change Entity Owner';

const ChangeEntityOwnerForm = ({
  onSubmit,
}: Props) => {
  const formApi = useForm<ChangeEntityOwnerFormFields>({
    mode: 'all',
  });
  const { handleSubmit, formState, setError } = formApi;

  const { isConnected, isLoading } = useArkivClient();

  const onFormSubmit: SubmitHandler<ChangeEntityOwnerFormFields> = React.useCallback(async(data) => {
    if (!isConnected) {
      setError('root', { message: 'Not connected to Golem Base' });
      return;
    }

    try {
      await onSubmit?.(data);
    } catch (e) {
      setError('root', { message: `Failed to change entity owner` });
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
          <EntityFieldNewOwnerAddress hint="Enter the new owner address"/>
        </Grid>

        { formState.errors.root?.message && (
          <Text color="text.error" mt={ 4 } fontSize="sm" whiteSpace="pre-wrap">
            { formState.errors.root.message }
          </Text>
        ) }

        <Flex gap={ 4 } mt={ 12 }>
          <Button
            size="lg"
            type="submit"
            loading={ formState.isSubmitting }
            loadingText={ submitText }
          >
            { submitText }
          </Button>
          <ReturnButton
            isEdit
            disabled={ formState.isSubmitting }
          />
        </Flex>
      </chakra.form>
    </FormProvider>
  );
};

export default React.memo(ChangeEntityOwnerForm);
