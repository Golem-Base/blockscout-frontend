import { Box, useToken } from '@chakra-ui/react';
import * as d3 from 'd3';
import React from 'react';

import type { TimeChartData, TimeChartItem } from 'ui/shared/chart/types';

import useIsMobile from 'lib/hooks/useIsMobile';
import { ChartArea } from 'toolkit/components/charts/parts/ChartArea';
import { ChartAxis } from 'toolkit/components/charts/parts/ChartAxis';
import { ChartGridLine } from 'toolkit/components/charts/parts/ChartGridLine';
import { ChartLine } from 'toolkit/components/charts/parts/ChartLine';
import { ChartOverlay } from 'toolkit/components/charts/parts/ChartOverlay';
import { ChartTooltip } from 'toolkit/components/charts/parts/ChartTooltip';
import { ChartWatermark as ChartWatermarkIcon } from 'toolkit/components/charts/parts/ChartWatermark';
import { useClientRect } from 'toolkit/hooks/useClientRect';

import useChartBlockNavigation from './hooks/useChartBlockNavigation';

export interface HistogramItem {
  label: string;
  value: number;
}

interface Props {
  items: Array<HistogramItem>;
  height?: number;
}

const getMargin = (isMobile?: boolean) => ({ top: 10, right: 10, bottom: isMobile ? 80 : 25, left: 50 });
const DEFAULT_HEIGHT = 300;
const baseDate = new Date(0);

const BlockTransactionsChart = ({ items, height = DEFAULT_HEIGHT }: Props) => {
  const [ rect, ref ] = useClientRect<SVGSVGElement>();
  const isMobile = useIsMobile();
  const [ color ] = useToken('colors', 'blue.200');
  const overlayRef = React.useRef<SVGRectElement>(null);

  const margin = getMargin(isMobile);

  const innerWidth = rect ? Math.max(rect.width - margin.left - margin.right, 0) : 0;
  const innerHeight = Math.max(height - margin.top - margin.bottom, 0);

  const chartData: Array<TimeChartItem> = React.useMemo(() => {
    return items.map((item, index) => ({
      date: new Date(baseDate.getTime() + index),
      value: item.value,
      dateLabel: item.label,
    }));
  }, [ items ]);

  const chartDataFormatted: TimeChartData = React.useMemo(() => {
    return [ {
      items: chartData,
      name: 'Block number',
      color,
      valueFormatter: (value: number) => value.toLocaleString(),
    },
    {
      items: chartData,
      name: 'Transactions count',
      color,
      valueFormatter: (value: number) => value.toLocaleString(),
    } ];
  }, [ chartData, color ]);

  const xScale = React.useMemo(() => {
    if (items.length === 0) {
      return d3.scaleTime().domain([ new Date(0), new Date(1) ]).range([ 0, innerWidth ]);
    }
    return d3.scaleTime()
      .domain([ baseDate, new Date(baseDate.getTime() + items.length - 1) ])
      .range([ 0, innerWidth ])
      .nice();
  }, [ items.length, innerWidth ]);

  const xTickFormat = React.useCallback(() => {
    return (domainValue: d3.AxisDomain) => {
      const dateValue = domainValue as Date;
      const index = Math.round(dateValue.getTime() - baseDate.getTime());
      return items[index]?.label ?? '';
    };
  }, [ items ]);

  const yTickFormat = React.useCallback(() => {
    return (domainValue: d3.AxisDomain) => {
      const value = domainValue as number;
      return Number.isInteger(value) ? value.toString() : '';
    };
  }, []);

  const yScale = React.useMemo(() => {
    if (items.length === 0) {
      return d3.scaleLinear().domain([ 0, 0 ]).range([ innerHeight, 0 ]);
    }
    const maxValue = d3.max(items, (d) => d.value) || 0;
    const minValue = d3.min(items, (d) => d.value) || 0;
    const domainMax = maxValue === minValue && maxValue > 0 ? maxValue * 2 : maxValue;

    return d3.scaleLinear()
      .domain([ 0, domainMax ])
      .range([ innerHeight, 0 ])
      .nice();
  }, [ items, innerHeight ]);

  const { handleChartClick, handleChartAuxClick } = useChartBlockNavigation({
    overlayRef,
    items,
    xScale,
    baseDate,
    getBlockIdentifier: (item) => item.label,
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
            ticks={ 5 }
            size={ innerWidth }
            noAnimation
          />

          <ChartArea
            id="block-transactions-chart"
            data={ chartData }
            gradient={{ startColor: color, stopColor: color }}
            xScale={ xScale }
            yScale={ yScale }
            noAnimation
          />

          <ChartLine
            data={ chartData }
            xScale={ xScale }
            yScale={ yScale }
            stroke={ color }
            animation="none"
            strokeWidth={ isMobile ? 1 : 2 }
          />

          <ChartAxis
            type="left"
            scale={ yScale }
            ticks={ 4 }
            tickFormatGenerator={ yTickFormat }
            noAnimation
          />

          <ChartAxis
            type="bottom"
            scale={ xScale }
            transform={ `translate(0, ${ innerHeight })` }
            ticks={ isMobile ? 4 : 6 }
            tickFormatGenerator={ xTickFormat }
            noAnimation
          />

          <ChartOverlay ref={ overlayRef } width={ innerWidth } height={ innerHeight } onAuxClick={ handleChartAuxClick } onClick={ handleChartClick }>
            <ChartTooltip
              anchorEl={ overlayRef.current }
              width={ innerWidth }
              height={ innerHeight }
              xScale={ xScale }
              yScale={ yScale }
              data={ chartDataFormatted }
              noAnimation
              hideDateLabel
            />
          </ChartOverlay>
        </g>
      </svg>

      <ChartWatermarkIcon w="162px" h="60px"/>
    </Box>
  );
};

export default React.memo(BlockTransactionsChart);
