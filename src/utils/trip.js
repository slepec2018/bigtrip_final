import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(duration);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const MSEC_IN_SEC = 1000;
const SEC_IN_MIN = 60;
const MIN_IN_HOUR = 60;
const HOUR_IN_DAY = 24;

const MSEC_IN_HOUR = MSEC_IN_SEC * SEC_IN_MIN * MIN_IN_HOUR;
const MSEC_IN_DAY = MSEC_IN_HOUR * HOUR_IN_DAY;

function humanizeTripDueDate(dueDate, dateFrom) {
  return dueDate ? dayjs(dueDate).format(dateFrom) : '';
}

function getPointDuration(dateFrom, dateTo) {
  const timeDiff = dayjs(dateTo).diff(dayjs(dateFrom));
  let pointDuration = 0;

  switch (true) {
    case (timeDiff >= MSEC_IN_DAY):
      pointDuration = dayjs.duration(timeDiff).format('D[D] H[H] m[M]');
      break;
    case (timeDiff >= MSEC_IN_HOUR):
      pointDuration = dayjs.duration(timeDiff).format('H[H] m[M]');
      break;
    case (timeDiff < MSEC_IN_HOUR):
      pointDuration = dayjs.duration(timeDiff).format('m[M]');
      break;
  }

  return pointDuration;
}

function upFirstLetter(str) {
  if (!str) {
    return str;
  }
  return str[0].toUpperCase() + str.slice(1);
}

function isTripFuture (date) {
  return dayjs().isBefore(date, 'D');
}

function isTripPresent(dateFrom, dateTo) {
  const isDateFromPast = dayjs().isSameOrAfter(dayjs(dateFrom), 'D');
  const isDateToFuture = dayjs().isSameOrBefore(dayjs(dateTo), 'D');

  return isDateFromPast && isDateToFuture;
}

function isTripPast (date) {
  return dayjs().isAfter(date, 'D');
}

function getDateDifference (pointA, pointB) {
  return dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
}

function getTimeDifference (pointA, pointB) {
  const pointAdifference = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const pointBdifference = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));

  return pointBdifference - pointAdifference;
}

function isDatesEqual(dateA, dateB) {
  return (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'm');
}

function isPriceEqual(priceA, priceB) {
  return (priceA - priceB) === 0;
}

const isEscapeKey = (evt) => evt.key === 'Escape';

export {humanizeTripDueDate, getPointDuration, upFirstLetter, isTripFuture, isTripPresent, isTripPast, getDateDifference, getTimeDifference, isDatesEqual, isPriceEqual, isEscapeKey};
