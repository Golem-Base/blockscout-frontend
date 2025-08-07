import React from 'react';

import type { EntityFormFields } from '../types';

import { FormFieldText } from 'toolkit/components/forms/fields/FormFieldText';

import EntityFormRow from '../EntityFormRow';

interface Props {
  required?: boolean;
  hint?: string;
}

const EntityFieldBtl = ({ required = true, hint }: Props) => {
  const rules = React.useMemo(() => ({
    required,
    min: {
      value: 1,
      message: 'BTL must be at least 1',
    },
  }), [ required ]);

  return (
    <EntityFormRow>
      <FormFieldText<EntityFormFields>
        name="btl"
        placeholder="Enter BTL value (e.g., 1000)"
        required={ required }
        inputProps={{
          type: 'number',
          min: 1,
        }}
        rules={ rules }
      />
      { hint ? <span>{ hint }</span> : null }
    </EntityFormRow>
  );
};

export default React.memo(EntityFieldBtl);
