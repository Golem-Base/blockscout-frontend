import { chakra, Grid, Text, Flex } from '@chakra-ui/react';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';

import type { ArkivExtendEntity, ExtendEntityFormFields } from './utils/types';

import { useArkivClient } from 'lib/arkiv/useArkivClient';
import dayjs from 'lib/date/dayjs';
import { Button } from 'toolkit/chakra/button';
import { FormFieldText } from 'toolkit/components/forms/fields/FormFieldText';
import ContentLoader from 'ui/shared/ContentLoader';

import EntityFormRow from './EntityFormRow';
import ReturnButton from './ReturnButton';
import { mapExtendEntityFormDataToArkivExtend } from './utils/utils';

interface Props {
  onSubmit?: (data: ArkivExtendEntity) => Promise<void>;
  initialExpiresAtTimestamp: string;
}

const submitText = 'Extend Entity';

const FORMAT_DATE_TIME = 'YYYY-MM-DDTHH:mm';

const ExtendEntityForm = ({
  onSubmit,
  initialExpiresAtTimestamp,
}: Props) => {
  const formApi = useForm<ExtendEntityFormFields>({
    mode: 'all',
    defaultValues: {
      expirationDate: dayjs(initialExpiresAtTimestamp).format(FORMAT_DATE_TIME),
    },
  });
  const { handleSubmit, formState, setError, setValue } = formApi;

  const { isConnected, isLoading } = useArkivClient();

  const onFormSubmit: SubmitHandler<ExtendEntityFormFields> = React.useCallback(async(data) => {
    if (!isConnected) {
      setError('root', { message: 'Not connected to Golem Base' });
      return;
    }

    try {
      const mappedData = await mapExtendEntityFormDataToArkivExtend(data);
      await onSubmit?.(mappedData);
    } catch (e) {
      setError('root', { message: `Failed to extend entity` });
    }
  }, [ isConnected, setError, onSubmit ]);

  const handleClampMinDate = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = dayjs(event.target.value);
    const minDate = dayjs(initialExpiresAtTimestamp);

    let valueToSet = event.target.value;

    if (selectedDate.isBefore(minDate)) {
      valueToSet = minDate.format(FORMAT_DATE_TIME);
      event.target.value = valueToSet;
    }

    // Always update react-hook-form with the (possibly clamped) value
    setValue('expirationDate', valueToSet, { shouldValidate: true });
  }, [ initialExpiresAtTimestamp, setValue ]);

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
          <EntityFormRow>
            <FormFieldText
              name="expirationDate"
              label="New expiration date and time"
              inputProps={{
                type: 'datetime-local',
                min: dayjs(initialExpiresAtTimestamp).format(FORMAT_DATE_TIME),
                onChange: handleClampMinDate,
              }}
              placeholder="Select date and time"
            />
            <span>Select new expiration date and time</span>
          </EntityFormRow>
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

export default React.memo(ExtendEntityForm);
