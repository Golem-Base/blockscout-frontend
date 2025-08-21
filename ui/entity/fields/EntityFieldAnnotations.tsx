import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';

import type { EntityFormFields } from '../types';

import { Button } from 'toolkit/chakra/button';
import { IconButton } from 'toolkit/chakra/icon-button';
import { FormFieldText } from 'toolkit/components/forms/fields/FormFieldText';
import { integerValidator } from 'toolkit/components/forms/validators/integer';
import IconSvg from 'ui/shared/IconSvg';

import EntityFormRow from '../EntityFormRow';
import { generateAnnotationId } from '../utils';

type AnnotationVariant = 'string' | 'numeric';

interface Props {
  variant: AnnotationVariant;
  hint?: string;
}

const EntityFieldAnnotations = ({ variant, hint }: Props) => {
  const { control, setValue, getValues, formState } = useFormContext<EntityFormFields>();

  const fieldName = variant === 'string' ? 'stringAnnotations' : 'numericAnnotations';
  const displayTitle = variant === 'string' ? 'String Annotations' : 'Numeric Annotations';

  const handleAddAnnotation = React.useCallback(() => {
    const currentAnnotations = getValues(fieldName);
    setValue(fieldName, [ ...currentAnnotations, { id: generateAnnotationId(), key: '', value: '' } ]);
  }, [ getValues, setValue, fieldName ]);

  const handleRemoveAnnotation = React.useCallback((index: number) => () => {
    const filteredAnnotations = getValues(fieldName).filter((_, i) => i !== index);
    setValue(fieldName, filteredAnnotations);
  }, [ getValues, setValue, fieldName ]);

  const valueInputProps = React.useMemo(() => variant === 'numeric' ? {
    inputProps: { type: 'number' },
    rules: {
      min: {
        value: 0,
        message: 'Must be at least 0',
      },
      max: {
        value: Number.MAX_SAFE_INTEGER,
        message: `Must be less than or equal to ${ Number.MAX_SAFE_INTEGER }`,
      },
      validate: { integer: integerValidator },
    },
  } : {}, [ variant ]);

  const renderControl = React.useCallback(({ field }: { field: ControllerRenderProps<EntityFormFields, typeof fieldName> }) => (
    <VStack gap={ 4 } alignItems="stretch" w="100%">
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontWeight={ 600 } fontSize="sm" color="text.primary">{ displayTitle }</Text>
        <Button size="sm" variant="outline" onClick={ handleAddAnnotation }
          disabled={ formState.isSubmitting }
        ><IconSvg name="plus" boxSize={ 3 }/>
          Add
        </Button>
      </Flex>

      { field.value.map((annotation, index) => (
        <Box
          key={ annotation.id }
          p={ 4 }
          borderWidth="1px"
          borderRadius="lg"
          borderColor={{ _light: 'gray.200', _dark: 'gray.600' }}
          bgColor={{ _light: 'white', _dark: 'gray.800' }}
          boxShadow="sm"
          _hover={{
            boxShadow: 'md',
            borderColor: { _light: 'gray.300', _dark: 'gray.500' },
          }}
          transition="all 0.2s ease-in-out"
          position="relative"
        >
          <Flex gap={ 3 } alignItems="flex-start">
            <Box flex={ 1 }>
              <FormFieldText<EntityFormFields>
                name={ `${ fieldName }.${ index }.key` }
                placeholder={ `Annotation key (e.g., ${ variant === 'string' ? 'category' : 'priority' })` }
                size="md"
                mb={ 3 }
                required
              />
              <FormFieldText<EntityFormFields>
                name={ `${ fieldName }.${ index }.value` }
                placeholder={ `Annotation value (e.g., ${ variant === 'string' ? 'important' : '1' })` }
                size="md"
                required
                { ...valueInputProps }
              />
            </Box>
            <IconButton
              size="2xs"
              variant="ghost"
              colorPalette="red"
              onClick={ handleRemoveAnnotation(index) }
              disabled={ formState.isSubmitting }
              aria-label="Remove annotation"
              _hover={{
                bgColor: { _light: 'red.50', _dark: 'red.900' },
              }}
            >
              <IconSvg name="delete"/>
            </IconButton>
          </Flex>
        </Box>
      )) }

      { field.value.length === 0 && (
        <Box
          p={ 6 }
          borderWidth="1px"
          borderStyle="dashed"
          borderRadius="lg"
          borderColor={{ _light: 'gray.200', _dark: 'gray.600' }}
          bgColor={{ _light: 'gray.50', _dark: 'gray.800' }}
          textAlign="center"
        >
          <Text color="text.secondary" fontSize="sm">
            No { variant } annotations added
          </Text>
        </Box>
      ) }
    </VStack>
  ), [ displayTitle, handleAddAnnotation, handleRemoveAnnotation, formState.isSubmitting, fieldName, variant, valueInputProps ]);

  return (
    <EntityFormRow>
      <Controller name={ fieldName } control={ control } render={ renderControl }/>
      { hint ? <span>{ hint }</span> : null }
    </EntityFormRow>
  );
};

export default React.memo(EntityFieldAnnotations);
