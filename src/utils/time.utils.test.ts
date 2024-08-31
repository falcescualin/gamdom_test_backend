import { addDays, addHours, addMinutes } from 'date-fns';

import { addDurationToDate } from './time.utils';

describe('[TimeUtils]', () => {
  describe('addDurationToDate', () => {
    it('should add hours ', async () => {
      const date = new Date();
      const newDate = addDurationToDate(date, '1h');

      expect(newDate).toEqual(addHours(date, 1));
    });

    it('should add days', async () => {
      const date = new Date();
      const newDate = addDurationToDate(date, '1d');

      expect(newDate).toEqual(addDays(date, 1));
    });

    it('should add minutes', async () => {
      const date = new Date();
      const newDate = addDurationToDate(date, '1m');

      expect(newDate).toEqual(addMinutes(date, 1));
    });

    it('should return the same date', async () => {
      const date = new Date();
      const newDate = addDurationToDate(date, 'malfomrmed input');

      expect(newDate).toEqual(date);
    });
  });
});
