import { useToken } from '@chakra-ui/react';
import * as d3 from 'd3';
import React from 'react';

import useClientRect from 'lib/hooks/useClientRect';

import calculateInnerSize from 'ui/shared/chart/utils/calculateInnerSize';

interface Props {
  data: Array<{ x: number; y: number }>;
  caption?: string;
}

interface ChartMargin {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

const CHART_MARGIN: ChartMargin = { bottom: 5, left: 10, right: 10, top: 5 };

const SimpleChartContent = ({ data }: Props) => {
  const lineColor = useToken('colors', 'blue.500');
  const gradientStartColor = useToken('colors', 'blue.100');
  const gradientStopColor = 'rgba(190, 227, 248, 0)'; // blue.100 with 0 opacity
  
  const [ rect, ref ] = useClientRect<SVGSVGElement>();
  const { innerWidth, innerHeight } = calculateInnerSize(rect, CHART_MARGIN);

  const pathRef = React.useRef<SVGPathElement>(null);
  const areaRef = React.useRef<SVGPathElement>(null);

  // Create scales
  const xScale = React.useMemo(() => {
    if (!data.length) {
      return d3.scaleLinear().domain([ 0, 1 ]).range([ 0, innerWidth ]);
    }
    const xExtent = d3.extent(data, d => d.x) as [ number, number ];
    return d3.scaleLinear()
      .domain(xExtent)
      .range([ 0, innerWidth ])
      .nice();
  }, [ data, innerWidth ]);

  const yScale = React.useMemo(() => {
    if (!data.length) {
      return d3.scaleLinear().domain([ 0, 1 ]).range([ innerHeight, 0 ]);
    }
    const yExtent = d3.extent(data, d => d.y) as [ number, number ];
    return d3.scaleLinear()
      .domain(yExtent)
      .range([ innerHeight, 0 ])
      .nice();
  }, [ data, innerHeight ]);

  // Create line and area generators
  const line = React.useMemo(() => {
    return d3.line<{ x: number; y: number }>()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveMonotoneX);
  }, [ xScale, yScale ]);

  const area = React.useMemo(() => {
    return d3.area<{ x: number; y: number }>()
      .x(d => xScale(d.x))
      .y1(d => yScale(d.y))
      .y0(() => yScale(yScale.domain()[0]))
      .curve(d3.curveMonotoneX);
  }, [ xScale, yScale ]);

  const linePath = React.useMemo(() => line(data) || undefined, [ line, data ]);
  const areaPath = React.useMemo(() => area(data) || undefined, [ area, data ]);

  // Animate on mount
  React.useEffect(() => {
    if (pathRef.current) {
      const totalLength = pathRef.current.getTotalLength();
      d3.select(pathRef.current)
        .attr('stroke-dasharray', `${ totalLength },${ totalLength }`)
        .attr('stroke-dashoffset', totalLength)
        .attr('opacity', 1)
        .transition()
        .duration(750)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0);
    }

    if (areaRef.current) {
      d3.select(areaRef.current)
        .attr('opacity', 0)
        .transition()
        .duration(750)
        .ease(d3.easeBackIn)
        .attr('opacity', 1);
    }
  }, [ linePath, areaPath ]);

  return (
    <svg width="100%" height="100%" ref={ ref } cursor="pointer">
      <defs>
        <linearGradient id="simple-chart-gradient" x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="0%" stopColor={ gradientStartColor[0] }/>
          <stop offset="100%" stopColor={ gradientStopColor }/>
        </linearGradient>
      </defs>
      <g transform={ `translate(${ CHART_MARGIN.left || 0 },${ CHART_MARGIN.top || 0 })` } opacity={ rect ? 1 : 0 }>
        <path
          ref={ areaRef }
          d={ areaPath }
          fill="url(#simple-chart-gradient)"
          opacity={ 0 }
        />
        <path
          ref={ pathRef }
          d={ linePath }
          stroke={ lineColor[0] }
          strokeWidth={ 3 }
          strokeLinecap="round"
          fill="none"
          opacity={ 0 }
        />
      </g>
    </svg>
  );
};

export default React.memo(SimpleChartContent);

