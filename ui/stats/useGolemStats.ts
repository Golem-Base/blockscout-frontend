import React, { useCallback, useMemo, useState } from 'react';

import type { LineChartSection } from '@blockscout/stats-types';
import type { StatsIntervalIds } from 'types/client/stats';

import { isChartNameMatches } from './utils/isChartNameMatches';
import { isSectionMatches } from './utils/isSectionMatches';

export default function useGolemStats() {
  const charts: Array<LineChartSection> = useMemo(() => {
    return [
      {
        id: 'data-usage',
        title: 'Chain statistics',
        charts: [
          {
            id: 'data-usage',
            title: 'Chain data usage',
            description: 'Data usage over time',
            resolutions: [ 'HOUR', 'DAY' ],
          },
          {
            id: 'storage-forecast',
            title: 'Chain storage forecast',
            description: 'Projection of total chain storage over time, starting from current data and trending down as entities expire (BTL)',
            resolutions: [ 'HOUR', 'DAY' ],
          },
        ],
      },
    ];
  }, []);

  const [ currentSection, setCurrentSection ] = useState('all');
  const [ filterQuery, setFilterQuery ] = useState('');
  const [ interval, setInterval ] = useState<StatsIntervalIds>('oneMonth');
  const sectionIds = useMemo(() => charts?.map(({ id }) => id), [ charts ]);

  const handleSectionChange = useCallback((newSection: string) => {
    setCurrentSection(newSection);
  }, []);

  const handleIntervalChange = useCallback((newInterval: StatsIntervalIds) => {
    setInterval(newInterval);
  }, []);

  const handleFilterChange = useCallback((q: string) => {
    setFilterQuery(q);
  }, []);

  const displayedCharts = React.useMemo(() => {
    return charts
      ?.map((section) => {
        const charts = section.charts.filter((chart) => isSectionMatches(section, currentSection) && isChartNameMatches(filterQuery, chart));

        return {
          ...section,
          charts,
        };
      }).filter((section) => section.charts.length > 0);
  }, [ currentSection, filterQuery, charts ]);

  return React.useMemo(() => ({
    displayedCharts,
    sectionIds,
    filterQuery,
    currentSection,
    handleSectionChange,
    interval,
    handleIntervalChange,
    handleFilterChange,
  }), [
    displayedCharts,
    sectionIds,
    filterQuery,
    currentSection,
    handleSectionChange,
    interval,
    handleIntervalChange,
    handleFilterChange,
  ]);
}
