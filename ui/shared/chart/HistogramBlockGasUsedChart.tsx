import { Box, useToken } from '@chakra-ui/react';
import * as d3 from 'd3';
import React from 'react';

import type { TimeChartData, TimeChartItem } from 'ui/shared/chart/types';

import useClientRect from 'lib/hooks/useClientRect';
import useIsMobile from 'lib/hooks/useIsMobile';

import ChartArea from './ChartArea';
import ChartAxis from './ChartAxis';
import ChartGridLine from './ChartGridLine';
import ChartLine from './ChartLine';
import ChartOverlay from './ChartOverlay';
import ChartTooltip from './ChartTooltip';
import useChartBlockNavigation from './hooks/useChartBlockNavigation';

export interface HistogramItem {
  label: string;
  value: number;
  gas_used?: string;
  gas_limit?: string;
  gas_usage_percentage?: string;
  block_number?: string;
}

interface Props {
  items: Array<HistogramItem>;
  height?: number;
}

type UseTokenTokensAttribute = Parameters<typeof useToken>[1];

const getMargin = (isMobile?: boolean) => ({ top: 10, right: 10, bottom: isMobile ? 80 : 25, left: 50 });
const DEFAULT_HEIGHT = 300;
const colorTokens: UseTokenTokensAttribute = [ 'blue.200' ];
const baseDate = new Date(0);

const HistogramBlockGasUsedChart = ({ items, height = DEFAULT_HEIGHT }: Props) => {
  const [ rect, ref ] = useClientRect<SVGSVGElement>();
  const isMobile = useIsMobile();
  const overlayRef = React.useRef<SVGRectElement | null>(null);

  const [
    lineColor,
  ] = useToken('colors', colorTokens);

  const margin = getMargin(isMobile);

  const innerWidth = rect ? Math.max(rect.width - margin.left - margin.right, 0) : 0;
  const innerHeight = Math.max(height - margin.top - margin.bottom, 0);

  const lineChartData: Array<TimeChartItem> = React.useMemo(() => {
    return items.map((item, index) => ({
      date: new Date(baseDate.getTime() + index),
      value: Number(item.gas_used) || item.value || 0,
      dateLabel: item.label,
    }));
  }, [ items ]);

  const gasLimitChartData: Array<TimeChartItem> = React.useMemo(() => {
    const gasLimitValue = items[0]?.gas_limit ? Number(items[0].gas_limit) : 0;
    return items.map((item, index) => ({
      date: new Date(baseDate.getTime() + index),
      value: gasLimitValue,
      dateLabel: item.label,
    }));
  }, [ items ]);

  const blockUtilizationChartData: Array<TimeChartItem> = React.useMemo(() => {
    const gasLimitValue = items[0]?.gas_limit ? Number(items[0].gas_limit) : 0;
    return items.map((item, index) => {
      const gasUsed = Number(item.gas_used) || item.value || 0;
      const utilization = gasLimitValue > 0 ? (gasUsed / gasLimitValue) * 100 : 0;
      return {
        date: new Date(baseDate.getTime() + index),
        value: utilization,
        dateLabel: item.label,
      };
    });
  }, [ items ]);

  const blockNumberChartData: Array<TimeChartItem> = React.useMemo(() => {
    return items.map((item, index) => ({
      date: new Date(baseDate.getTime() + index),
      value: Number(item.block_number) || Number(item.label) || 0,
      dateLabel: item.label,
    }));
  }, [ items ]);

  const chartData: TimeChartData = React.useMemo(() => {
    const series = [
      {
        items: blockNumberChartData,
        name: 'Block number',
        color: lineColor,
        valueFormatter: (value: number) => value.toLocaleString(),
      },
      {
        items: lineChartData,
        name: 'Gas used',
        color: lineColor,
        valueFormatter: (value: number) => value.toLocaleString(),
      } ];

    if (items[0]?.gas_limit) {
      series.push({
        items: gasLimitChartData,
        name: 'Gas limit',
        color: lineColor,
        valueFormatter: (value: number) => value.toLocaleString(),
      });
      series.push({
        items: blockUtilizationChartData,
        name: 'Block utilization',
        color: lineColor,
        valueFormatter: (value: number) => `${ value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }%`,
      });
    }

    return series;
  }, [ blockNumberChartData, lineColor, lineChartData, items, gasLimitChartData, blockUtilizationChartData ]);

  const xScale = React.useMemo(() => {
    if (items.length === 0) {
      return d3.scaleTime().domain([ new Date(0), new Date(1) ]).range([ 0, innerWidth ]);
    }
    return d3.scaleTime()
      .domain([ baseDate, new Date(baseDate.getTime() + items.length - 1) ])
      .range([ 0, innerWidth ])
      .nice();
  }, [ items.length, innerWidth ]);

  const yScale = React.useMemo(() => {
    if (items.length === 0) {
      return d3.scaleLinear().domain([ 0, 1 ]).range([ innerHeight, 0 ]);
    }

    const minGasUsed = d3.min(items, (d) => Number(d.gas_used) || d.value || 0) || 0;
    const maxGasUsedValue = d3.max(items, (d) => Number(d.gas_used) || d.value || 0) || 0;
    const maxValue = maxGasUsedValue;

    if (minGasUsed === maxValue) {
      const padding = maxValue * 0.1 || 1;
      return d3.scaleLinear()
        .domain([ Math.max(0, maxValue - padding), maxValue + padding ])
        .range([ innerHeight, 0 ]);
    }

    const dataRange = maxValue - minGasUsed;
    const bottomMargin = dataRange * 0.1;
    const topMargin = dataRange * 0.05;

    const domainMin = Math.max(0, minGasUsed - bottomMargin);
    const domainMax = maxValue + topMargin;

    const scale = d3.scaleLinear()
      .domain([ domainMin, domainMax ])
      .range([ innerHeight, 0 ]);

    return scale;
  }, [ items, innerHeight ]);

  const yAxisTickFormatter = React.useCallback(() => {
    return (d: d3.AxisDomain) => {
      const num = Number(d);
      return num.toLocaleString(undefined, {
        notation: 'compact',
        maximumFractionDigits: 1,
        maximumSignificantDigits: 3,
      });
    };
  }, []);

  const xAxisTickFormatter = React.useCallback(() => {
    return (d: d3.AxisDomain) => {
      const date = d as Date;
      const baseDate = new Date(0);
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
            ticks={ 5 }
            size={ innerWidth }
            noAnimation
          />

          <ChartAxis
            type="left"
            scale={ yScale }
            ticks={ 5 }
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
            data={ lineChartData }
            xScale={ xScale }
            yScale={ yScale }
            color={ lineColor }
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

          <ChartOverlay
            ref={ overlayRef }
            width={ innerWidth }
            height={ innerHeight }
            onClick={ handleChartClick }
            onAuxClick={ handleChartAuxClick }
          >
            <ChartTooltip
              anchorEl={ overlayRef.current }
              width={ innerWidth }
              height={ innerHeight }
              xScale={ xScale }
              yScale={ yScale }
              data={ chartData }
              hideDateLabel
              noAnimation
            />
          </ChartOverlay>
        </g>
      </svg>
    </Box>
  );
};

export default React.memo(HistogramBlockGasUsedChart);
