import React, { useCallback, useMemo, useState } from 'react';

import type { LineChartSection } from '@blockscout/stats-types';
import type { StatsIntervalIds } from 'types/client/stats';

export default function useGolemStats() {
  const charts: Array<LineChartSection> = useMemo(() => {
    return [
      {
        id: 'data-usage',
        title: 'Network statistics',
        charts: [
          {
            id: 'data-usage',
            title: 'Data usage',
            description: 'Data added to the L3 storage',
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

  return React.useMemo(() => ({
    charts,
    sectionIds,
    filterQuery,
    currentSection,
    handleSectionChange,
    interval,
    handleIntervalChange,
    handleFilterChange,
  }), [
    charts,
    sectionIds,
    filterQuery,
    currentSection,
    handleSectionChange,
    interval,
    handleIntervalChange,
    handleFilterChange,
  ]);
}
