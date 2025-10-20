import dayjs from 'lib/date/dayjs';

function getYearsMonthsDaysHoursMinutes(secondsNow: number, secondsTimestamp: number) {
  let diff = secondsTimestamp - secondsNow;
  const secondsPerMinute = 60;
  const secondsPerHour = 60 * secondsPerMinute;
  const secondsPerDay = 24 * secondsPerHour;

  const secondsPerYear = 365 * secondsPerDay;
  const secondsPerMonth = 30 * secondsPerDay;

  const years = Math.floor(diff / secondsPerYear);
  diff -= years * secondsPerYear;

  const months = Math.floor(diff / secondsPerMonth);
  diff -= months * secondsPerMonth;

  const days = Math.floor(diff / secondsPerDay);
  diff -= days * secondsPerDay;

  const hours = Math.floor(diff / secondsPerHour);
  diff -= hours * secondsPerHour;

  const minutes = Math.floor(diff / secondsPerMinute);

  return { years, months, days, hours, minutes };
}

function displayFirstDateUnit(fromNow: ReturnType<typeof getYearsMonthsDaysHoursMinutes>) {
  const units = [
    { value: fromNow.years, label: 'year' },
    { value: fromNow.months, label: 'month' },
    { value: fromNow.days, label: 'day' },
    { value: fromNow.hours, label: 'hour' },
    { value: fromNow.minutes, label: 'minute' },
  ];
  const first = units.find(u => u.value > 0);
  return first ? `in ${ first.value } ${ first.label }${ first.value !== 1 ? 's' : '' }` : 'in 0 minutes';
}

export function dayBigFuture(timestampInSeconds: number, expiresAtTimestamp?: string) {
  if (expiresAtTimestamp) {
    const preciseDate = dayjs(expiresAtTimestamp);
    const formatted = preciseDate.format('lll');
    const fromNow = preciseDate.fromNow();

    return {
      formatted,
      fromNow,
    };
  }

  const currentDateSeconds = new Date().getTime() / 1000;

  const fromNow = getYearsMonthsDaysHoursMinutes(currentDateSeconds, timestampInSeconds);
  const fromNowString = displayFirstDateUnit(fromNow);

  return {
    fromNow: fromNowString,
  };
}
