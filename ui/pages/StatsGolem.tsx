import { Box } from '@chakra-ui/react';
import React from 'react';

import type { StatsIntervalIds } from 'types/client/stats';

import { STATS_INTERVALS } from 'ui/stats/constants';
import useGolemStats from 'ui/stats/useGolemStats';

import ChartsWidgetsList from '../stats/ChartsWidgetsList';
import StatsFilters from '../stats/StatsFilters';

export const StatsGolem = () => {
  const {
    displayedCharts,
    currentSection,
    handleSectionChange,
    interval,
    handleIntervalChange,
    handleFilterChange,
  } = useGolemStats();

  return (
    <Box>
      <Box mb={{ base: 6, sm: 8 }}>
        <StatsFilters
          isLoading={ false }
          initialFilterValue=""
          sections={ displayedCharts }
          currentSection={ currentSection }
          onSectionChange={ handleSectionChange }
          interval={ interval }
          onIntervalChange={ handleIntervalChange }
          onFilterInputChange={ handleFilterChange }
          intervalOptions={ Object.keys(STATS_INTERVALS) as Array<StatsIntervalIds> }
        />
      </Box>

      <ChartsWidgetsList
        initialFilterQuery=""
        isError={ false }
        isPlaceholderData={ false }
        charts={ displayedCharts }
        interval={ interval }
        sections={ displayedCharts }
        selectedSectionId={ currentSection }
      />
    </Box>
  );
};
