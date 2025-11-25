import React from 'react';

import { FormFieldText } from 'toolkit/components/forms/fields/FormFieldText';
import { addressValidator } from 'toolkit/components/forms/validators/address';

import EntityFormRow from '../EntityFormRow';

interface Props {
  required?: boolean;
  hint?: string;
}

const EntityFieldNewOwnerAddress = ({ required = true, hint }: Props) => {
  const rules = React.useMemo(() => ({
    validate: { address: addressValidator },
  }), [ ]);

  return (
    <EntityFormRow>
      <FormFieldText
        name="newOwner"
        placeholder="Enter new owner address"
        required={ required }
        inputProps={{
          type: 'text',
          placeholder: '0x...',
        }}
        rules={ rules }
      />
      { hint ? <span>{ hint }</span> : null }
    </EntityFormRow>
  );
};

export default React.memo(EntityFieldNewOwnerAddress);
