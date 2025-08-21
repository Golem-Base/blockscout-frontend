import React from 'react';

import type { EntityFormFields } from '../types';

import { FormFieldText } from 'toolkit/components/forms/fields/FormFieldText';
import { integerValidator } from 'toolkit/components/forms/validators/integer';

import EntityFormRow from '../EntityFormRow';

interface Props {
  required?: boolean;
  hint?: string;
}

const EntityFieldBtl = ({ required = true, hint }: Props) => {
  const rules = React.useMemo(() => ({
    min: {
      value: 1,
      message: 'BTL must be at least 1',
    },
    max: {
      value: Number.MAX_SAFE_INTEGER,
      message: `BTL must be less than or equal to ${ Number.MAX_SAFE_INTEGER }`,
    },
    validate: { integer: integerValidator },
  }), [ ]);

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
