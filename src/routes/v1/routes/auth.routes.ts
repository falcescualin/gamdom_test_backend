import { Router } from 'express';

import { AuthController } from '@controllers/auth.controller';
import { Routes } from '@interfaces/routes.interface';
import { authMiddleware } from 'middleware/auth.middleware';

class AuthRoute implements Routes {
  public router = Router();
  private authController: AuthController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/login', this.authController.login);
    this.router.post('/register', this.authController.register);
    this.router.post('/refresh', this.authController.refreshToken);
    this.router.get('/me', authMiddleware(), this.authController.me);
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default AuthRoute;
