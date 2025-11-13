import { Box, Text, useToken } from '@chakra-ui/react';
import * as d3 from 'd3';
import React from 'react';

import useClientRect from 'lib/hooks/useClientRect';
import useIsMobile from 'lib/hooks/useIsMobile';

import ChartAxis from './ChartAxis';
import ChartGridLine from './ChartGridLine';
import HistogramBlockGasUsedChartBar from './HistogramBlockGasUsedChartBar';

export interface HistogramItem {
  label: string;
  value: number;
  gas_used?: string;
  gas_limit?: string;
  gas_usage_percentage?: string;
}

interface Props {
  items: Array<HistogramItem>;
  height?: number;
}

interface TooltipData {
  x: number;
  y: number;
  label: string;
  value: number;
  gas_used: number;
  gas_limit: number;
  gas_usage_percentage: number;
}

type UseTokenTokensAttribute = Parameters<typeof useToken>[1];

const getMargin = (isMobile?: boolean) => ({ top: 10, right: 10, bottom: isMobile ? 80 : 25, left: 50 });
const DEFAULT_HEIGHT = 300;
const colorTokens: UseTokenTokensAttribute = [ 'blackAlpha.900', 'blue.100', 'green.400', 'blue.400', 'orange.400', 'red.400' ];

const HistogramBlockGasUsedChart = ({ items, height = DEFAULT_HEIGHT }: Props) => {
  const [ rect, ref ] = useClientRect<SVGSVGElement>();
  const [ hoveredIndex, setHoveredIndex ] = React.useState<number>();
  const [ tooltipData, setTooltipData ] = React.useState<TooltipData>();
  const isMobile = useIsMobile();

  const [
    tooltipBg,
    labelColor,
    createColor,
    gasLimitLineColor,
  ] = useToken('colors', colorTokens);

  const margin = getMargin(isMobile);

  const innerWidth = rect ? Math.max(rect.width - margin.left - margin.right, 0) : 0;
  const innerHeight = Math.max(height - margin.top - margin.bottom, 0);

  const xScale = React.useMemo(() => d3.scaleBand()
    .domain(items.map((_, i) => String(i)))
    .range([ 0, innerWidth ])
    .padding(0.6), [ items, innerWidth ]);

  const yScale = React.useMemo(() => {
    if (items.length === 0) {
      return d3.scaleLinear().domain([ 0, 1 ]).range([ innerHeight, 0 ]);
    }

    const minGasUsed = d3.min(items, (d) => Number(d.gas_used) || d.value || 0) || 0;

    const maxGasUsedValue = d3.max(items, (d) => Number(d.gas_used) || d.value || 0) || 0;

    const gasLimit = items[0] ? Number(items[0].gas_limit) : 0;

    const maxValue = Math.max(maxGasUsedValue, gasLimit);

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

  const gasLimitValue = React.useMemo(() => {
    return items[0] ? Number(items[0].gas_limit) : 0;
  }, [ items ]);

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

  const handleBarMouseEnter = React.useCallback((index: number, event: React.MouseEvent<SVGRectElement>) => {
    setHoveredIndex(index);
    const barRect = event.currentTarget.getBoundingClientRect();

    if (rect) {
      const x = barRect.left - rect.left + barRect.width / 2;
      const y = barRect.top - rect.top;
      const item = items[index];

      setTooltipData({
        x,
        y,
        label: item.label,
        value: Number(item.gas_used),
        gas_used: Number(item.gas_used),
        gas_limit: Number(item.gas_limit),
        gas_usage_percentage: Number(item.gas_usage_percentage),
      });
    }
  }, [ items, rect ]);

  const handleBarMouseLeave = React.useCallback(() => {
    setHoveredIndex(undefined);
    setTooltipData(undefined);
  }, []);

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

          { items.map((item, index) => (
            <HistogramBlockGasUsedChartBar
              key={ index }
              item={ item }
              index={ index }
              xScale={ xScale }
              yScale={ yScale }
              innerHeight={ innerHeight }
              isHovered={ hoveredIndex === index }
              onMouseEnter={ handleBarMouseEnter }
              onMouseLeave={ handleBarMouseLeave }
            />
          )) }

          { gasLimitValue > 0 && (
            <>
              <line
                x1={ 0 }
                x2={ innerWidth }
                y1={ Math.max(yScale(gasLimitValue), -5) }
                y2={ Math.max(yScale(gasLimitValue), -5) }
                stroke={ gasLimitLineColor }
                strokeWidth={ 1.5 }
                strokeDasharray="6,4"
                opacity={ 0.6 }
              />
              <text
                x={ innerWidth - 5 }
                y={ Math.max(yScale(gasLimitValue) - 5, 10) }
                fontSize="10px"
                fill={ gasLimitLineColor }
                textAnchor="end"
                opacity={ 0.8 }
              >
                Gas Limit ({ gasLimitValue.toLocaleString() })
              </text>
            </>
          ) }
        </g>
      </svg>

      { tooltipData && (
        <Box
          position="absolute"
          left={ `${ tooltipData.x }px` }
          top={ `${ tooltipData.y - 80 }px` }
          transform="translate(-50%, 0%)"
          bg={ tooltipBg }
          borderRadius="12px"
          paddingX={ 3 }
          paddingY={ 2 }
          pointerEvents="none"
          zIndex={ 10 }
          fontSize="12px"
          fontWeight={ 500 }
          color="white"
        >
          <Box
            display="grid"
            gridTemplateColumns="auto 1fr"
            gap={ 2 }
            mb="8px"
            pb="6px"
            borderBottom="1px solid rgba(255,255,255,0.1)"
          >
            <Text color={ labelColor }>
              Block
            </Text>
            <Text whiteSpace="nowrap" fontWeight={ 600 } textAlign="right">
              { tooltipData.label }
            </Text>
          </Box>

          <Box display="grid" gridTemplateColumns="auto 1fr" gap={ 2 } rowGap="2px">
            <Text color={ createColor }>
              Gas limit
            </Text>
            <Text whiteSpace="nowrap" textAlign="right">
              { tooltipData.gas_limit?.toLocaleString() }
            </Text>

            <Text color={ createColor }>
              Gas usage percentage
            </Text>
            <Text whiteSpace="nowrap" textAlign="right">
              { tooltipData.gas_usage_percentage ?
                `${ (Number(tooltipData.gas_usage_percentage) * 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }%` :
                ''
              }
            </Text>

            <Text color={ createColor }>
              Gas used
            </Text>
            <Text whiteSpace="nowrap" textAlign="right">
              { tooltipData.gas_used?.toLocaleString() }
            </Text>
          </Box>
        </Box>
      ) }
    </Box>
  );
};

export default React.memo(HistogramBlockGasUsedChart);
