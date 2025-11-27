import { chakra } from '@chakra-ui/react';
import React from 'react';
import type { DatePickerProps as ReactDatePickerProps } from 'react-datepicker';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface CustomInputProps {
  value: string;
  onClick: () => void;
  placeholder: string;
}

interface DatePickerProps {
  name: ReactDatePickerProps['name'];
  value: Date;
  onChange?: (date: Date | null, event?: React.SyntheticEvent<HTMLElement> | undefined) => void;
  label: string;
  helper?: string;
  showTimeSelect?: boolean;
  timeIntervals?: number;
  dateFormat?: ReactDatePickerProps['dateFormat'];
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
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

const DatePicker = ({
  value,
  onChange,
  label = 'Date and time',
  name = 'datetime',
  helper,
  showTimeSelect = true,
  timeIntervals = 5,
  dateFormat = 'dd.MM.yyyy | HH:mm',
  minDate,
  maxDate,
  placeholder = 'Select date and time',
}: DatePickerProps) => {
  const handleInputClick = React.useCallback(() => {}, []);

  return (
    <chakra.div mb={ 4 }>
      <chakra.label htmlFor={ name } display="block" mb={ 1 } fontWeight="medium">
        { label }
      </chakra.label>

      <ReactDatePicker
        id={ name }
        selected={ value }
        onChange={ onChange }
        showTimeSelect={ showTimeSelect }
        timeIntervals={ timeIntervals }
        dateFormat={ dateFormat }
        minDate={ minDate }
        maxDate={ maxDate }
        customInput={ <CustomInput value={ value.toISOString() } onClick={ handleInputClick } placeholder={ placeholder }/> }
      />

      { helper && (
        <chakra.span display="block" mt={ 1 } color="gray.500" fontSize="sm">
          { helper }
        </chakra.span>
      ) }
    </chakra.div>
  );
};

export default DatePicker;
