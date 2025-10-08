import bigIntSupport from 'dayjs/plugin/bigIntSupport';

import dayjs from 'lib/date/dayjs';

dayjs.extend(bigIntSupport);

export const MAX_TIMESTAMP_MS = 8640000000000000;

export function dayjsBigFuture(timestampInMs: number) {
  const isBiggerThanMaxTimestamp = Number(timestampInMs) > MAX_TIMESTAMP_MS;

  if (isBiggerThanMaxTimestamp) {
    const date = dayjs(MAX_TIMESTAMP_MS);

    return {
      formatted: 'after ' + date.format('llll'),
      fromNow: 'after ' + date.fromNow(true),
    };
  }

  const date = dayjs(timestampInMs);

  return {
    formatted: date.format('llll'),
    fromNow: date.fromNow(),
  };
}
