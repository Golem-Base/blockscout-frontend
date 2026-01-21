import { Box, useToken } from '@chakra-ui/react';
import * as d3 from 'd3';
import React from 'react';

import type { BlockOperationPoint } from '@golembase/l3-indexer-types';
import type { TimeChartItem } from 'ui/shared/chart/types';

import useIsMobile from 'lib/hooks/useIsMobile';
import type { TimeChartData } from 'toolkit/components/charts';
import { ChartArea } from 'toolkit/components/charts/parts/ChartArea';
import { ChartAxis } from 'toolkit/components/charts/parts/ChartAxis';
import { ChartGridLine } from 'toolkit/components/charts/parts/ChartGridLine';
import { ChartLine } from 'toolkit/components/charts/parts/ChartLine';
import { ChartOverlay } from 'toolkit/components/charts/parts/ChartOverlay';
import { ChartTooltip } from 'toolkit/components/charts/parts/ChartTooltip';
import { ChartWatermark as ChartWatermarkIcon } from 'toolkit/components/charts/parts/ChartWatermark';
import { useClientRect } from 'toolkit/hooks/useClientRect';
import { useChartsConfig } from 'ui/shared/chart/config';

import type { OperationTypeCount } from './BlockOperationsChartBar';
import useChartBlockNavigation from './hooks/useChartBlockNavigation';

export interface Item extends BlockOperationPoint {
  label: string;
  value: number;
}

interface Props {
  items: Array<Item>;
  height?: number;
  visibleOperations: Array<OperationTypeCount>;
}

type UseTokenTokensAttribute = Parameters<typeof useToken>[1];

const getMargin = (isMobile?: boolean) => ({ top: 10, right: 10, bottom: isMobile ? 80 : 25, left: 50 });
const DEFAULT_HEIGHT = 300;
const colorTokens: UseTokenTokensAttribute = [ 'blue.200' ];
const baseDate = new Date(0);

