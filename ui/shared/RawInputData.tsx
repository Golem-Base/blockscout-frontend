import { createListCollection } from '@chakra-ui/react';
import React from 'react';

import hexToUtf8 from 'lib/hexToUtf8';
import { useFormatCode } from 'lib/hooks/useFormatCode';
import type { SelectOption } from 'toolkit/chakra/select';
import { Select } from 'toolkit/chakra/select';
import RawDataSnippet from 'ui/shared/RawDataSnippet';

const OPTIONS = [
  { label: 'Hex', value: 'Hex' as const },
  { label: 'UTF-8', value: 'UTF-8' as const },
  { label: 'Rich', value: 'Rich' as const },
];

export type DataType = (typeof OPTIONS)[number]['value'];

interface Props {
  hex: string;
  rightSlot?: React.ReactNode;
  defaultDataType?: DataType;
  isLoading?: boolean;
  minHeight?: string;
  rich?: boolean;
}

const RawInputData = ({
  hex,
  rightSlot: rightSlotProp,
  defaultDataType = 'Hex',
  isLoading,
  minHeight,
  rich = false,
}: Props) => {
  const [ selectedDataType, setSelectedDataType ] = React.useState<DataType>(defaultDataType);

  const handleValueChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setSelectedDataType(value[0] as DataType);
  }, []);

  const collection = React.useMemo(() => {
    const items = OPTIONS.filter(({ value }) => rich || value !== 'Rich');
    return createListCollection<SelectOption>({ items });
  }, [ rich ]);

  const rightSlot = (
    <>
      <Select
        collection={ collection }
        placeholder="Select type"
        defaultValue={ [ defaultDataType ] }
        onValueChange={ handleValueChange }
        w="100px"
        mr="auto"
        loading={ isLoading }
      />
      { rightSlotProp }
    </>
  );

  const utf8 = React.useMemo(() => hexToUtf8(hex), [ hex ]);

  const { formatted } = useFormatCode(utf8, selectedDataType === 'Rich');

  return (
    <RawDataSnippet
      data={ selectedDataType === 'Hex' ? hex : formatted }
      highlight={ selectedDataType === 'Rich' }
      rightSlot={ rightSlot }
      isLoading={ isLoading }
      textareaMaxHeight="220px"
      textareaMinHeight={ minHeight || '160px' }
      w="100%"
    />
  );
};

export default React.memo(RawInputData);
