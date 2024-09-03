import { Router } from 'express';

import { Routes } from '@interfaces/routes.interface';

import AuthRoute from './routes/auth.routes';
import EventRoute from './routes/event.routes';
import LogRoute from './routes/log.routes';
import UserRoute from './routes/user.routes';

class V1Route implements Routes {
  public router = Router();

  public userRoutes = new UserRoute();
  public logRoutes = new LogRoute();
  public authRoutes = new AuthRoute();
  public eventRoutes = new EventRoute();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(`/users`, this.userRoutes.getRouter());
    this.router.use(`/logger`, this.logRoutes.getRouter());
    this.router.use(`/auth`, this.authRoutes.getRouter());
    this.router.use(`/events`, this.eventRoutes.getRouter());
  }

  public getRouter() {
    return this.router;
  }
}

export default V1Route;
