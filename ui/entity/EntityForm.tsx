import { chakra, Grid, Text, Flex } from '@chakra-ui/react';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';

import type { ArkivEntityData, EntityFormFields } from './utils/types';

import { useArkivClient } from 'lib/arkiv/useArkivClient';
import dayjs from 'lib/date/dayjs';
import { Button } from 'toolkit/chakra/button';
import { FormFieldText } from 'toolkit/components/forms/fields/FormFieldText';
import ContentLoader from 'ui/shared/ContentLoader';

import EntityFormRow from './EntityFormRow';
import EntityFieldAnnotations from './fields/EntityFieldAnnotations';
import EntityFieldData from './fields/EntityFieldData';
import ReturnButton from './ReturnButton';
import { FORMAT_DATE_TIME, mapEntityFormDataToArkivCreate } from './utils/utils';

interface Props {
  onSubmit?: (data: ArkivEntityData) => Promise<void>;
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
      stringAnnotations: [],
      numericAnnotations: [],
      ...initialValues,
    },
  });
  const { handleSubmit, formState, setError, setValue } = formApi;

  const { isConnected, isLoading } = useArkivClient();

  const onFormSubmit: SubmitHandler<EntityFormFields> = React.useCallback(async(data) => {
    if (!isConnected) {
      setError('root', { message: 'Not connected to Golem Base' });
      return;
    }

    const expirationDate = dayjs(data.expirationDate);
    const now = dayjs();

    if (!expirationDate.isAfter(now)) {
      setError('root', { message: 'Expiration date must be in the future' });
      return;
    }

    try {
      const mappedData = await mapEntityFormDataToArkivCreate(data);

      await onSubmit?.(mappedData);
    } catch (e) {
      // eslint-disable-next-line
      console.error('EntityForm:', {
        error: e,
        action: edit ? 'update' : 'create',
      });

      setError('root', { message: `Failed to ${ edit ? 'update' : 'create' } entity` });
    }
  }, [ isConnected, setError, onSubmit, edit ]);

  const handleFormChange = React.useCallback(() => {
    setError('root', { message: undefined });
  }, [ setError ]);

  const handleClampMinDate = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = dayjs(event.target.value);
    const minDate = dayjs();

    let valueToSet = event.target.value;

    if (selectedDate.isBefore(minDate)) {
      valueToSet = minDate.format(FORMAT_DATE_TIME);
      event.target.value = valueToSet;
    }

    setValue('expirationDate', valueToSet, { shouldValidate: true });
  }, [ setValue ]);

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
          <EntityFormRow>
            <FormFieldText
              name="expirationDate"
              label="Entity expiration date"
              inputProps={{
                type: 'datetime-local',
                onChange: handleClampMinDate,
                min: dayjs().format(FORMAT_DATE_TIME),
              }}
              placeholder="Select date and time"
            />
            <span>Select expiration date and time</span>
          </EntityFormRow>

          <EntityFieldAnnotations variant="string" hint="Add string metadata as key-value pairs"/>

          <EntityFieldAnnotations variant="numeric" hint="Add numeric metadata as key-value pairs"/>
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
            isEdit={ edit }
            disabled={ formState.isSubmitting }
          />
        </Flex>
      </chakra.form>
    </FormProvider>
  );
};

export default React.memo(EntityForm);
