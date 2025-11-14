import { useRouter } from 'next/router';
import React, { useState } from 'react';

import type { LineCharts } from '@blockscout/stats-types';
import type { StatsIntervalIds } from 'types/client/stats';

import useApiQuery from 'lib/api/useApiQuery';
import getQueryParamString from 'lib/router/getQueryParamString';
import { STATS_CHARTS } from 'stubs/stats';

import { isChartNameMatches } from './utils/isChartNameMatches';
import { isSectionMatches } from './utils/isSectionMatches';

export default function useStats() {
  const router = useRouter();

  const { data, isPlaceholderData, isError } = useApiQuery('stats:lines', {
    queryOptions: {
      placeholderData: STATS_CHARTS,
    },
  });

  const extendedData: LineCharts | undefined = React.useMemo(() => {
    if (!data) return undefined;

    const extendedData = { ...data };

    const gasSection = extendedData?.sections?.find((section) => section.id === 'gas');
    const isGasBlockChartExists = gasSection?.charts.some((chart) => chart.id === 'gas-block');

    if (gasSection && !isGasBlockChartExists) {
      gasSection.charts.push({
        id: 'gas-block',
        title: 'Gas per block',
        description: 'Gas usage over time for recent blocks',
        units: 'Gwei',
        resolutions: [],
      });
    }

    return extendedData;
  }, [ data ]);

  const [ currentSection, setCurrentSection ] = useState('all');
  const [ filterQuery, setFilterQuery ] = useState('');
  const [ initialFilterQuery, setInitialFilterQuery ] = React.useState('');
  const [ interval, setInterval ] = useState<StatsIntervalIds>('oneMonth');
  const sectionIds = React.useMemo(() => extendedData?.sections?.map(({ id }) => id), [ extendedData ]);

  React.useEffect(() => {
    if (!isPlaceholderData && !isError) {
      const chartId = getQueryParamString(router.query.chartId);
      const chartName = extendedData?.sections.map((section) => section.charts.find((chart) => chart.id === chartId)).filter(Boolean)[0]?.title;
      if (chartName) {
        setInitialFilterQuery(chartName);
        setFilterQuery(chartName);
        router.replace({ pathname: '/stats' }, undefined, { scroll: false });
      }
    }
  // run only when data is loaded
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ isPlaceholderData ]);

  const displayedCharts = React.useMemo(() => {
    return extendedData?.sections
      ?.map((section) => {
        const charts = section.charts.filter((chart) => isSectionMatches(section, currentSection) && isChartNameMatches(filterQuery, chart));

        return {
          ...section,
          charts,
        };
      }).filter((section) => section.charts.length > 0);
  }, [ currentSection, extendedData?.sections, filterQuery ]);

  const handleSectionChange = React.useCallback((newSection: string) => {
    setCurrentSection(newSection);
  }, []);

  const handleIntervalChange = React.useCallback((newInterval: StatsIntervalIds) => {
    setInterval(newInterval);
  }, []);

  const handleFilterChange = React.useCallback((q: string) => {
    setFilterQuery(q);
  }, []);

  return React.useMemo(() => ({
    sections: extendedData?.sections,
    sectionIds,
    isPlaceholderData,
    isError,
    initialFilterQuery,
    filterQuery,
    currentSection,
    handleSectionChange,
    interval,
    handleIntervalChange,
    handleFilterChange,
    displayedCharts,
  }), [
    extendedData,
    sectionIds,
    isPlaceholderData,
    isError,
    initialFilterQuery,
    filterQuery,
    currentSection,
    handleSectionChange,
    interval,
    handleIntervalChange,
    handleFilterChange,
    displayedCharts,
  ]);
}
