import { Grid, Text, useToken } from '@chakra-ui/react';
import * as d3 from 'd3';
import React from 'react';

import type { ChartMargin } from 'ui/shared/chart/types';

import useClientRect from 'lib/hooks/useClientRect';
import { Tooltip } from 'toolkit/chakra/tooltip';
import calculateInnerSize from 'ui/shared/chart/utils/calculateInnerSize';

interface Props {
  data: [{ items: Array<{ x: number; y: number }> }];
  caption?: string;
}

const CHART_MARGIN: ChartMargin = { bottom: 5, left: 0, right: 0, top: 5 };

const SimpleChartContent = ({ data }: Props) => {
  const gradientStartColor = useToken('colors', 'blue.500');
  const gradientStopColor = useToken('colors', 'blue.50');

  const [ rect, ref ] = useClientRect<SVGSVGElement>();
  const { innerWidth, innerHeight } = calculateInnerSize(rect, CHART_MARGIN);

  const barsRef = React.useRef<SVGGElement>(null);

  const xScale = React.useMemo(() => {
    if (!data[0]?.items.length) {
      return d3.scaleLinear().domain([ 0, 1 ]).range([ 0, innerWidth ]);
    }
    const xExtent = d3.extent(data[0].items, d => d.x) as [ number, number ];
    return d3.scaleLinear()
      .domain(xExtent)
      .range([ 0, innerWidth ])
      .nice();
  }, [ data, innerWidth ]);

  const yScale = React.useMemo(() => {
    if (!data[0]?.items.length) {
      return d3.scaleLinear().domain([ 0, 1 ]).range([ innerHeight, 0 ]);
    }
    const yExtent = d3.extent(data[0].items, d => d.y) as [ number, number ];
    const [ min, max ] = yExtent;

    return d3.scaleLinear()
      .domain([ Math.min(0, min), max ])
      .range([ innerHeight, 0 ])
      .nice();
  }, [ data, innerHeight ]);

  const barWidth = React.useMemo(() => {
    if (!data[0]?.items.length || data[0].items.length === 1) {
      return innerWidth;
    }

    const sortedItems = [ ...data[0].items ].sort((a, b) => a.x - b.x);
    const spacings = [];

    for (let i = 1; i < sortedItems.length; i++) {
      spacings.push(xScale(sortedItems[i].x) - xScale(sortedItems[i - 1].x));
    }
    const avgSpacing = spacings.reduce((sum, s) => sum + s, 0) / spacings.length;

    return avgSpacing * 0.8;
  }, [ data, xScale, innerWidth ]);

  const bars = React.useMemo(() => {
    if (!data[0]?.items.length) {
      return [];
    }
    const zeroY = yScale(0);
    return data[0].items.map((item, index) => {
      const x = xScale(item.x) - barWidth / 2;
      const y = yScale(item.y);
      const height = Math.abs(zeroY - y);
      return { x, y: Math.min(y, zeroY), height, index };
    });
  }, [ data, xScale, yScale, barWidth ]);

  const asd = React.useRef(false);

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (barsRef.current && !asd.current) {
        asd.current = true;
        d3.select(barsRef.current)
          .selectAll('rect')
          .data(bars)
          .attr('height', 0)
          .attr('y', innerHeight)
          .transition()
          .duration(750)
          .ease(d3.easeBackOut)
          .attr('height', d => d.height)
          .attr('y', d => d.y);
      }
    }, 100);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [ bars, innerHeight ]);

  return (
    <svg width="300%" height="100%" ref={ ref } cursor="pointer">
      <defs>
        <linearGradient id="simple-chart-gradient" x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="0%" stopColor={ gradientStartColor[0] }/>
          <stop offset="100%" stopColor={ gradientStopColor[0] }/>
        </linearGradient>
      </defs>
      <g transform={ `translate(${ CHART_MARGIN.left || 0 },${ CHART_MARGIN.top || 0 })` } opacity={ rect ? 1 : 0 }>
        <g ref={ barsRef }>
          { bars.map((bar, index) => {
            const item = data[0].items[index];

            return (
              <Tooltip key={ index } content={ (
                <Grid templateColumns="auto 1fr" gapX={ 2 } gapY={ 1 } textAlign="left" fontSize="xs">
                  <Text fontWeight={ 500 } color="blue.100">Block number</Text>
                  <Text>{ item.x }</Text>

                  <Text fontWeight={ 500 } color="blue.100">Transactions count</Text>
                  <Text>{ item.y }</Text>
                </Grid>
              ) }>
                <rect
                  key={ index }
                  x={ bar.x }
                  y={ bar.y }
                  width={ barWidth }
                  height={ bar.height }
                  fill="url(#simple-chart-gradient)"
                  rx={ 2 }
                />
              </Tooltip>
            );
          }) }
        </g>
      </g>
    </svg>
  );
};

export default React.memo(SimpleChartContent);
