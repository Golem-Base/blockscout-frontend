import { Field, Input } from '@chakra-ui/react';
import React from 'react';

import { Skeleton } from 'toolkit/chakra/skeleton';

type Props = {
  id: string;
  placeholder: string;
  loading: boolean;
  error: boolean;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type?: React.HTMLInputTypeAttribute;
};

const AddressOwnedEntitiesInputField = ({ id, placeholder, loading, error, value, onChange, type = 'text' }: Props) => {
  return (
    <Skeleton loading={ loading }>
      <Field.Root invalid={ error }>
        <Input
          id={ id }
          placeholder={ placeholder }
          value={ value }
          onChange={ onChange }
          size="sm"
          type={ type }
        />
      </Field.Root>
    </Skeleton>
  );
};

export default AddressOwnedEntitiesInputField;
