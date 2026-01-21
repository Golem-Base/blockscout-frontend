import { createListCollection, Flex, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { StatsIntervalIds } from 'types/client/stats';

import config from 'configs/app';
import { useMultichainContext } from 'lib/contexts/multichain';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import * as metadata from 'lib/metadata';
import * as mixpanel from 'lib/mixpanel/index';
import useRoutedChainSelect from 'lib/multichain/useRoutedChainSelect';
import getQueryParamString from 'lib/router/getQueryParamString';
import { Button } from 'toolkit/chakra/button';
import type { SelectOption } from 'toolkit/chakra/select';
import { Select } from 'toolkit/chakra/select';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { ChartWidgetContent } from 'toolkit/components/charts/ChartWidgetContent';
import ChartMenu from 'toolkit/components/charts/parts/ChartMenu';
import ChainSelect from 'ui/optimismSuperchain/components/ChainSelect';
import isCustomAppError from 'ui/shared/AppError/isCustomAppError';
import ChartIntervalSelect from 'ui/shared/chart/ChartIntervalSelect';
import { useChartsConfig } from 'ui/shared/chart/config';
import { useChart } from 'ui/shared/chart/useChart';
import useChartQuery from 'ui/shared/chart/useChartQuery';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import IconSvg from 'ui/shared/IconSvg';
import PageTitle from 'ui/shared/Page/PageTitle';
import { STATS_INTERVALS, STATS_RESOLUTIONS } from 'ui/stats/constants';

const StandardChart = () => {
  const router = useRouter();
  const id = getQueryParamString(router.query.id);
  const chartsConfig = useChartsConfig();
  const chainSelect = useRoutedChainSelect();
  const multichainContext = useMultichainContext();

  const {
    interval,
    resolution,
    zoomRange,
    handleZoom,
    handleZoomReset,
    ref,
    isMobile,
    isInBrowser,
    onIntervalChange,
    onResolutionChange,
    handleReset,
    defaultResolution,
  } = useChart();

  const { items, info, lineQuery } = useChartQuery(id, resolution, interval);

  const charts = React.useMemo(() => {
    if (!info || !items) {
      return [];
    }

    return [
      {
        id: info.id,
        name: 'Value',
        items,
        charts: chartsConfig,
        units: info.units,
      },
    ];
  }, [ chartsConfig, info, items ]);

  const hasNonEmptyCharts = charts.some((chart) => chart.items.length > 2);

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

  if (lineQuery.isError) {
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

  const resolutionCollection = React.useMemo(() => {
    const resolutions = lineQuery.data?.info?.resolutions || [];
    const items = STATS_RESOLUTIONS
      .filter((resolution) => resolutions.includes(resolution.id))
      .map((resolution) => ({ value: resolution.id, label: resolution.title }));

    return createListCollection<SelectOption>({ items });
  }, [ lineQuery.data?.info?.resolutions ]);

  return (
    <>
      <PageTitle
        title={ info?.title || lineQuery.data?.info?.title || '' }
        mb={ 3 }
        isLoading={ isInfoLoading }
        secondRow={ info?.description || lineQuery.data?.info?.description }
        withTextAd
      />
      <Flex alignItems="center" justifyContent="space-between">
        <Flex alignItems="center" gap={{ base: 3, lg: 6 }} maxW="100%">
          { multichainContext?.chain && (
            <ChainSelect
              value={ chainSelect.value }
              onValueChange={ chainSelect.onValueChange }
              loading={ isInfoLoading }
            />
          ) }
          <Flex alignItems="center" gap={ 3 }>
            { !isMobile && <Text>Period</Text> }
            <ChartIntervalSelect
              interval={ interval }
              onIntervalChange={ onIntervalChange }
              options={ Object.keys(STATS_INTERVALS) as Array<StatsIntervalIds> }
            />
          </Flex>

          { (
            (info?.resolutions && info?.resolutions.length > 1) ||
            (!info && lineQuery.data?.info?.resolutions && lineQuery.data?.info?.resolutions.length > 1)
          ) && (
            <Flex alignItems="center" gap={ 3 }>
              <Skeleton loading={ isInfoLoading }>
                { isMobile ? 'Res.' : 'Resolution' }
              </Skeleton>
              <Select
                collection={ resolutionCollection }
                placeholder="Select resolution"
                defaultValue={ [ defaultResolution ] }
                onValueChange={ onResolutionChange }
                w={{ base: 'fit-content', lg: '160px' }}
                loading={ isInfoLoading }
              />
            </Flex>
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
                borderRadius="base"
                variant="icon_background"
                size="md"
                boxSize={ 8 }
              />
            )
          )) }
          { (hasItems || lineQuery.isPlaceholderData) && (
            <ChartMenu
              charts={ charts }
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
          charts={ charts }
          isEnlarged
          isLoading={ lineQuery.isPlaceholderData }
          zoomRange={ zoomRange }
          handleZoom={ handleZoom }
          empty={ !hasNonEmptyCharts }
          emptyText="No data for the selected resolution & interval."
          resolution={ resolution }
        />
      </Flex>
    </>
  );
};

export default StandardChart;
