import { Resolution } from '@blockscout/stats-types';
import type { StatsIntervalIds } from 'types/client/stats';

import dayjs from 'lib/date/dayjs';

export const STATS_RESOLUTIONS: Array<{ id: Resolution; title: string }> = [
  {
    id: Resolution.DAY,
    title: 'Day',
  },
  {
    id: Resolution.WEEK,
    title: 'Week',
  },
  {
    id: Resolution.MONTH,
    title: 'Month',
  },
  {
    id: Resolution.YEAR,
    title: 'Year',
  },
];

export const STATS_INTERVALS: Record<StatsIntervalIds, { title: string; shortTitle: string; start?: Date }> = {
  all: {
    title: 'All time',
    shortTitle: 'All time',
  },
  oneDay: {
    title: '1 day',
    shortTitle: '1D',
    start: getStartDateInPast('days', 1),
  },
  oneMonth: {
    title: '1 month',
    shortTitle: '1M',
    start: getStartDateInPast('months', 1),
  },
  threeMonths: {
    title: '3 months',
    shortTitle: '3M',
    start: getStartDateInPast('months', 3),
  },
  sixMonths: {
    title: '6 months',
    shortTitle: '6M',
    start: getStartDateInPast('months', 6),
  },
  oneYear: {
    title: '1 year',
    shortTitle: '1Y',
    start: getStartDateInPast('months', 12),
  },
};

function getStartDateInPast(type: 'months' | 'days' = 'months', count: number): Date {
  return dayjs().subtract(count, type).toDate();
}
