import { Flex, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { OperationTypeFilter_OperationTypeFilter as OperationTypeFilter } from '@golembase/l3-indexer-types';
import type { StatsIntervalIds } from 'types/client/stats';
import type { OnFilterChange } from 'ui/shared/chart/types';

import config from 'configs/app';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import * as metadata from 'lib/metadata';
import * as mixpanel from 'lib/mixpanel/index';
import getQueryParamString from 'lib/router/getQueryParamString';
import { Button } from 'toolkit/chakra/button';
import { ChartWidgetContent } from 'toolkit/components/charts/ChartWidgetContent';
import ChainIndicatorFilter from 'ui/home/indicators/ChainIndicatorFilter';
import isCustomAppError from 'ui/shared/AppError/isCustomAppError';
import ChartIntervalSelect from 'ui/shared/chart/ChartIntervalSelect';
import ChartMenu from 'ui/shared/chart/ChartMenu';
import { useChart } from 'ui/shared/chart/useChart';
import useGolemChartParams from 'ui/shared/chart/useGolemChartParams';
import type { GolemChartId, GolemChartQueryResolution } from 'ui/shared/chart/useGolemChartQuery';
import useGolemChartQuery from 'ui/shared/chart/useGolemChartQuery';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import IconSvg from 'ui/shared/IconSvg';
import PageTitle from 'ui/shared/Page/PageTitle';
import AllTimeIntervalNoDataMessage from 'ui/stats/AllTimeIntervalNoDataMessage';
import { STATS_INTERVALS } from 'ui/stats/constants';

const StandardChart = () => {
  const router = useRouter();
  const id = getQueryParamString(router.query.id) as GolemChartId;

  const { params, handleParamChange, filterableParamsList } = useGolemChartParams(id);

  const {
    interval,
    resolution,
    zoomRange,
    handleZoom,
    handleZoomReset,
    ref,
    isMobile,
    isInBrowser,
    backLink,
    onIntervalChange,
    handleReset,
  } = useChart();

  const { items, info, lineQuery } = useGolemChartQuery(id, resolution as GolemChartQueryResolution, interval, true, params);

  const isStorageForecastAllInterval = React.useMemo(() => {
    return interval === 'all' && id === 'storage-forecast';
  }, [ interval, id ]);

  React.useEffect(() => {
    if (info && !config.meta.seo.enhancedDataEnabled) {
      metadata.update({ pathname: '/stats/[id]', query: { id } }, info);
    }
  }, [ info, id ]);

  const onShare = React.useCallback(async() => {
    mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, { Type: 'Share chart', Info: id });
    try {
      await window.navigator.share({
        title: info?.title,
        text: info?.description,
        url: window.location.href,
      });
    } catch (error) {}
  }, [ info, id ]);

  const customStorageForecastAllIntervalNoDataMessage = React.useMemo(() => {
    if (!isStorageForecastAllInterval) return;

    return <AllTimeIntervalNoDataMessage/>;
  }, [ isStorageForecastAllInterval ]);

  if (!isStorageForecastAllInterval && lineQuery.isError) {
    if (isCustomAppError(lineQuery.error)) {
      throwOnResourceLoadError({ resource: 'stats:line', error: lineQuery.error, isError: true });
    }
  }

  const hasItems = (items && items.length > 2) || lineQuery.isPending;

  const isInfoLoading = !info && lineQuery.isPlaceholderData;

  const shareButton = (
    <Button
      size="sm"
      variant="outline"
      onClick={ onShare }
      ml={ 6 }
      loadingSkeleton={ lineQuery.isPlaceholderData }
    >
      <IconSvg name="share" w={ 4 } h={ 4 }/>
      Share
    </Button>
  );

  const onFilterChange: OnFilterChange = React.useCallback((name) => {
    return (value) => {
      handleParamChange(name, value.value[0]);
    };
  }, [ handleParamChange ]);

  const operationFilterOptions = React.useMemo(() => {
    return Object.values(OperationTypeFilter)
      .filter((type) => type !== OperationTypeFilter.UNRECOGNIZED)
      .map((operation) => ({ value: operation, label: operation }));
  }, []);

  return (
    <>
      <PageTitle
        title={ info?.title || lineQuery.data?.info?.title || '' }
        mb={ 3 }
        isLoading={ isInfoLoading }
        backLink={ backLink }
        secondRow={ info?.description || lineQuery.data?.info?.description }
        withTextAd
      />
      <Flex alignItems="center" justifyContent="space-between">
        <Flex alignItems="center" gap={{ base: 3, lg: 6 }} maxW="100%">
          <Flex alignItems="center" gap={ 3 }>
            { !isMobile && <Text>Period</Text> }
            <ChartIntervalSelect
              interval={ interval }
              onIntervalChange={ onIntervalChange }
              options={ Object.keys(STATS_INTERVALS) as Array<StatsIntervalIds> }
            />
          </Flex>

          { filterableParamsList.includes('operation') && (
            <ChainIndicatorFilter
              name="operation"
              options={ operationFilterOptions }
              defaultValue={ params.operation || OperationTypeFilter.ALL }
              onValueChange={ onFilterChange }
              isLoading={ isInfoLoading }
            />
          ) }

          { (Boolean(zoomRange)) && (
            <Button
              variant="link"
              onClick={ handleReset }
              display="flex"
              alignItems="center"
              gap={ 2 }
            >
              <IconSvg name="repeat" w={ 5 } h={ 5 }/>
              { !isMobile && 'Reset' }
            </Button>
          ) }
        </Flex>
        <Flex alignItems="center" gap={ 3 }>
          { /* TS thinks window.navigator.share can't be undefined, but it can */ }
          { /* eslint-disable-next-line @typescript-eslint/no-explicit-any */ }
          { !isMobile && (isInBrowser && ((window.navigator.share as any) ?
            shareButton :
            (
              <CopyToClipboard
                text={ config.app.baseUrl + router.asPath }
                type="link"
                ml={ 0 }
                borderRadius="none"
                variant="icon_secondary"
                size="md"
              />
            )
          )) }
          { (hasItems || lineQuery.isPlaceholderData) && (
            <ChartMenu
              items={ items }
              title={ info?.title || '' }
              description={ info?.description || '' }
              isLoading={ lineQuery.isPlaceholderData }
              chartRef={ ref }
              resolution={ resolution }
              zoomRange={ zoomRange }
              handleZoom={ handleZoom }
              handleZoomReset={ handleZoomReset }
              chartUrl={ isMobile ? window.location.href : undefined }
            />
          ) }
        </Flex>
      </Flex>
      <Flex
        ref={ ref }
        flexGrow={ 1 }
        h="50vh"
        mt={ 3 }
        position="relative"
      >
        <ChartWidgetContent
          isError={ lineQuery.isError }
          items={ items }
          title={ info?.title || '' }
          units={ info?.units || undefined }
          isEnlarged
          isLoading={ lineQuery.isPlaceholderData }
          zoomRange={ zoomRange }
          handleZoom={ handleZoom }
          emptyText="No data for the selected resolution & interval."
          resolution={ resolution }
          customNoDataMessage={ customStorageForecastAllIntervalNoDataMessage }
        />
      </Flex>
    </>
  );
};

export default StandardChart;
