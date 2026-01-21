import * as d3 from 'd3';

import { Resolution } from '../types';
import { ChartResolution } from '@golembase/l3-indexer-types';

export function getDateLabel(date: Date, dateTo?: Date, resolution?: Resolution | ChartResolution): string {
  switch (resolution) {
    case ChartResolution.HOUR:
    case ChartResolution.DAY:
      return d3.utcFormat('%e %b %Y')(date) + (dateTo ? ` – ${ d3.utcFormat('%e %b %Y')(dateTo) }` : '');
    case Resolution.WEEK:
      return d3.utcFormat('%e %b %Y')(date) + (dateTo ? ` – ${ d3.utcFormat('%e %b %Y')(dateTo) }` : '');
    case Resolution.MONTH:
      return d3.utcFormat('%b %Y')(date);
    case Resolution.YEAR:
      return d3.utcFormat('%Y')(date);
    default:
      return d3.utcFormat('%e %b %Y')(date);
  }
}
