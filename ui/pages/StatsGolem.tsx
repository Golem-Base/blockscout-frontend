import { Box } from '@chakra-ui/react';
import React from 'react';

import type { LineChartSection } from '@blockscout/stats-types';
import type { StatsIntervalIds } from 'types/client/stats';

import { STATS_INTERVALS } from 'ui/stats/constants';

import ChartsWidgetsList from '../stats/ChartsWidgetsList';
import StatsFilters from '../stats/StatsFilters';
import useStats from '../stats/useStats';

export const StatsGolem = () => {
  const {
    isPlaceholderData,
    isError,
    sections,
    currentSection,
    handleSectionChange,
    interval,
    handleIntervalChange,
    handleFilterChange,
    displayedCharts,
    filterQuery,
    initialFilterQuery,
  } = useStats();

  const charts: Array<LineChartSection> = [
    {
      id: 'data-overtime',
      title: 'Data overtime',
      charts: [
        {
          id: 'data-overtime',
          title: 'Data overtime',
          description: 'Data overtime',
          units: undefined,
          resolutions: [ 'HOUR', 'DAY', 'MONTH' ],
        },
      ],
    } ];

    console.log('StatsGolem', interval)

  return (
    <Box>
      <Box mb={{ base: 6, sm: 8 }}>
        <StatsFilters
          isLoading={ isPlaceholderData }
          initialFilterValue={ initialFilterQuery }
          sections={ sections }
          currentSection={ currentSection }
          onSectionChange={ handleSectionChange }
          interval={ interval }
          onIntervalChange={ handleIntervalChange }
          onFilterInputChange={ handleFilterChange }
          intervalOptions={ Object.keys(STATS_INTERVALS) as Array<StatsIntervalIds> }
        />
      </Box>

      <ChartsWidgetsList
        filterQuery={ filterQuery }
        initialFilterQuery={ initialFilterQuery }
        // isError={ isError }
        isError={ false }
        // isPlaceholderData={ isPlaceholderData }
        isPlaceholderData={ false }
        charts={ charts }
        interval={ interval }
      />
    </Box>
  );
};
