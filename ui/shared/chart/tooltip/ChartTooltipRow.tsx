import { useToken } from '@chakra-ui/react';
import * as d3 from 'd3';
import React from 'react';

import type { TimeChartData } from '../types';

import type { CurrentPoint } from './ChartTooltipPoint';
import { calculateRowTransformValue, PADDING, COLUMN_GAP } from './utils';

type Props = {
  lineNum: number;
} & ({ label: string; children?: never } | { children: React.ReactNode; label?: never });

const ChartTooltipRow = ({ label, lineNum, children }: Props) => {
  const labelColor = useToken('colors', 'blue.100');
  const textColor = useToken('colors', 'white');

  return (
    <g className="ChartTooltip__row" transform={ calculateRowTransformValue(lineNum) }>
      { children || (
        <>
          <text
            className="ChartTooltip__label"
            transform="translate(0,0)"
            dominantBaseline="hanging"
            fill={ labelColor[0] }
          >
            { label }
          </text>
          <text
            className="ChartTooltip__value"
            transform="translate(0,0)"
            dominantBaseline="hanging"
            fill={ textColor[0] }
          />
        </>
      ) }
    </g>
  );
};

export default React.memo(ChartTooltipRow);

interface UseRenderRowsParams {
  data: TimeChartData;
  xScale: d3.ScaleTime<number, number>;
  minWidth?: number;
}

interface UseRenderRowsReturnType {
  width: number;
}

export function useRenderRows(ref: React.RefObject<SVGGElement | null>, { data, xScale }: UseRenderRowsParams) {
  return React.useCallback((x: number, currentPoints: Array<CurrentPoint>): UseRenderRowsReturnType => {

    // update "transform" prop of all rows
    const isIncompleteData = currentPoints.some(({ item }) => item.isApproximate);
    d3.select(ref.current)
      .selectAll<Element, TimeChartData>('.ChartTooltip__row')
      .attr('transform', (datum, index) => {
        return calculateRowTransformValue(index - (isIncompleteData ? 0 : 1));
      });

    // update date and indicators value
    // here we assume that the first value element contains the date
    const valueNodes = d3.select(ref.current)
      .selectAll<Element, TimeChartData>('.ChartTooltip__value')
      .text((_, index) => {
        if (index === 0) {
          const date = xScale.invert(x);
          const dateValue = data[0].items.find((item) => item.date.getTime() === date.getTime())?.dateLabel;
          const dateValueFallback = d3.timeFormat('%e %b %Y')(xScale.invert(x));
          return dateValue || dateValueFallback;
        }

        const { datumIndex, item } = currentPoints.find(({ datumIndex }) => datumIndex === index - 1) || {};
        if (datumIndex === undefined || !item) {
          return null;
        }

        const value = data[datumIndex]?.valueFormatter?.(item.value) ?? item.value.toLocaleString(undefined, { minimumSignificantDigits: 1 });
        const units = data[datumIndex]?.units ? ` ${ data[datumIndex]?.units }` : '';

        return value + units;
      })
      .nodes();

    const labelNodes = d3.select(ref.current)
      .selectAll<Element, TimeChartData>('.ChartTooltip__label')
      .nodes();

    const labelWidths = labelNodes.map((node) => node?.getBoundingClientRect?.().width || 0);
    const maxLabelWidth = Math.max(...labelWidths, 0);

    const valueWidths = valueNodes.map((node) => node?.getBoundingClientRect?.().width || 0);
    const maxValueWidth = Math.max(...valueWidths, 0);

    const valueColumnX = maxLabelWidth + COLUMN_GAP;
    d3.select(ref.current)
      .selectAll<Element, TimeChartData>('.ChartTooltip__value')
      .attr('transform', `translate(${ valueColumnX },0)`);

    const maxRowWidth = 2 * PADDING + maxLabelWidth + COLUMN_GAP + maxValueWidth;

    return { width: maxRowWidth };

  }, [ data, ref, xScale ]);
}
