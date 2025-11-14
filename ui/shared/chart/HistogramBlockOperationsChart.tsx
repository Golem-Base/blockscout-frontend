import { Box, Flex, Text, useToken } from '@chakra-ui/react';
import * as d3 from 'd3';
import React from 'react';

import useClientRect from 'lib/hooks/useClientRect';
import useIsMobile from 'lib/hooks/useIsMobile';

import ChartAxis from './ChartAxis';
import ChartGridLine from './ChartGridLine';
import type { OperationTypeCount } from './HistogramBlockOperationsChartBar';
import HistogramBlockOperationsChartBar from './HistogramBlockOperationsChartBar';

export interface HistogramItem {
  label: string;
  value: number;
  create_count?: string;
  update_count?: string;
  extend_count?: string;
  delete_count?: string;
  block_number?: string;
}

interface Props {
  items: Array<HistogramItem>;
  height?: number;
  visibleOperations: Array<OperationTypeCount>;
}

interface TooltipData {
  x: number;
  y: number;
  label: string;
  value: number;
  create: number;
  update: number;
  extend: number;
  'delete': number;
}

type UseTokenTokensAttribute = Parameters<typeof useToken>[1];

const getMargin = (isMobile?: boolean) => ({ top: 10, right: 10, bottom: isMobile ? 80 : 25, left: 50 });
const DEFAULT_HEIGHT = 300;
const colorTokens: UseTokenTokensAttribute = [ 'blackAlpha.900', 'blue.100', 'green.400', 'blue.400', 'orange.400', 'red.400' ];

const HistogramBlockOperationsChart = ({ items, height = DEFAULT_HEIGHT, visibleOperations }: Props) => {
  const [ rect, ref ] = useClientRect<SVGSVGElement>();
  const [ hoveredIndex, setHoveredIndex ] = React.useState<number>();
  const [ tooltipData, setTooltipData ] = React.useState<TooltipData>();
  const isMobile = useIsMobile();

  const [
    tooltipBg,
    labelColor,
    createColor,
    updateColor,
    extendColor,
    deleteColor,
  ] = useToken('colors', colorTokens);

  const margin = getMargin(isMobile);

  const innerWidth = rect ? Math.max(rect.width - margin.left - margin.right, 0) : 0;
  const innerHeight = Math.max(height - margin.top - margin.bottom, 0);

  const xScale = React.useMemo(() => d3.scaleBand()
    .domain(items.map((_, i) => String(i)))
    .range([ 0, innerWidth ])
    .padding(0.6), [ items, innerWidth ]);

  const yScale = React.useMemo(() => d3.scaleLinear()
    .domain([ 0, d3.max(items, (d) => d.value) || 0 ])
    .range([ innerHeight, 0 ])
    .nice(), [ items, innerHeight ]);

  const handleBarMouseEnter = React.useCallback((index: number, event: React.MouseEvent<SVGRectElement>) => {
    setHoveredIndex(index);
    const barRect = event.currentTarget.getBoundingClientRect();

    if (rect) {
      const x = barRect.left - rect.left + barRect.width / 2;
      const y = barRect.top - rect.top;
      const item = items[index] as HistogramItem & {
        create_count?: string;
        update_count?: string;
        extend_count?: string;
        delete_count?: string;
      };

      const totalOfVisibleOperations = visibleOperations.reduce((acc, operation) => {
        acc += Number(item[operation]) || 0;
        return acc;
      }, 0);

      setTooltipData({
        x,
        y,
        label: item.label,
        create: Number(item.create_count) || 0,
        update: Number(item.update_count) || 0,
        extend: Number(item.extend_count) || 0,
        'delete': Number(item.delete_count) || 0,
        value: totalOfVisibleOperations,
      });
    }
  }, [ items, rect, visibleOperations ]);

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
            noAnimation
          />

          { items.map((item, index) => (
            <HistogramBlockOperationsChartBar
              key={ index }
              item={ item }
              index={ index }
              xScale={ xScale }
              yScale={ yScale }
              innerHeight={ innerHeight }
              isHovered={ hoveredIndex === index }
              onMouseEnter={ handleBarMouseEnter }
              onMouseLeave={ handleBarMouseLeave }
              visibleOperations={ visibleOperations }
            />
          )) }
        </g>
      </svg>

      { tooltipData && (
        <Box
          position="absolute"
          left={ `${ tooltipData.x }px` }
          top="-50%"
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
          <Flex gap={ 2 } mb="8px" pb="6px" borderBottom="1px solid rgba(255,255,255,0.1)">
            <Text color={ labelColor } minW="80px">
              Block
            </Text>
            <Text whiteSpace="nowrap" fontWeight={ 600 }>
              { tooltipData.label }
            </Text>
          </Flex>

          {
            visibleOperations.includes('create_count') && (
              <Flex gap={ 2 } mb="2px">
                <Text color={ createColor } minW="80px">
                  Create
                </Text>
                <Text whiteSpace="nowrap">
                  { tooltipData.create?.toLocaleString() }
                </Text>
              </Flex>
            )
          }

          {
            visibleOperations.includes('update_count') && (
              <Flex gap={ 2 } mb="2px">
                <Text color={ updateColor } minW="80px">
                  Update
                </Text>
                <Text whiteSpace="nowrap">
                  { tooltipData.update.toLocaleString() }
                </Text>
              </Flex>
            )
          }

          {
            visibleOperations.includes('extend_count') && (
              <Flex gap={ 2 } mb="2px">
                <Text color={ extendColor } minW="80px">
                  Extend
                </Text>
                <Text whiteSpace="nowrap">
                  { tooltipData.extend.toLocaleString() }
                </Text>
              </Flex>
            )
          }

          {
            visibleOperations.includes('delete_count') && (
              <Flex gap={ 2 } mb="2px">
                <Text color={ deleteColor } minW="80px">
                  Delete
                </Text>
                <Text whiteSpace="nowrap">
                  { tooltipData.delete.toLocaleString() }
                </Text>
              </Flex>
            )
          }

          <Flex gap={ 2 } mt="6px" pt="6px" borderTop="1px solid rgba(255,255,255,0.1)">
            <Text color={ labelColor } minW="80px">
              Total
            </Text>
            <Text whiteSpace="nowrap" fontWeight={ 600 }>
              { tooltipData.value.toLocaleString() }
            </Text>
          </Flex>
        </Box>
      ) }
    </Box>
  );
};

export default React.memo(HistogramBlockOperationsChart);
