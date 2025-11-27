import { chakra } from '@chakra-ui/react';
import React from 'react';

interface CustomInputProps {
  value: string;
  onClick: () => void;
  placeholder: string;
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(({ value, onClick, placeholder }, ref) => {
  return (
    <chakra.input
      ref={ ref }
      value={ value }
      onClick={ onClick }
      placeholder={ placeholder }
      readOnly
      cursor="pointer"
      p={ 2 }
      borderWidth="1px"
      borderRadius="md"
    />
  );
});

export default CustomInput;
