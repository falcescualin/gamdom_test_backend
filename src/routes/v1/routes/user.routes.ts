import { Router } from 'express';

import { UserController } from '@controllers/user.controller';
import { Routes } from '@interfaces/routes.interface';
import { authMiddleware } from 'middleware/auth.middleware';

class UserRoute implements Routes {
  public router = Router();
  private userController: UserController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/:userId', this.userController.getUserById);
    this.router.delete('/favorites/:listingId', authMiddleware(), this.userController.removeFavorite);
    this.router.get('/favorites', authMiddleware(), this.userController.getFavorites);
    this.router.post('/favorites', authMiddleware(), this.userController.addFavorite);
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default UserRoute;
