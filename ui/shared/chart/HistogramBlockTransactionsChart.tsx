import { Box, Text, useToken } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import * as d3 from 'd3';
import React from 'react';

import useClientRect from 'lib/hooks/useClientRect';
import useIsMobile from 'lib/hooks/useIsMobile';

import ChartAxis from './ChartAxis';
import ChartGridLine from './ChartGridLine';
import HistogramBlockTransactionsChartBar from './HistogramBlockTransactionsChartBar';

export interface HistogramItem {
  label: string;
  value: number;
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
}

type UseTokenTokensAttribute = Parameters<typeof useToken>[1];

const getMargin = (isMobile?: boolean) => ({ top: 10, right: 10, bottom: isMobile ? 80 : 25, left: 50 });
const DEFAULT_HEIGHT = 300;
const colorTokens: UseTokenTokensAttribute = [ 'blackAlpha.900', 'blue.100' ];

const HistogramBlockTransactionsChart = ({ items, height = DEFAULT_HEIGHT }: Props) => {
  const [ rect, ref ] = useClientRect<SVGSVGElement>();
  const [ hoveredIndex, setHoveredIndex ] = React.useState<number>();
  const [ tooltipData, setTooltipData ] = React.useState<TooltipData>();
  const isMobile = useIsMobile();

  const [
    tooltipBg,
    labelColor,
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
      const item = items[index] as HistogramItem;

      setTooltipData({
        x,
        y,
        label: item.label,
        value: item.value,
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
            noAnimation
          />

          { items.map((item, index) => (
            <HistogramBlockTransactionsChartBar
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
            <Text color={ labelColor }>
              Transactions count
            </Text>
            <Text whiteSpace="nowrap" textAlign="right">
              { BigNumber(tooltipData.value).toFormat() }
            </Text>
          </Box>
        </Box>
      ) }
    </Box>
  );
};

export default React.memo(HistogramBlockTransactionsChart);
