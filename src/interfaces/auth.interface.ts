import { Request } from 'express';

import { UITokenJWTTypes } from '@generated/data-contracts';
import { User } from '@models/user.model';

export interface RequestWithUser extends Request {
  user: User;
  accessToken: string;
}

export const expiryTimeMapping: Record<UITokenJWTTypes, string> = {
  [UITokenJWTTypes.ACCESS]: '1h',
  [UITokenJWTTypes.REFRESH]: '20d',
};
