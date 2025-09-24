import { createListCollection } from '@chakra-ui/react';
import React from 'react';

import type { StatsInterval, StatsIntervalIds } from 'types/client/stats';

import { Select } from 'toolkit/chakra/select';
import { Skeleton } from 'toolkit/chakra/skeleton';
import type { TagProps } from 'toolkit/chakra/tag';
import TagGroupSelect from 'ui/shared/tagGroupSelect/TagGroupSelect';
import { STATS_INTERVALS } from 'ui/stats/constants';

type Props = {
  interval: StatsIntervalIds;
  onIntervalChange: (newInterval: StatsIntervalIds) => void;
  isLoading?: boolean;
  selectTagSize?: TagProps['size'];
  options: Array<StatsIntervalIds>;
};

const ChartIntervalSelect = ({ interval, onIntervalChange, isLoading, selectTagSize, options }: Props) => {
  const intervalCollection = createListCollection({
    items: options.map((id: string) => ({
      value: id,
      label: STATS_INTERVALS[id as StatsIntervalIds].title,
    })),
  });

  const intervalListShort = options.map((id: string) => ({
    id: id,
    title: STATS_INTERVALS[id as StatsIntervalIds].shortTitle,
  })) as Array<StatsInterval>;

  const handleItemSelect = React.useCallback(({ value }: { value: Array<string> }) => {
    onIntervalChange(value[0] as StatsIntervalIds);
  }, [ onIntervalChange ]);

  return (
    <>
      <Skeleton hideBelow="lg" borderRadius="base" loading={ isLoading }>
        <TagGroupSelect<StatsIntervalIds> items={ intervalListShort } onChange={ onIntervalChange } value={ interval } tagSize={ selectTagSize }/>
      </Skeleton>
      <Select
        collection={ intervalCollection }
        placeholder="Select interval"
        defaultValue={ [ interval ] }
        onValueChange={ handleItemSelect }
        hideFrom="lg"
        w="100%"
        loading={ isLoading }
      />
    </>
  );
};

export default React.memo(ChartIntervalSelect);
