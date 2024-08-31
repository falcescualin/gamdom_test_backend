import { Router } from 'express';

import { LogController } from '@controllers/log.controller';
import { UIRoles } from '@generated/data-contracts';
import { Routes } from '@interfaces/routes.interface';
import { authMiddleware } from 'middleware/auth.middleware';

class LogRoute implements Routes {
  public router = Router();
  private logController: LogController = new LogController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.put('/', authMiddleware([UIRoles.SUPER_ADMIN]), this.logController.putLogLevel);
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default LogRoute;
