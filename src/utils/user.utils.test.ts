import { faker } from '@faker-js/faker';

import { UISortDirections, UISortKeys } from '@generated/data-contracts';
import { ISortParameters } from '@interfaces/user.interface';

import { buildUserSearchParams, buildUserSortParams, isEmail } from './user.utils';

describe('[UserUtils]', () => {
  describe('isEmail', () => {
    it('should return true', async () => {
      const email = faker.internet.email();
      const testValue = isEmail(email);

      expect(testValue).toEqual(true);
    });

    it('should return false', async () => {
      const email = 'malformed email';
      const testValue = isEmail(email);

      expect(testValue).toEqual(false);
    });
  });

  describe('buildUserSortParams', () => {
    it('should return empty object', async () => {
      const data: ISortParameters = {};
      const testValue = buildUserSortParams(data);

      expect(testValue).toEqual({});
    });

    it('should return ascending', async () => {
      const data: ISortParameters = {
        sortKey: UISortKeys.LastSignInAt,
        sortDir: UISortDirections.Asc,
      };
      const testValue = buildUserSortParams(data);

      expect(testValue).toEqual({
        [UISortKeys.LastSignInAt]: 1,
      });
    });

    it('should return descending', async () => {
      const data: ISortParameters = {
        sortKey: UISortKeys.LastSignInAt,
        sortDir: UISortDirections.Desc,
      };
      const testValue = buildUserSortParams(data);

      expect(testValue).toEqual({
        [UISortKeys.LastSignInAt]: -1,
      });
    });
  });

  describe('buildUserSearchParams', () => {
    it('should return empty object because of null param', async () => {
      const data = null;
      const testValue = buildUserSearchParams(data);

      expect(testValue).toEqual({});
    });

    it('should return empty object because of no search param', async () => {
      const data = {};
      const testValue = buildUserSearchParams(data);

      expect(testValue).toEqual({});
    });

    it('should return empty object because of empty string', async () => {
      const data = {
        search: '',
      };
      const testValue = buildUserSearchParams(data);

      expect(testValue).toEqual({});
    });
  });
});
