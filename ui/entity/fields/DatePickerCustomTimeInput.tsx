import { chakra, createListCollection, Flex } from '@chakra-ui/react';
import React from 'react';

import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'lib/date/dayjs';
import { Select } from 'toolkit/chakra/select';
import type { SelectOption } from 'toolkit/chakra/select';

interface CustomTimeInputProps {
  date?: Date;
  onChange?: (date: Date | null) => void;
  timeIntervals?: number;
}

const CustomTimeInput = ({ date, onChange: onTimeChange, timeIntervals = 1 }: CustomTimeInputProps) => {
  const currentHour = React.useMemo(() => date?.getHours() || 0, [ date ]);
  const currentMinute = React.useMemo(() => date?.getMinutes() || 0, [ date ]);

  const hours = React.useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      label: i.toString().padStart(2, '0'),
      value: i.toString(),
    }));
  }, []);

  const minutes = React.useMemo(() => {
    return Array.from({ length: 60 / timeIntervals }, (_, i) => {
      const minute = i * timeIntervals;
      return {
        label: minute.toString().padStart(2, '0'),
        value: minute.toString(),
      };
    });
  }, [ timeIntervals ]);

  const hoursCollection = React.useMemo(() => createListCollection<SelectOption>({ items: hours }), [ hours ]);
  const minutesCollection = React.useMemo(() => createListCollection<SelectOption>({ items: minutes }), [ minutes ]);

  const handleHourChange = React.useCallback((data: { value: Array<string> }) => {
    if (!onTimeChange) return;

    const hour = parseInt(data.value[0], 10);
    const newDate = dayjs(date).set('hour', hour).toDate();

    onTimeChange(newDate);
  }, [ onTimeChange, date ]);

  const handleMinuteChange = React.useCallback((data: { value: Array<string> }) => {
    if (!onTimeChange) return;

    const minute = parseInt(data.value[0], 10);
    const newDate = dayjs(date).set('minute', minute).toDate();

    onTimeChange(newDate);
  }, [ onTimeChange, date ]);

  return (
    <Flex gap={ 2 } p={ 3 } alignItems="center" borderTopWidth="1px" borderColor="var(--datepicker-border)">
      <chakra.span fontSize="sm" fontWeight="medium" color="var(--datepicker-header-text)">
        Time:
      </chakra.span>
      <Select
        collection={ hoursCollection }
        placeholder="HH"
        size="sm"
        w="80px"
        value={ [ currentHour.toString() ] }
        onValueChange={ handleHourChange }
        portalled={ false }
      />
      <chakra.span fontSize="sm" color="var(--datepicker-text)">:</chakra.span>
      <Select
        collection={ minutesCollection }
        placeholder="MM"
        size="sm"
        w="80px"
        value={ [ currentMinute.toString() ] }
        onValueChange={ handleMinuteChange }
        portalled={ false }
      />
    </Flex>
  );
};

export default CustomTimeInput;
