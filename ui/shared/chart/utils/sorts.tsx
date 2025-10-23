import type { TimeChartItem } from '../types';
import type { BlockTransactionPoint } from '@golembase/l3-indexer-types';

export const sortByDateDesc = (a: Pick<TimeChartItem, 'date'>, b: Pick<TimeChartItem, 'date'>) => {
  return a.date.getTime() - b.date.getTime();
};

export const sortByXDesc = (a: Pick<BlockTransactionPoint, 'block_number'>, b: Pick<BlockTransactionPoint, 'block_number'>) => {
  return Number(a.block_number) - Number(b.block_number);
};
