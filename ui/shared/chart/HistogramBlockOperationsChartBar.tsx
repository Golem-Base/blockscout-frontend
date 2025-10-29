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
  visibleOperations: Array<OperationTypeCount>;
}

export type OperationTypeCount = 'create_count' | 'update_count' | 'extend_count' | 'delete_count';

interface OperationConfig {
  key: OperationTypeCount;
  colorLight: string;
  color: string;
  hoverColorLight: string;
  hoverColor: string;
}

const OPERATIONS: Array<OperationConfig> = [
  {
    key: 'create_count',
    colorLight: 'green.200',
    color: 'green.400',
    hoverColorLight: 'green.300',
    hoverColor: 'green.500',
  },
  {
    key: 'update_count',
    colorLight: 'blue.200',
    color: 'blue.400',
    hoverColorLight: 'blue.300',
    hoverColor: 'blue.500',
  },
  {
    key: 'extend_count',
    colorLight: 'orange.200',
    color: 'orange.400',
    hoverColorLight: 'orange.300',
    hoverColor: 'orange.500',
  },
  {
    key: 'delete_count',
    colorLight: 'red.200',
    color: 'red.400',
    hoverColorLight: 'red.300',
    hoverColor: 'red.500',
  },
];

const HistogramBlockOperationsChartBar = ({
  item,
  index,
  xScale,
  yScale,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  visibleOperations,
}: Props) => {
  const x = xScale(String(index)) || 0;
  const barWidth = xScale.bandwidth();

  const createColors = useToken('colors', [ 'green.200', 'green.400', 'green.300', 'green.500' ]);
  const updateColors = useToken('colors', [ 'blue.200', 'blue.400', 'blue.300', 'blue.500' ]);
  const extendColors = useToken('colors', [ 'orange.200', 'orange.400', 'orange.300', 'orange.500' ]);
  const deleteColors = useToken('colors', [ 'red.200', 'red.400', 'red.300', 'red.500' ]);

  const colorMap = {
    create_count: createColors,
    update_count: updateColors,
    extend_count: extendColors,
    delete_count: deleteColors,
  };

  let cumulativeValue = 0;
  const segments = OPERATIONS.filter(operation => visibleOperations.includes(operation.key)).map((operation) => {
    const itemWithCounts = item as HistogramItem & Record<OperationTypeCount, string>;
    const value = Number(itemWithCounts[operation.key]) || 0;
    const segmentStart = cumulativeValue;
    cumulativeValue += value;

    return {
      operation,
      value,
      segmentStart,
      segmentEnd: cumulativeValue,
    };
  }).filter(segment => segment.value > 0);

  const handleMouseEnter = React.useCallback((e: React.MouseEvent<SVGRectElement>) => {
    onMouseEnter(index, e);
  }, [ index, onMouseEnter ]);

  return (
    <>
      <defs>
        { segments.map(({ operation }) => {
          const colors = colorMap[operation.key];
          const [ colorLight, color, hoverColorLight, hoverColor ] = colors;
          const gradientId = `bar-gradient-${ operation.key }-${ index }`;
          const gradientHoverId = `bar-gradient-hover-${ operation.key }-${ index }`;

          return (
            <React.Fragment key={ operation.key }>
              <linearGradient id={ gradientId } x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={ colorLight } stopOpacity={ 0.8 }/>
                <stop offset="100%" stopColor={ color } stopOpacity={ 1 }/>
              </linearGradient>
              <linearGradient id={ gradientHoverId } x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={ hoverColorLight } stopOpacity={ 0.8 }/>
                <stop offset="100%" stopColor={ hoverColor } stopOpacity={ 1 }/>
              </linearGradient>
            </React.Fragment>
          );
        }) }
      </defs>

      { segments.map(({ operation, segmentStart, segmentEnd }, segmentIndex) => {
        const y = yScale(segmentEnd);
        const segmentHeight = yScale(segmentStart) - yScale(segmentEnd);
        const gradientId = `bar-gradient-${ operation.key }-${ index }`;
        const gradientHoverId = `bar-gradient-hover-${ operation.key }-${ index }`;

        return (
          <rect
            key={ `${ index }-${ operation.key }` }
            x={ x }
            y={ y }
            width={ barWidth }
            height={ segmentHeight }
            fill={ `url(#${ isHovered ? gradientHoverId : gradientId })` }
            rx={ segmentIndex === 0 ? 2 : 0 }
            style={{ cursor: 'pointer', transition: 'fill 0.2s ease' }}
            onMouseEnter={ handleMouseEnter }
            onMouseLeave={ onMouseLeave }
          />
        );
      }) }
    </>
  );
};

export default React.memo(HistogramBlockOperationsChartBar);
