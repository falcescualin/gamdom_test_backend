import { HttpStatusCode } from 'axios';

import HttpError from '@classes/HttpError';
import { logger } from '@logger/index';
import { User as UserModel } from '@models/user.model';

export class UserService {
  private static instance: UserService;

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  constructor() {}

  public async getUserById(userId: string): Promise<any> {
    const user = await UserModel.findByPk(userId);

    if (!user) {
      throw new HttpError(HttpStatusCode.NotFound, 'User not found');
    }

    return user.toJSON();
  }

  public async getFavorites(userId: string): Promise<string[]> {
    const user = await UserModel.findByPk(userId);

    if (!user) {
      throw new HttpError(HttpStatusCode.NotFound, 'User not found');
    }

    return user.favorites;
  }

  public async addFavorite(userId: string, favoriteId: string): Promise<void> {
    const user = await UserModel.findByPk(userId);

    if (!user) {
      throw new HttpError(HttpStatusCode.NotFound, 'User not found');
    }

    if (user.favorites.includes(favoriteId)) {
      logger.debug(`Favorite already exists ${favoriteId}`);
      return;
    }

    user.favorites.push(favoriteId);

    await user.save();

    logger.debug(`User ${userId} added favorite ${favoriteId}`);
  }

  public async removeFavorite(userId: string, favoriteId: string): Promise<void> {
    const user = await UserModel.findByPk(userId);

    if (!user) {
      throw new HttpError(HttpStatusCode.NotFound, 'User not found');
    }

    user.favorites = user.favorites.filter(favorite => favorite !== favoriteId);

    await user.save();

    logger.debug(`User ${userId} removed favorite ${favoriteId}`);
  }
}
