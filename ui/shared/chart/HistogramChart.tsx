import { Box, Flex, Text, useToken } from '@chakra-ui/react';
import * as d3 from 'd3';
import React from 'react';

import useClientRect from 'lib/hooks/useClientRect';

import ChartAxis from './ChartAxis';
import ChartGridLine from './ChartGridLine';
import HistogramChartBar from './HistogramChartBar';

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

const HistogramChart = ({ items, height = DEFAULT_HEIGHT }: Props) => {
  const [ rect, ref ] = useClientRect<SVGSVGElement>();
  const [ hoveredIndex, setHoveredIndex ] = React.useState<number | null>(null);
  const [ tooltipData, setTooltipData ] = React.useState<{ x: number; y: number; label: string; value: number } | null>(null);

  const [ tooltipBg ] = useToken('colors', [ 'blackAlpha.900' ]);
  const [ labelColor ] = useToken('colors', [ 'blue.100' ]);

  const margin = getMargin(true);

  const innerWidth = rect ? Math.max(rect.width - margin.left - margin.right, 0) : 0;
  const innerHeight = Math.max(height - margin.top - margin.bottom, 0);

  const xScale = React.useMemo(() => d3.scaleBand()
    .domain(items.map((_, i) => String(i)))
    .range([ 0, innerWidth ])
    .padding(0.65), [ items, innerWidth ]);

  const yScale = React.useMemo(() => d3.scaleLinear()
    .domain([ 0, d3.max(items, (d) => d.value) || 0 ])
    .range([ innerHeight, 0 ])
    .nice(), [ items, innerHeight ]);

  const xAxisTickFormatter = React.useCallback(() => (domainValue: d3.AxisDomain) => {
    const index = Number(domainValue);
    return items[index]?.label || '';
  }, [ items ]);

  const handleBarMouseEnter = React.useCallback((index: number, event: React.MouseEvent<SVGRectElement>) => {
    setHoveredIndex(index);
    const barRect = event.currentTarget.getBoundingClientRect();
    if (rect) {
      const x = barRect.left - rect.left + barRect.width / 2;
      const y = barRect.top - rect.top;
      setTooltipData({ x, y, label: items[index].label, value: items[index].value });
    }
  }, [ items, rect ]);

  const handleBarMouseLeave = React.useCallback(() => {
    setHoveredIndex(null);
    setTooltipData(null);
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
        style={{ display: 'block' }}
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
            noAnimation
          />

          { items.map((item, index) => (
            <HistogramChartBar
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

          <ChartAxis
            type="bottom"
            scale={ xScale as unknown as d3.ScaleLinear<number, number> }
            transform={ `translate(0, ${ innerHeight })` }
            ticks={ items.length }
            tickFormatGenerator={ xAxisTickFormatter }
            noAnimation
            isMobile
          />
        </g>
      </svg>

      { tooltipData && (
        <Box
          position="absolute"
          left={ `${ tooltipData.x }px` }
          top={ `${ tooltipData.y - 50 }px` }
          transform="translateX(-50%)"
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
          <Flex gap={ 2 } mb="2px">
            <Text color={ labelColor } minW="80px">
              Size range
            </Text>
            <Text whiteSpace="nowrap">
              { tooltipData.label }
            </Text>
          </Flex>
          <Flex gap={ 2 }>
            <Text color={ labelColor } minW="80px">
              Entities
            </Text>
            <Text whiteSpace="nowrap">
              { tooltipData.value.toLocaleString() }
            </Text>
          </Flex>
        </Box>
      ) }
    </Box>
  );
};

export default React.memo(HistogramChart);
