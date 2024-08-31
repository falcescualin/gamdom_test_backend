import { UISortDirections, UISortKeys } from '@generated/data-contracts';

export enum IUserSearchKeys {
  id = 'id',
  email = 'email',
}

export interface ISortParameters {
  sortKey?: UISortKeys;
  sortDir?: UISortDirections;
}
