import dayjs from 'lib/date/dayjs';

export const MAX_TIMESTAMP_MS = 8640000000000000;
const DATE_FORMAT = 'MMM D YYYY HH:mm:ss A';

export function dayjsBigFuture(timestampInMs: number) {
  const isBiggerThanMaxTimestamp = timestampInMs > MAX_TIMESTAMP_MS;

  if (isBiggerThanMaxTimestamp) {
    const date = dayjs(MAX_TIMESTAMP_MS);

    return {
      formatted: 'after ' + date.format(DATE_FORMAT),
      fromNow: 'after ' + date.fromNow(true),
    };
  }

  const date = dayjs(timestampInMs);

  return {
    formatted: date.format(DATE_FORMAT),
    fromNow: date.fromNow(),
  };
}
