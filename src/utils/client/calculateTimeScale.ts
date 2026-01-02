import { type TimeScaleInterface } from '@/types/client/timeScale';

export function calculateTimeScale(dates: Date[]): TimeScaleInterface {
  const timeDiff =
    new Date(dates[dates.length - 1]).getTime() - new Date(dates[0]).getTime();
  const hour = 3.6e6;

  if (timeDiff < 2 * hour) {
    return 'second';
  } else if (timeDiff < 24 * hour) {
    return 'hour';
  } else if (24 * hour <= timeDiff && timeDiff < 4 * 30 * 24 * hour) {
    return 'day';
  } else if (4 * 30 * 24 * hour <= timeDiff && timeDiff < 0.5 * 8760 * hour) {
    return 'month';
  } else {
    return 'year';
  }
}
