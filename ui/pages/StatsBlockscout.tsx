import { Box } from '@chakra-ui/react';
import React from 'react';

import type { StatsIntervalIds } from 'types/client/stats';

import { STATS_INTERVALS } from 'ui/stats/constants';

import ChartsWidgetsList from '../stats/ChartsWidgetsList';
import StatsFilters from '../stats/StatsFilters';
import useStats from '../stats/useStats';

export const StatsBlockscout = () => {
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

  const intervalOptions = (Object.keys(STATS_INTERVALS) as Array<StatsIntervalIds>).filter(item => item !== 'oneDay');

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
          intervalOptions={ intervalOptions }
        />
      </Box>

      <ChartsWidgetsList
        filterQuery={ filterQuery }
        initialFilterQuery={ initialFilterQuery }
        isError={ isError }
        isPlaceholderData={ isPlaceholderData }
        charts={ displayedCharts }
        interval={ interval }
      />
    </Box>
  );
};
