import type { TimeChartItem } from '../types';

export const sortByDateDesc = (a: Pick<TimeChartItem, 'date'>, b: Pick<TimeChartItem, 'date'>) => {
  return a.date.getTime() - b.date.getTime();
};

export const sortByXDesc = (a: Pick<TimeChartItem, 'x'>, b: Pick<TimeChartItem, 'x'>) => {
  return a.x - b.x;
};