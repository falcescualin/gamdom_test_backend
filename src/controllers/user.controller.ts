import { HttpStatusCode } from 'axios';
import { Response } from 'express';

import HttpError from '@classes/HttpError';
import { RequestWithUser } from '@interfaces/auth.interface';
import { logger } from '@logger/index';
import { UserService } from '@services/user.service';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = UserService.getInstance();
  }

  public getUserById = async (req: RequestWithUser, res: Response) => {
    try {
      const { userId } = req.params;

      const user = await this.userService.getUserById(userId);

      logger.debug(`Retrived user: ${JSON.stringify(user)}`);

      return res.status(HttpStatusCode.Ok).json({
        success: true,
        data: user,
      });
    } catch (error) {
      logger.error(error);
      if (error instanceof HttpError) {
        return res.status(error.status).json({ success: false, error: error.message });
      } else {
        return res.status(HttpStatusCode.InternalServerError).json({ success: false, error: error.message });
      }
    }
  };

  public getFavorites = async (req: RequestWithUser, res: Response) => {
    try {
      const { id } = req.user;

      const favorites = await this.userService.getFavorites(id);

      logger.debug(`Retrived favorites for user ${id}: ${JSON.stringify(favorites)}`);

      return res.status(HttpStatusCode.Ok).json({
        success: true,
        data: favorites,
      });
    } catch (error) {
      logger.error(error);
      if (error instanceof HttpError) {
        return res.status(error.status).json({ success: false, error: error.message });
      } else {
        return res.status(HttpStatusCode.InternalServerError).json({ success: false, error: error.message });
      }
    }
  };

  public addFavorite = async (req: RequestWithUser, res: Response) => {
    try {
      const { id } = req.user;
      const { favoriteId } = req.body;

      await this.userService.addFavorite(id, favoriteId);

      return res.status(HttpStatusCode.Ok).json({
        success: true,
      });
    } catch (error) {
      logger.error(error);
      if (error instanceof HttpError) {
        return res.status(error.status).json({ success: false, error: error.message });
      } else {
        return res.status(HttpStatusCode.InternalServerError).json({ success: false, error: error.message });
      }
    }
  };

  public removeFavorite = async (req: RequestWithUser, res: Response) => {
    try {
      const { id } = req.user;
      const { listingId } = req.params;

      await this.userService.removeFavorite(id, listingId);

      return res.status(HttpStatusCode.Ok).json({
        success: true,
      });
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
