import bigIntSupport from 'dayjs/plugin/bigIntSupport';

import dayjs from 'lib/date/dayjs';

dayjs.extend(bigIntSupport);

const MAX_TIMESTAMP = 8640000000000000;

export function dayjsBigFuture(timestampInMs: number) {
  const isBiggerThanMaxTimestamp = BigInt(timestampInMs) > MAX_TIMESTAMP;

  if (isBiggerThanMaxTimestamp) {
    const date = dayjs(MAX_TIMESTAMP);

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
