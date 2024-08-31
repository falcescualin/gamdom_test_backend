import { UISortDirections } from '@generated/data-contracts';
import { ISortParameters, IUserSearchKeys } from '@interfaces/user.interface';

export const isEmail = (email: string) => {
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
    email
  );
};

export const buildUserSortParams = (requestQuery: ISortParameters) => {
  const { sortKey, sortDir } = requestQuery;

  if (!sortKey) {
    return {};
  }

  return {
    [sortKey]: sortDir === UISortDirections.Desc ? -1 : 1,
  };
};

export const buildUserSearchParams = (requestQuery: { search?: string }): any => {
  const search = requestQuery?.search;

  if (!search) {
    return {};
  }

  const searchWord = search.trim();

  if (isEmail(searchWord)) {
    return {
      [IUserSearchKeys.email]: searchWord,
    };
  }

  return {
    $or: [
      {
        [IUserSearchKeys.email]: { $regex: new RegExp(searchWord, 'i') },
      },
    ],
  };
};
