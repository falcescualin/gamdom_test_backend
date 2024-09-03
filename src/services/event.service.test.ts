import { logger } from '@logger/index';
import { Event as EventModel } from '@models/event.model';

import { EventService } from './event.service';

jest.mock('@models/event.model');
jest.mock('@logger/index');

describe('[EventService]', () => {
  let eventService: EventService;

  beforeAll(() => {
    eventService = EventService.getInstance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return events and log the information', async () => {
    const mockEvents = { count: 2, rows: [{ id: 1 }, { id: 2 }] };
    (EventModel.findAndCountAll as jest.Mock).mockResolvedValue(mockEvents);

    const events = await eventService.getEvents();

    expect(EventModel.findAndCountAll).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledWith(`Events found ${JSON.stringify(mockEvents)}`);
    expect(events).toEqual(mockEvents);
  });
});
