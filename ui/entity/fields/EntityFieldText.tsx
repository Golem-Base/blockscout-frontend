import React from 'react';
import type { ValidateResult } from 'react-hook-form';

import type { EntityFormFields } from '../utils/types';

import { FormFieldText } from 'toolkit/components/forms/fields/FormFieldText';
import { Kb } from 'toolkit/utils/consts';

import EntityFormRow from '../EntityFormRow';
import { MAX_SIZE } from '../utils/utils';

interface Props {
  required?: boolean;
}

const EntityFieldText = ({ required = true }: Props) => {
  const validateTextSize = React.useCallback((value: unknown): ValidateResult => {
    if (typeof value !== 'string') {
      return true;
    }

    if (!value || value.length === 0) {
      if (required) {
        return 'Data is required';
      }
      return true;
    }

    const textSize = new TextEncoder().encode(value).length;
    if (textSize > MAX_SIZE) {
      return `Data size must be less than ${ MAX_SIZE / Kb } Kb`;
    }

    return true;
  }, [ required ]);

  const rules = React.useMemo(() => ({
    required,
    validate: {
      text_size: validateTextSize,
    },
  }), [ validateTextSize, required ]);

  return (
    <EntityFormRow>
      <FormFieldText<EntityFormFields>
        name="dataText"
        placeholder="Enter your data here..."
        required={ required }
        asComponent="Textarea"
        size="2xl"
        minH="120px"
        rules={ rules }
      />
    </EntityFormRow>
  );
};

export default React.memo(EntityFieldText);
