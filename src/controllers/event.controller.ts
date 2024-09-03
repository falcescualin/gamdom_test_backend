import { HttpStatusCode } from 'axios';
import { Response } from 'express';

import HttpError from '@classes/HttpError';
import { RequestWithUser } from '@interfaces/auth.interface';
import { logger } from '@logger/index';
import { EventService } from '@services/event.service';

export class EventController {
  private eventService: EventService;

  constructor() {
    this.eventService = EventService.getInstance();
  }
  public getEvents = async (req: RequestWithUser, res: Response) => {
    try {
      const events = await this.eventService.getEvents();

      return res.status(HttpStatusCode.Ok).json({
        success: true,
        data: events,
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