const BlockOperationsChart = ({ items, height = DEFAULT_HEIGHT, visibleOperations }: Props) => {
  const [ rect, ref ] = useClientRect<SVGSVGElement>();
  const isMobile = useIsMobile();
  const overlayRef = React.useRef<SVGRectElement>(null);
  const chartsConfig = useChartsConfig();

  const [ lineColor ] = useToken('colors', colorTokens);

  const margin = getMargin(isMobile);

  const innerWidth = rect ? Math.max(rect.width - margin.left - margin.right, 0) : 0;
  const innerHeight = Math.max(height - margin.top - margin.bottom, 0);

  const lineChartData: Array<TimeChartItem> = React.useMemo(() => {
    return items.map((item, index) => {
      const total = visibleOperations.reduce((acc, operation) => acc + (Number(item[operation]) || 0), 0);

      return {
        date: new Date(baseDate.getTime() + index),
        value: total,
        dateLabel: item.label,
      };
    });
  }, [ items, visibleOperations ]);

  const operationSeries = React.useMemo(() => {
    const operationLabels: Record<OperationTypeCount, string> = {
      create_count: 'Create',
      update_count: 'Update',
      extend_count: 'Extend',
      delete_count: 'Delete',
      changeowner_count: 'Change Owner',
    };

    return visibleOperations.map((operation) => ({
      id: `operation-${ operation }`,
      items: items.map((item, index) => ({
        date: new Date(baseDate.getTime() + index),
        value: Number(item[operation]) || 0,
        dateLabel: item.label,
      })),
      name: operationLabels[operation],
      charts: chartsConfig,
      valueFormatter: (value: number) => value.toLocaleString(),
    }));
  }, [ visibleOperations, items, chartsConfig ]);

  const totalSeries = React.useMemo(() => ({
    id: 'total',
    items: lineChartData,
    name: 'Total',
    charts: chartsConfig,
    valueFormatter: (value: number) => value.toLocaleString(),
  }), [ lineChartData, chartsConfig ]);

  const chartData: TimeChartData = React.useMemo(() => [
    ...operationSeries,
    totalSeries,
  ], [ operationSeries, totalSeries ]);

  const xScale = React.useMemo(() => {
    if (items.length === 0) {
      return d3.scaleTime().domain([ new Date(0), new Date(1) ]).range([ 0, innerWidth ]);
    }
    return d3.scaleTime()
      .domain([ baseDate, new Date(baseDate.getTime() + items.length - 1) ])
      .range([ 0, innerWidth ])
      .nice();
  }, [ items.length, innerWidth ]);

  const { yScale, yTicks } = React.useMemo(() => {
    const values = lineChartData.map(({ value }) => value);
    const maxValue = values.length ? d3.max(values) ?? 0 : 0;

    const domainMin = 0;

    if (maxValue === 0) {
      return {
        yScale: d3.scaleLinear()
          .domain([ 0, 1 ])
          .range([ innerHeight, 0 ]),
        yTicks: 2,
      };
    }

    const domainMax = Math.ceil(maxValue * 1.1);

    const scale = d3.scaleLinear()
      .domain([ domainMin, domainMax ])
      .range([ innerHeight, 0 ]);

    const ticks = Math.min(6, Math.max(2, Math.ceil(domainMax - domainMin)));

    return { yScale: scale, yTicks: ticks };
  }, [ innerHeight, lineChartData ]);

  const yAxisTickFormatter = React.useCallback(() => {
    let previousFormatted = '';
    return (d: d3.AxisDomain) => {
      const num = Math.round(Number(d));
      const formatted = num.toLocaleString(undefined, {
        notation: 'compact',
        maximumFractionDigits: 0,
      });

      if (formatted === previousFormatted) {
        return '';
      }
      previousFormatted = formatted;
      return formatted;
    };
  }, []);

  const xAxisTickFormatter = React.useCallback(() => {
    return (d: d3.AxisDomain) => {
      const date = d as Date;
      const index = Math.round(date.getTime() - baseDate.getTime());
      if (index >= 0 && index < items.length) {
        return items[index].label;
      }
      return '';
    };
  }, [ items ]);

  const { handleChartClick, handleChartAuxClick } = useChartBlockNavigation({
    overlayRef,
    items,
    xScale,
    baseDate,
  });

  if (items.length === 0) {
    return <Box w="100%" h={ `${ height }px` }/>;
  }

  return (
    <Box position="relative" w="100%" h={ `${ height }px` } minW="0">
      <svg
        ref={ ref }
        width="100%"
        height={ height }
        opacity={ rect ? 1 : 0 }
      >
        <g transform={ `translate(${ margin.left },${ margin.top })` }>
          <ChartGridLine
            type="horizontal"
            scale={ yScale }
            ticks={ yTicks }
            size={ innerWidth }
            noAnimation
          />

          <ChartAxis
            type="left"
            scale={ yScale }
            ticks={ yTicks }
            tickFormatGenerator={ yAxisTickFormatter }
            noAnimation
          />

          <ChartAxis
            type="bottom"
            scale={ xScale }
            transform={ `translate(0, ${ innerHeight })` }
            ticks={ isMobile ? 4 : 8 }
            tickFormatGenerator={ xAxisTickFormatter }
            anchorEl={ overlayRef.current }
            noAnimation
          />

          <ChartArea
            id="block-operations-chart"
            data={ lineChartData }
            xScale={ xScale }
            yScale={ yScale }
            gradient={{ startColor: lineColor, stopColor: lineColor }}
            noAnimation
          />

          <ChartLine
            data={ lineChartData }
            xScale={ xScale }
            yScale={ yScale }
            stroke={ lineColor }
            animation="none"
            strokeWidth={ isMobile ? 1 : 2 }
          />

          <ChartOverlay ref={ overlayRef } width={ innerWidth } height={ innerHeight } onClick={ handleChartClick } onAuxClick={ handleChartAuxClick }>
            <ChartTooltip
              anchorEl={ overlayRef.current }
              width={ innerWidth }
              height={ innerHeight }
              xScale={ xScale }
              yScale={ yScale }
              data={ chartData }
              hideDateLabel={ false }
              dateLabelText="Block number"
              noAnimation
            />
          </ChartOverlay>
        </g>
      </svg>

      <ChartWatermarkIcon w="162px" h="60px"/>
    </Box>
  );
};

export default React.memo(BlockOperationsChart);
