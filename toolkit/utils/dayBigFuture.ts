function getYearFromSeconds(seconds: number) {
  const secondsPerDay = 24 * 60 * 60;
  const daysSince1970 = Math.floor(seconds / secondsPerDay);

  let year = 1970;
  let remainingDays = daysSince1970;
  while (true) {
    const daysInYear = ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) ? 366 : 365;
    if (remainingDays >= daysInYear) {
      remainingDays -= daysInYear;
      year++;
    } else {
      break;
    }
  }
  return year;
}

function getMonthFromSeconds(seconds: number) {
  const secondsPerDay = 24 * 60 * 60;
  const daysSince1970 = Math.floor(seconds / secondsPerDay);

  let year = 1970;
  let remainingDays = daysSince1970;
  while (true) {
    const daysInYear = ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) ? 366 : 365;
    if (remainingDays >= daysInYear) {
      remainingDays -= daysInYear;
      year++;
    } else {
      break;
    }
  }

  const monthDays = [
    31,
    ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) ? 29 : 28,
    31, 30, 31, 30,
    31, 31, 30, 31,
    30, 31,
  ];

  let month = 0;
  while (month < 12) {
    if (remainingDays >= monthDays[month]) {
      remainingDays -= monthDays[month];
      month++;
    } else {
      break;
    }
  }

  return month + 1;
}

function getDayFromSeconds(seconds: number) {
  const secondsPerDay = 24 * 60 * 60;
  const daysSince1970 = Math.floor(seconds / secondsPerDay);

  let year = 1970;
  let remainingDays = daysSince1970;
  while (true) {
    const daysInYear = ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) ? 366 : 365;
    if (remainingDays >= daysInYear) {
      remainingDays -= daysInYear;
      year++;
    } else {
      break;
    }
  }

  const monthDays = [
    31,
    ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) ? 29 : 28,
    31, 30, 31, 30,
    31, 31, 30, 31,
    30, 31,
  ];

  let month = 0;
  while (month < 12) {
    if (remainingDays >= monthDays[month]) {
      remainingDays -= monthDays[month];
      month++;
    } else {
      break;
    }
  }

  return remainingDays + 1;
}

function getHourFromSeconds(seconds: number) {
  return Math.floor((seconds % (24 * 60 * 60)) / 3600);
}

function getMinuteFromSeconds(seconds: number) {
  return Math.floor((seconds % 3600) / 60);
}

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

export function dayBigFuture(timestampInSeconds: number) {
  const currentDateSeconds = new Date().getTime() / 1000;

  const year = getYearFromSeconds(timestampInSeconds);
  const month = getMonthFromSeconds(timestampInSeconds);
  const day = getDayFromSeconds(timestampInSeconds);
  const hour = getHourFromSeconds(timestampInSeconds);
  const minute = getMinuteFromSeconds(timestampInSeconds);

  const date = `${ month }/${ day }/${ year } ${ hour }:${ minute }`;

  const fromNow = getYearsMonthsDaysHoursMinutes(currentDateSeconds, timestampInSeconds);
  const fromNowString = displayFirstDateUnit(fromNow);

  return {
    formatted: date,
    fromNow: fromNowString,
  };
}
