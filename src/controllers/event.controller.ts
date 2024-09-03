import { HttpStatusCode } from 'axios';
import { Response } from 'express';

import HttpError from '@classes/HttpError';
import { RequestWithUser } from '@interfaces/auth.interface';
import { logger } from '@logger/index';
import { Event as EventModel } from '@models/event.model';

export class EventController {
  public getEvents = async (req: RequestWithUser, res: Response) => {
    try {
      const events = await EventModel.findAll();

      logger.info('Events retrieved', events);

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
