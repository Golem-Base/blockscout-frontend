import { useToken } from '@chakra-ui/react';
import type * as d3 from 'd3';
import React from 'react';

import type { HistogramItem } from './HistogramBlockGasUsedChart';

interface Props {
  item: HistogramItem;
  index: number;
  xScale: d3.ScaleBand<string>;
  yScale: d3.ScaleLinear<number, number>;
  innerHeight: number;
  isHovered: boolean;
  onMouseEnter: (index: number, event: React.MouseEvent<SVGRectElement>) => void;
  onMouseLeave: () => void;
}

const HistogramBlockGasUsedChartBar = ({
  item,
  index,
  xScale,
  yScale,
  innerHeight,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}: Props) => {
  const x = xScale(String(index)) || 0;
  const barWidth = xScale.bandwidth();

  const [ barColorLight, barColor, barHoverColorLight, barHoverColor ] = useToken('colors', [
    'blue.200',
    'blue.400',
    'blue.300',
    'blue.500',
  ]);

  const gasUsed = Number(item.gas_used) || item.value || 0;

  const barY = yScale(gasUsed);
  const calculatedBarHeight = innerHeight - barY;

  const MIN_BAR_HEIGHT = 2;
  const barHeight = Math.max(calculatedBarHeight, MIN_BAR_HEIGHT);
  const adjustedBarY = calculatedBarHeight < MIN_BAR_HEIGHT ? innerHeight - MIN_BAR_HEIGHT : barY;
  const isMinHeight = calculatedBarHeight < MIN_BAR_HEIGHT;

  const gradientId = `gas-bar-gradient-${ index }`;
  const gradientHoverId = `gas-bar-gradient-hover-${ index }`;

  const handleMouseEnter = React.useCallback((e: React.MouseEvent<SVGRectElement>) => {
    onMouseEnter(index, e);
  }, [ index, onMouseEnter ]);

  return (
    <>
      <defs>
        <linearGradient id={ gradientId } x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={ barColorLight } stopOpacity={ 0.8 }/>
          <stop offset="100%" stopColor={ barColor } stopOpacity={ 1 }/>
        </linearGradient>
        <linearGradient id={ gradientHoverId } x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={ barHoverColorLight } stopOpacity={ 0.8 }/>
          <stop offset="100%" stopColor={ barHoverColor } stopOpacity={ 1 }/>
        </linearGradient>
      </defs>

      <rect
        x={ x }
        y={ adjustedBarY }
        width={ barWidth }
        height={ barHeight }
        fill={ `url(#${ isHovered ? gradientHoverId : gradientId })` }
        stroke={ barColor }
        strokeWidth={ isMinHeight ? 0.5 : 0 }
        opacity={ isMinHeight ? 0.7 : 1 }
        rx={ 2 }
        style={{ cursor: 'pointer', transition: 'fill 0.2s ease, opacity 0.2s ease' }}
        onMouseEnter={ handleMouseEnter }
        onMouseLeave={ onMouseLeave }
      />
    </>
  );
};

export default React.memo(HistogramBlockGasUsedChartBar);
