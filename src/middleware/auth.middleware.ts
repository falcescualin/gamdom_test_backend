import { HttpStatusCode } from 'axios';
import { NextFunction, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { SECRET_KEY } from '@config';
import { UIRoles, UITokenJWTTypes } from '@generated/data-contracts';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@models/user.model';

export const authMiddleware = (requiredRole?: Array<UIRoles>) => async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization').trim().split(' ')[1];

    if (!token || token === '') {
      return res.status(HttpStatusCode.Unauthorized).send({ success: false, error: 'No token' });
    }

    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;

    if (decoded.type !== UITokenJWTTypes.ACCESS) {
      return res.status(HttpStatusCode.Unauthorized).send({ success: false, error: 'Invalid token' });
    }

    const user = await User.findOne({ where: { email: decoded.email } });

    if (!user) {
      return res.status(HttpStatusCode.Unauthorized).send({ success: false, error: 'No user, authorization denied' });
    }

    if (user.role !== UIRoles.SUPER_ADMIN) {
      if (requiredRole && !requiredRole.includes(user.role)) {
        return res.status(HttpStatusCode.Forbidden).send({ success: false, error: 'Forbidden' });
      }
    }

    req.user = user;
    req.accessToken = token;

    next();
  } catch (error) {
    res.status(HttpStatusCode.Unauthorized).send({ success: false, error: error.message });
  }
};
