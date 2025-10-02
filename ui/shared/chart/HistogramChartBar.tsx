import { useToken } from '@chakra-ui/react';
import type * as d3 from 'd3';
import React from 'react';

import type { HistogramItem } from './HistogramChart';

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

const HistogramChartBar = ({
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
  const barHeight = innerHeight - yScale(item.value);
  const y = yScale(item.value);

  const [ barColor ] = useToken('colors', [ 'blue.200' ]);
  const [ barColorLight ] = useToken('colors', [ 'blue.100' ]);
  const [ barHoverColor ] = useToken('colors', [ 'blue.300' ]);
  const [ barHoverColorLight ] = useToken('colors', [ 'blue.200' ]);

  const gradientId = `bar-gradient-${ index }`;
  const gradientHoverId = `bar-gradient-hover-${ index }`;

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
        y={ y }
        width={ barWidth }
        height={ barHeight }
        fill={ `url(#${ isHovered ? gradientHoverId : gradientId })` }
        rx={ 2 }
        style={{ cursor: 'pointer', transition: 'fill 0.2s ease' }}
        onMouseEnter={ handleMouseEnter }
        onMouseLeave={ onMouseLeave }
      />
    </>
  );
};

export default React.memo(HistogramChartBar);
