import { addDays, addHours, addMinutes } from 'date-fns';

export const addDurationToDate = (date: Date, duration: string) => {
  const durationValue = parseInt(duration);
  const durationUnit = duration.slice(-1); // Extract the last character as unit

  switch (durationUnit) {
    case 'h':
      return addHours(date, durationValue);
    case 'd':
      return addDays(date, durationValue);
    case 'm':
      return addMinutes(date, durationValue);
    default:
      return date;
  }
};
