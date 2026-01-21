import { useToken } from '@chakra-ui/react';
import * as d3 from 'd3';
import React from 'react';

import type { Resolution } from '@blockscout/stats-types';
import { ChartResolution } from '@golembase/l3-indexer-types';
import type { ChartMargin } from 'ui/shared/chart/types';

import useIsMobile from 'lib/hooks/useIsMobile';
import type { TimeChartData } from 'toolkit/components/charts';
import { ChartArea } from 'toolkit/components/charts/parts/ChartArea';
import { ChartAxis } from 'toolkit/components/charts/parts/ChartAxis';
import { ChartGridLine } from 'toolkit/components/charts/parts/ChartGridLine';
import { ChartLine } from 'toolkit/components/charts/parts/ChartLine';
import { ChartOverlay } from 'toolkit/components/charts/parts/ChartOverlay';
import { ChartSelectionX } from 'toolkit/components/charts/parts/ChartSelectionX';
import { ChartTooltip } from 'toolkit/components/charts/parts/ChartTooltip';
import { getDateLabel } from 'toolkit/components/charts/utils/getDateLabel';
import { useTimeChartController } from 'toolkit/components/charts/utils/useTimeChartController';
import { useChartsConfig } from 'ui/shared/chart/config';

interface Props {
  isEnlarged?: boolean;
  title: string;
  units?: string;
  items: TimeChartData;
  zoomRange?: [ Date, Date ];
  onZoom: (range: [ Date, Date ]) => void;
  margin?: ChartMargin;
  noAnimation?: boolean;
  resolution?: ChartResolution | Resolution;
  valueFormatter?: (value: number | string) => string;
}

const DEFAULT_CHART_MARGIN = { bottom: 20, left: 10, right: 20, top: 10 };

const ChartWidgetGraph = ({
  isEnlarged,
  items,
  onZoom,
  title,
  margin: marginProps,
  units,
  noAnimation,
  resolution,
  zoomRange,
  valueFormatter,
}: Props) => {
  const isMobile = useIsMobile();
  const [ defaultColor ] = useToken('colors', 'blue.200');
  const chartId = `chart-${ title.split(' ').join('') }-${ isEnlarged ? 'fullscreen' : 'small' }`;
  const chartsConfig = useChartsConfig();

  const overlayRef = React.useRef<SVGRectElement>(null);

  // Extract the first series from TimeChartData
  const firstSeries = React.useMemo(() => items[0], [ items ]);
  const seriesItems = React.useMemo(() => firstSeries?.items || [], [ firstSeries?.items ]);

  // Extract color from first chart config or use default
  const color = React.useMemo(() => {
    if (firstSeries?.charts && firstSeries.charts.length > 0) {
      const firstChart = firstSeries.charts[0];
      if (firstChart.type === 'line') {
        return firstChart.color;
      }
      if (firstChart.type === 'area') {
        return firstChart.gradient.startColor;
      }
    }
    return defaultColor;
  }, [ firstSeries?.charts, defaultColor ]);

  const range = React.useMemo(() => {
    if (zoomRange) {
      return zoomRange;
    }
    if (seriesItems.length > 0) {
      return [ seriesItems[0].date, seriesItems[seriesItems.length - 1].date ];
    }
    return [ new Date(), new Date() ];
  }, [ zoomRange, seriesItems ]);

  const displayedData = React.useMemo(() =>
    seriesItems
      .filter((item) => item.date >= range[0] && item.date <= range[1])
      .map((item) => ({
        ...item,
        dateLabel: item.dateLabel || getDateLabel(item.date, item.date_to, resolution),
        valueFormatter: valueFormatter || firstSeries?.valueFormatter,
      })),
  [ seriesItems, range, resolution, valueFormatter, firstSeries?.valueFormatter ]);

  const chartData: TimeChartData = React.useMemo(() => {
    if (!firstSeries) {
      return [];
    }
    return [ {
      id: firstSeries.id || chartId,
      charts: firstSeries.charts || chartsConfig,
      items: displayedData,
      name: firstSeries.name || 'Value',
      units: firstSeries.units || units,
      valueFormatter: valueFormatter || firstSeries.valueFormatter,
    } ];
  }, [ firstSeries, chartId, chartsConfig, displayedData, units, valueFormatter ]);

  const margin: ChartMargin = React.useMemo(() => ({ ...DEFAULT_CHART_MARGIN, ...marginProps }), [ marginProps ]);
  const axesConfig = React.useMemo(() => {
    return {
      x: {
        ticks: isEnlarged && !isMobile ? 8 : 4,
      },
      y: {
        ticks: isEnlarged ? 6 : 3,
        nice: true,
      },
    };
  }, [ isEnlarged, isMobile ]);

  const {
    ref,
    rect,
    innerWidth,
    innerHeight,
    chartMargin,
    axes,
  } = useTimeChartController({
    data: chartData,
    margin,
    axesConfig,
  });

  const hourTickFormatter = React.useCallback(() => {
    return (domainValue: d3.AxisDomain) => d3.timeFormat('%H:%M')(domainValue as Date);
  }, []);

  return (
    <svg width="100%" height="100%" ref={ ref } cursor="pointer" id={ chartId } opacity={ rect ? 1 : 0 }>

      <g transform={ `translate(${ chartMargin?.left || 0 },${ chartMargin?.top || 0 })` }>
        <ChartGridLine
          type="horizontal"
          scale={ axes.y.scale }
          ticks={ axesConfig.y.ticks }
          size={ innerWidth }
          noAnimation
        />

        <ChartArea
          id={ chartId }
          data={ displayedData }
          gradient={{ startColor: color, stopColor: color }}
          xScale={ axes.x.scale }
          yScale={ axes.y.scale }
          noAnimation={ noAnimation }
        />

        <ChartLine
          data={ displayedData }
          xScale={ axes.x.scale }
          yScale={ axes.y.scale }
          stroke={ color }
          animation="none"
          strokeWidth={ isMobile ? 1 : 2 }
        />

        <ChartAxis
          type="left"
          scale={ axes.y.scale }
          ticks={ axesConfig.y.ticks }
          tickFormatGenerator={ axes.y.tickFormatter }
          noAnimation
        />

        <ChartAxis
          type="bottom"
          scale={ axes.x.scale }
          transform={ `translate(0, ${ innerHeight })` }
          ticks={ axesConfig.x.ticks }
          anchorEl={ overlayRef.current }
          tickFormatGenerator={ resolution === ChartResolution.HOUR ? hourTickFormatter : axes.x.tickFormatter }
          noAnimation
        />

        <ChartOverlay ref={ overlayRef } width={ innerWidth } height={ innerHeight }>
          <ChartTooltip
            anchorEl={ overlayRef.current }
            width={ innerWidth }
            height={ innerHeight }
            xScale={ axes.x.scale }
            yScale={ axes.y.scale }
            data={ chartData }
            noAnimation={ noAnimation }
            resolution={ resolution }
          />

          <ChartSelectionX
            anchorEl={ overlayRef.current }
            height={ innerHeight }
            scale={ axes.x.scale }
            data={ chartData }
            onSelect={ onZoom }
          />
        </ChartOverlay>
      </g>
    </svg>
  );
};

export default React.memo(ChartWidgetGraph);
