import type { BlockTransactionPoint } from '@golembase/l3-indexer-types';
import type { SimpleChartItem, TimeChartItem, TimeChartItemRaw } from 'ui/shared/chart/types';

import { sortByDateDesc, sortByXDesc } from 'ui/shared/chart/utils/sorts';

const nonNullTailReducer = (result: Array<TimeChartItemRaw>, item: TimeChartItemRaw) => {
  if (item.value === null && result.length === 0) {
    return result;
  }
  result.unshift(item);
  return result;
};

const nonNullTailReducerSimple = (result: Array<BlockTransactionPoint>, item: BlockTransactionPoint) => {
  if (item.block_number === null && result.length === 0) {
    return result;
  }
  result.unshift(item);
  return result;
};

const mapNullToZero: (item: TimeChartItemRaw) => TimeChartItem = (item) => ({ ...item, value: Number(item.value) });
const mapNullToZeroSimple: (item: BlockTransactionPoint) => SimpleChartItem = (item) => ({ x: Number(item.block_number), y: Number(item.tx_count) });

export function prepareChartItemsWithDate(items: Array<TimeChartItemRaw>) {
  return items
    .sort(sortByDateDesc)
    .reduceRight(nonNullTailReducer, [] as Array<TimeChartItemRaw>)
    .map(mapNullToZero);
}

export function prepareChartItemsWithNumberOnly(items: Array<BlockTransactionPoint>) {
  return items
    .sort(sortByXDesc)
    .reduceRight(nonNullTailReducerSimple, [])
    .map(mapNullToZeroSimple);
}
