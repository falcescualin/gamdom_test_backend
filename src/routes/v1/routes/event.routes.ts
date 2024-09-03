import { Router } from 'express';

import { EventController } from '@controllers/event.controller';
import { Routes } from '@interfaces/routes.interface';
import { authMiddleware } from 'middleware/auth.middleware';

class EventRoute implements Routes {
  public router = Router();
  private eventController: EventController = new EventController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', authMiddleware(), this.eventController.getEvents);
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default EventRoute;
