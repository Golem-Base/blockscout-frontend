import { chakra, useToken } from '@chakra-ui/react';
import React from 'react';
import type { DatePickerProps as ReactDatePickerProps } from 'react-datepicker';
import ReactDatePicker from 'react-datepicker';

import styles from './DatePicker.module.css';
import CustomInput from './DatePickerCustomInput';
import 'react-datepicker/dist/react-datepicker.css';
import CustomTimeInput from './DatePickerCustomTimeInput';

interface DatePickerProps {
  name: ReactDatePickerProps['name'];
  value: Date;
  onChange?: (date: Date | null) => void;
  label: string;
  helper?: string;
  showTimeSelect?: boolean;
  timeIntervals?: number;
  dateFormat?: ReactDatePickerProps['dateFormat'];
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
}

const DatePicker = ({
  value,
  onChange,
  label = 'Date and time',
  name = 'datetime',
  helper,
  timeIntervals = 1,
  dateFormat = 'dd.MM.yyyy | HH:mm',
  minDate,
  maxDate,
  placeholder = 'Select date and time',
}: DatePickerProps) => {
  const handleInputClick = React.useCallback(() => {}, []);

  const CustomTimeInputComponent = React.useMemo(() => {
    return <CustomTimeInput date={ value } onChange={ onChange } timeIntervals={ timeIntervals }/>;
  }, [ onChange, timeIntervals, value ]);

  const [
    datepickerBorder,
    datepickerBg,
    datepickerText,
    datepickerHeaderBg,
    datepickerHeaderText,
    datepickerHoverBg,
    datepickerSelectedBg,
    datepickerSelectedText,
    datepickerTodayBorder,
    datepickerDisabled,
    datepickerNavHover,
    datepickerTimeBg,
    datepickerTimeBorder,
  ] = useToken('colors', [
    'gray.200',
    'white',
    'gray.800',
    'gray.50',
    'gray.700',
    'gray.100',
    'blue.500',
    'white',
    'blue.500',
    'gray.400',
    'blue.600',
    'white',
    'gray.200',
  ]);

  const cssVariables: React.CSSProperties = {
    '--datepicker-border': datepickerBorder,
    '--datepicker-bg': datepickerBg,
    '--datepicker-text': datepickerText,
    '--datepicker-header-bg': datepickerHeaderBg,
    '--datepicker-header-text': datepickerHeaderText,
    '--datepicker-hover-bg': datepickerHoverBg,
    '--datepicker-selected-bg': datepickerSelectedBg,
    '--datepicker-selected-text': datepickerSelectedText,
    '--datepicker-today-border': datepickerTodayBorder,
    '--datepicker-disabled': datepickerDisabled,
    '--datepicker-nav-hover': datepickerNavHover,
    '--datepicker-time-bg': datepickerTimeBg,
    '--datepicker-time-border': datepickerTimeBorder,
  } as React.CSSProperties;

  return (
    <chakra.div mb={ 4 } className={ styles['date-picker'] } style={ cssVariables }>
      <chakra.label htmlFor={ name } display="block" mb={ 1 } fontWeight="medium">
        { label }
      </chakra.label>

      <ReactDatePicker
        key={ `datepicker-${ timeIntervals }` }
        id={ name }
        selected={ value }
        onChange={ onChange }
        timeIntervals={ timeIntervals }
        dateFormat={ dateFormat }
        minDate={ minDate }
        maxDate={ maxDate }
        timeInputLabel=""
        showTimeInput
        customInput={ <CustomInput value={ value.toISOString() } onClick={ handleInputClick } placeholder={ placeholder }/> }
        customTimeInput={ CustomTimeInputComponent }
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
