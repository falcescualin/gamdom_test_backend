import { logger } from '@logger/index';
import { Event as EventModel } from '@models/event.model';

export class EventService {
  private static instance: EventService;

  public static getInstance(): EventService {
    if (!EventService.instance) {
      EventService.instance = new EventService();
    }
    return EventService.instance;
  }

  constructor() {}

  public async getEvents() {
    const events = await EventModel.findAndCountAll();

    logger.info(`Events found ${JSON.stringify(events)}`);

    return events;
  }
}
