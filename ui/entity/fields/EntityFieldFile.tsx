import { Box, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps, FieldPathValue, ValidateResult } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';

import type { EntityFormFields } from '../types';

import { Button } from 'toolkit/chakra/button';
import { FormFieldError } from 'toolkit/components/forms/components/FormFieldError';
import { DragAndDropArea } from 'toolkit/components/forms/inputs/file/DragAndDropArea';
import { FileInput } from 'toolkit/components/forms/inputs/file/FileInput';
import { FileSnippet } from 'toolkit/components/forms/inputs/file/FileSnippet';
import { Kb } from 'toolkit/utils/consts';

import EntityFormRow from '../EntityFormRow';
import { MAX_SIZE } from '../utils';

interface Props {
  required?: boolean;
  title?: string;
}

const EntityFieldFile = ({ required = true, title = 'Entity Data' }: Props) => {
  const { setValue, control, formState, clearErrors } = useFormContext<EntityFormFields>();

  const error = formState.errors.dataFile;
  const commonError = !error?.type?.startsWith('file_') ? error : undefined;
  const fileError = error?.type?.startsWith('file_') ? error : undefined;

  const handleFileChange = React.useCallback((onChange: (files: Array<File>) => void) => async(files: Array<File>) => {
    if (files.length === 0) {
      setValue('dataFile', []);
      clearErrors('dataFile');
      return;
    }

    const file = files[0];
    setValue('dataFile', [ file ]);
    clearErrors('dataFile');
    onChange([ file ]);
  }, [ setValue, clearErrors ]);

  const handleFileRemove = React.useCallback(() => {
    setValue('dataFile', []);
    clearErrors('dataFile');
  }, [ setValue, clearErrors ]);

  const renderControl = React.useCallback(({ field }: { field: ControllerRenderProps<EntityFormFields, 'dataFile'> }) => {
    const fileValue = field.value[0] ?? null;

    const errorElement = (() => {
      if (commonError?.type === 'required') {
        return <FormFieldError message="Field is required"/>;
      }
      if (commonError?.message) {
        return <FormFieldError message={ commonError.message }/>;
      }
      return null;
    })();

    return (
      <>
        <FileInput<EntityFormFields, 'dataFile'> accept="*" multiple={ false } field={ field }>
          { ({ onChange }) => (
            <DragAndDropArea
              onDrop={ handleFileChange(onChange) }
              p={{ base: 3, lg: 6 }}
              isDisabled={ formState.isSubmitting }
              isInvalid={ Boolean(error) }
            >
              { fileValue ? (
                <Box w="100%">
                  <FileSnippet
                    file={ fileValue }
                    maxW="initial"
                    onRemove={ handleFileRemove }
                    isDisabled={ formState.isSubmitting }
                    error={ fileError?.message }
                  />
                </Box>
              ) : (
                <VStack gap={ 3 }>
                  <Text fontWeight={ 500 }>{ title }</Text>
                  <Button size="sm" variant="outline">
                    Drop file or click here
                  </Button>
                  <Text fontSize="sm" color="text.secondary">
                    Maximum file size: { MAX_SIZE / Kb } KB
                  </Text>
                </VStack>
              ) }
            </DragAndDropArea>
          ) }
        </FileInput>
        { errorElement }
      </>
    );
  }, [ commonError?.type, commonError?.message, formState.isSubmitting, error, handleFileChange, handleFileRemove, fileError?.message, title ]);

  const validateFileSize = React.useCallback(async(value: FieldPathValue<EntityFormFields, 'dataFile'>): Promise<ValidateResult> => {
    if (!value || !Array.isArray(value) || value.length === 0) {
      if (required) {
        return 'Data is required';
      }
      return true;
    }

    if (value[0].size > MAX_SIZE) {
      return `Data size must be less than ${ MAX_SIZE / Kb } Kb`;
    }

    return true;
  }, [ required ]);

  const rules = React.useMemo(() => ({
    required,
    validate: {
      file_size: validateFileSize,
    },
  }), [ validateFileSize, required ]);

  return (
    <EntityFormRow>
      <Controller
        name="dataFile"
        control={ control }
        rules={ rules }
        render={ renderControl }
      />
    </EntityFormRow>
  );
};

export default React.memo(EntityFieldFile);
