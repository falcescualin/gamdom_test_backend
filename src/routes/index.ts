import { Router } from 'express';

import { Routes } from '@interfaces/routes.interface';

import V1Route from './v1';

class ApiRoutes implements Routes {
  public path = '/v1';
  public router = Router();
  public v1Routes = new V1Route();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(this.path, this.v1Routes.getRouter());
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default ApiRoutes;
