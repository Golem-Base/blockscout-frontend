import { useToken } from '@chakra-ui/react';
import * as d3 from 'd3';
import React from 'react';

import type { TimeChartData, TimeChartItem } from 'ui/shared/chart/types';

import { useColorModeValue } from 'toolkit/chakra/color-mode';

import { POINT_SIZE } from './utils';

const ChartTooltipPoint = () => {
  const bgColor = useToken('colors', useColorModeValue('black', 'white'));
  const borderColor = useToken('colors', useColorModeValue('white', 'black'));

  return (
    <circle
      className="ChartTooltip__point"
      r={ POINT_SIZE / 2 }
      opacity={ 1 }
      fill={ bgColor[0] }
      stroke={ borderColor[0] }
      strokeWidth={ 4 }
    />
  );
};

export default React.memo(ChartTooltipPoint);

interface UseRenderPointsParams {
  data: TimeChartData;
  xScale: d3.ScaleTime<number, number>;
  yScale: d3.ScaleLinear<number, number>;
}

export interface CurrentPoint {
  datumIndex: number;
  item: TimeChartItem;
}

interface RenderPointsReturnType {
  x: number;
  y: number;
  currentPoints: Array<CurrentPoint>;
}

type BisectDate = (array: ArrayLike<TimeChartItem>, x: unknown, lo?: number | undefined, hi?: number | undefined) => number;

interface GetMaxValuePointParams {
  bisectDate: BisectDate;
  xDate: Date;
}

const getChartItem = ({
  datum,
  bisectDate,
  xDate,
}: {
  datum: TimeChartData[number];
  bisectDate: BisectDate;
  xDate: Date;
}): TimeChartItem | undefined => {
  const index = bisectDate(datum.items, xDate, 1);
  const d0 = datum.items[index - 1] as TimeChartItem | undefined;
  const d1 = datum.items[index] as TimeChartItem | undefined;

  if (!d0) {
    return d1;
  }
  if (!d1) {
    return d0;
  }
  return xDate.getTime() - d0.date.getTime() > d1.date.getTime() - xDate.getTime() ? d1 : d0;
};

export function useRenderPoints(ref: React.RefObject<SVGGElement | null>, params: UseRenderPointsParams) {
  const getMaxValuePoint = React.useCallback(({ bisectDate, xDate }: GetMaxValuePointParams) => {
    const values = d3.select(ref.current)
      .selectAll('.ChartTooltip__point')
      .nodes().map((_, elementIndex) => {
        const datum = params.data[elementIndex];
        const d = getChartItem({ datum, bisectDate, xDate });

        return d?.value ?? 0;
      });

    return values.length ? Math.max(...values) : 0;
  }, [ params.data, ref ]);

  return React.useCallback((x: number): RenderPointsReturnType => {
    const xDate = params.xScale.invert(x);
    const bisectDate = d3.bisector<TimeChartItem, unknown>((d) => d.date).left;
    let baseXPos = 0;
    let baseYPos = 0;
    const currentPoints: Array<CurrentPoint> = [];

    const maxValuePoint = getMaxValuePoint({ bisectDate, xDate });

    d3.select(ref.current)
      .selectAll('.ChartTooltip__point')
      .attr('transform', (cur, elementIndex) => {
        const datum = params.data[elementIndex];
        const d = getChartItem({ datum, bisectDate, xDate });

        if ((d?.date === undefined && d?.value === undefined)) {
          return 'translate(-100,-100)';
        }

        const xPos = params.xScale(d.date);
        const yPos = params.yScale(d.value);

        if (elementIndex === 0) {
          baseXPos = xPos;
          baseYPos = yPos;
        }

        currentPoints.push({ item: d, datumIndex: elementIndex });

        const isMaxValuePoint = d?.value === maxValuePoint;

        if (!isMaxValuePoint) {
          return 'translate(-100,-100)';
        }

        return `translate(${ xPos }, ${ yPos })`;
      });

    return {
      x: baseXPos,
      y: baseYPos,
      currentPoints,
    };
  }, [ params, getMaxValuePoint, ref ]);
}
