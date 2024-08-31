import { HttpStatusCode } from 'axios';
import { Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import HttpError from '@classes/HttpError';
import { SECRET_KEY } from '@config';
import { UILoginResponseSuccessData, UITokenJWTTypes } from '@generated/data-contracts';
import { RequestWithUser } from '@interfaces/auth.interface';
import { logger } from '@logger/index';
import { User } from '@models/user.model';
import { AuthService } from '@services/auth.service';
import { isValidEmailDomain } from '@utils/auth.utils';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = AuthService.getInstance();
  }

  public login = async (req: RequestWithUser, res: Response) => {
    try {
      const { email, password } = req.body;

      const foundUser = await User.findOne({ where: { email: email.trim() } });

      if (!foundUser) {
        throw new HttpError(HttpStatusCode.NotFound, 'User not found');
      }

      const { user, tokens } = await this.authService.login(email.trim(), password.trim());

      await foundUser.update({ lastSignInAt: new Date() });

      const responseData: UILoginResponseSuccessData = {
        success: true,
        data: {
          user,
          tokens,
        },
      };

      res.status(HttpStatusCode.Ok).json(responseData);
    } catch (error) {
      logger.error(error);
      if (error instanceof HttpError) {
        return res.status(error.status).json({ success: false, error: error.message });
      } else {
        return res.status(HttpStatusCode.InternalServerError).json({ success: false, error: error.message });
      }
    }
  };

  public register = async (req: RequestWithUser, res: Response) => {
    try {
      const { email, password } = req.body;

      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();

      if (!(await isValidEmailDomain(trimmedEmail))) {
        throw new HttpError(HttpStatusCode.BadRequest, 'Invalid email domain');
      }

      const existingUser = await User.findOne({ where: { email: trimmedEmail } });

      if (existingUser) {
        throw new HttpError(HttpStatusCode.BadRequest, 'Email already exists');
      }

      const { user, tokens } = await this.authService.register(trimmedEmail, trimmedPassword);

      const responseData: UILoginResponseSuccessData = {
        success: true,
        data: {
          user,
          tokens,
        },
      };

      res.status(HttpStatusCode.Ok).json(responseData);
    } catch (error) {
      logger.error(error);
      if (error instanceof HttpError) {
        return res.status(error.status).json({ success: false, error: error.message });
      } else {
        return res.status(HttpStatusCode.InternalServerError).json({ success: false, error: error.message });
      }
    }
  };

  public refreshToken = async (req: RequestWithUser, res: Response) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new HttpError(HttpStatusCode.Unauthorized, 'No token');
      }

      const decoded = jwt.verify(refreshToken, SECRET_KEY) as JwtPayload;

      if (decoded.type !== UITokenJWTTypes.REFRESH) {
        throw new HttpError(HttpStatusCode.Unauthorized, 'Invalid token');
      }

      const refreshedAccessToken = await this.authService.generateAccessToken(decoded.email);
      const foundUser = await User.findOne({ where: { email: decoded.email } });

      const responseData = {
        success: true,
        data: {
          user: foundUser.toJSON(),
          accessToken: refreshedAccessToken,
        },
      };

      res.status(HttpStatusCode.Ok).json(responseData);
    } catch (error) {
      logger.error(error);
      if (error instanceof HttpError) {
        return res.status(error.status).json({ success: false, error: error.message });
      } else {
        return res.status(HttpStatusCode.InternalServerError).json({ success: false, error: error.message });
      }
    }
  };

  public me = async (req: RequestWithUser, res: Response) => {
    try {
      const user = req.user;

      const data = await this.authService.me(user.toJSON());

      const responseData = {
        success: true,
        data: data,
      };

      res.status(HttpStatusCode.Ok).json(responseData);
    } catch (error) {
      logger.error(error);
      if (error instanceof HttpError) {
        return res.status(error.status).json({ success: false, error: error.message });
      } else {
        return res.status(HttpStatusCode.InternalServerError).json({ success: false, error: error.message });
      }
    }
  };
}
