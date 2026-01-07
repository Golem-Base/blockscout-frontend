import { Box, Flex, Text, useToken } from '@chakra-ui/react';
import * as d3 from 'd3';
import { clamp } from 'es-toolkit';
import React from 'react';

import useClientRect from 'lib/hooks/useClientRect';

import ChartAxis from './ChartAxis';
import ChartGridLine from './ChartGridLine';
import ChartWatermarkIcon from './ChartWatermarkIcon';
import HistogramChartBar from './HistogramChartBar';

export interface HistogramItem {
  label: string;
  value: number;
}

interface Props {
  items: Array<HistogramItem>;
  height?: number;
}

const margin = ({ top: 10, right: 10, bottom: 80, left: 50 });
const DEFAULT_HEIGHT = 300;
const TOOLTIP_OFFSET = 16;
const TOOLTIP_TOP_OFFSET = 8;

interface CalculatePositionParams {
  pointX: number;
  pointY: number;
  offset: number;
  nodeWidth: number;
  nodeHeight: number;
  canvasWidth: number;
  canvasHeight: number;
}

function calculatePosition({ pointX, pointY, canvasWidth, canvasHeight, nodeWidth, nodeHeight, offset }: CalculatePositionParams): [ number, number ] {
  const topOffset = TOOLTIP_TOP_OFFSET;

  if (pointX + offset + nodeWidth <= canvasWidth) {
    const x = pointX + offset;
    // const y = clamp(pointY - nodeHeight / 2, 0, canvasHeight - nodeHeight);
    const y = pointY;
    return [ x, y ];
  }

  if (nodeWidth + offset <= pointX) {
    const x = pointX - offset - nodeWidth;
    // const y = clamp(pointY - nodeHeight / 2, 0, canvasHeight - nodeHeight);
    const y = pointY;
    return [ x, y ];
  }

  if (nodeHeight + topOffset <= pointY) {
    const x = clamp(pointX - nodeWidth / 2, 0, canvasWidth - nodeWidth);
    // const y = pointY - topOffset - nodeHeight;
    const y = pointY;
    return [ x, y ];
  }

  if (pointY + offset + nodeHeight <= canvasHeight) {
    const x = clamp(pointX - nodeWidth / 2, 0, canvasWidth - nodeWidth);
    // const y = pointY + offset;
    const y = pointY;
    return [ x, y ];
  }

  const x = clamp(pointX / 2, 0, canvasWidth - nodeWidth);
  // const y = clamp(pointY / 2, 0, canvasHeight - nodeHeight);
  const y = pointY;

  return [ x, y ];
}

const HistogramChart = ({ items, height = DEFAULT_HEIGHT }: Props) => {
  const [ rect, ref ] = useClientRect<SVGSVGElement>();
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const [ hoveredIndex, setHoveredIndex ] = React.useState<number | null>(null);
  const [ tooltipData, setTooltipData ] = React.useState<{ x: number; y: number; label: string; value: number } | null>(null);
  const [ tooltipPosition, setTooltipPosition ] = React.useState<{ left: number; top: number } | null>(null);

  const [ tooltipBg ] = useToken('colors', [ 'blackAlpha.900' ]);
  const [ labelColor ] = useToken('colors', [ 'blue.100' ]);

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
      const barTopY = yScale(items[index].value);
      const y = margin.top + (barTopY / 2);
      setTooltipData({ x, y, label: items[index].label, value: items[index].value });
    }
  }, [ items, rect, yScale ]);

  const handleBarMouseLeave = React.useCallback(() => {
    setHoveredIndex(null);
    setTooltipData(null);
    setTooltipPosition(null);
  }, []);

  React.useLayoutEffect(() => {
    if (!tooltipData || !rect || !tooltipRef.current) {
      return;
    }

    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    if (tooltipRect.width > 0 && tooltipRect.height > 0) {
      const [ x, y ] = calculatePosition({
        pointX: tooltipData.x,
        pointY: tooltipData.y,
        canvasWidth: rect.width,
        canvasHeight: height,
        nodeWidth: tooltipRect.width,
        nodeHeight: tooltipRect.height,
        offset: TOOLTIP_OFFSET,
      });

      setTooltipPosition({ left: x, top: y });
    }
  }, [ tooltipData, rect, height ]);

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

      <ChartWatermarkIcon w="162px" h="60px"/>

      { tooltipData && (
        <Box
          ref={ tooltipRef }
          position="absolute"
          left={ tooltipPosition ? `${ tooltipPosition.left }px` : `${ tooltipData.x }px` }
          top={ tooltipPosition ? `${ tooltipPosition.top }px` : `${ tooltipData.y - 50 }px` }
          bg={ tooltipBg }
          borderRadius="12px"
          paddingX={ 3 }
          paddingY={ 2 }
          pointerEvents="none"
          zIndex={ 10 }
          fontSize="12px"
          fontWeight={ 500 }
          color="white"
          opacity={ tooltipPosition ? 1 : 0 }
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
