import type { NextRouter } from 'next/router';
import { useRouter } from 'next/router';
import React from 'react';

import { Resolution } from '@blockscout/stats-types';
import type { StatsIntervalIds } from 'types/client/stats';
import { StatsIntervalId } from 'types/client/stats';

import useIsMobile from 'lib/hooks/useIsMobile';
import getQueryParamString from 'lib/router/getQueryParamString';
import { isBrowser } from 'toolkit/utils/isBrowser';
import useZoom from 'ui/shared/chart/useZoom';

export const DEFAULT_RESOLUTION = Resolution.DAY;

const getIntervalByResolution = (resolution: Resolution): StatsIntervalIds => {
  switch (resolution) {
    case 'DAY':
      return 'oneMonth';
    case 'WEEK':
      return 'oneMonth';
    case 'MONTH':
      return 'oneYear';
    case 'YEAR':
      return 'all';
    default:
      return 'oneMonth';
  }
};

const getIntervalFromQuery = (router: NextRouter): StatsIntervalIds | undefined => {
  const intervalFromQuery = getQueryParamString(router.query.interval);

  if (!intervalFromQuery || !Object.values(StatsIntervalId).includes(intervalFromQuery as StatsIntervalIds)) {
    return undefined;
  }

  return intervalFromQuery as StatsIntervalIds;
};

const getResolutionFromQuery = (router: NextRouter) => {
  const resolutionFromQuery = getQueryParamString(router.query.resolution);

  if (!resolutionFromQuery || !Resolution[resolutionFromQuery as keyof typeof Resolution]) {
    return DEFAULT_RESOLUTION;
  }

  return resolutionFromQuery as Resolution;
};

export const useChart = () => {
  const router = useRouter();
  const intervalFromQuery = getIntervalFromQuery(router);
  const resolutionFromQuery = getResolutionFromQuery(router);
  const defaultResolution = resolutionFromQuery || DEFAULT_RESOLUTION;
  const [ intervalState, setIntervalState ] = React.useState<StatsIntervalIds | undefined>(intervalFromQuery);
  const [ resolution, setResolution ] = React.useState<Resolution>(defaultResolution);
  const { zoomRange, handleZoom, handleZoomReset } = useZoom();

  const interval = intervalState || getIntervalByResolution(resolution);

  const ref = React.useRef<HTMLDivElement>(null);

  const isMobile = useIsMobile();
  const isInBrowser = isBrowser();

  const onIntervalChange = React.useCallback((interval: StatsIntervalIds) => {
    setIntervalState(interval);
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, interval },
      },
      undefined,
      { shallow: true },
    );
  }, [ setIntervalState, router ]);

  const onResolutionChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setResolution(value[0] as Resolution);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, resolution: value[0] },
    },
    undefined,
    { shallow: true },
    );
  }, [ setResolution, router ]);

  const handleReset = React.useCallback(() => {
    handleZoomReset();
    onResolutionChange({ value: [ DEFAULT_RESOLUTION ] });
  }, [ handleZoomReset, onResolutionChange ]);

  return {
    interval,
    resolution,
    onIntervalChange,
    onResolutionChange,
    handleReset,
    zoomRange,
    handleZoom,
    handleZoomReset,
    ref,
    isMobile,
    isInBrowser,
    defaultResolution,
  };

};
