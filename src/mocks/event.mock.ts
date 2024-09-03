import { IEvent } from '@generated/data-contracts';
import { logger } from '@logger/index';
import { Event as EventModel } from '@models/event.model';

export const mockEvents: IEvent[] = [
  {
    event_id: 'af187a78-524f-470d-a39f-9b0a0a6d8f7c',
    event_name: 'Rapid vs FCSB',
    odds: { win: 2.0, draw: 3.5, lose: 3.8 },
  },
  {
    event_id: '150070d6-937a-489e-8ad9-c7aafaef8329',
    event_name: 'Barcelona vs Real Madrid',
    odds: { win: 1.9, draw: 4.0, lose: 4.2 },
  },
  {
    event_id: '05b4fe4e-9cd2-42d0-836a-d8f830291b50',
    event_name: 'Manchester City vs Liverpool',
    odds: { win: 1.8, draw: 3.6, lose: 4.0 },
  },
  {
    event_id: '7179e874-ab0d-45b8-8a43-111136a3a152',
    event_name: 'Juventus vs AC Milan',
    odds: { win: 2.1, draw: 3.4, lose: 3.6 },
  },
  {
    event_id: '66dfa337-2543-4c06-8a4a-6950d8b820f6',
    event_name: 'PSG vs Lyon',
    odds: { win: 1.7, draw: 3.8, lose: 4.4 },
  },
];

export const initializeMockEvents = async (): Promise<void> => {
  try {
    const existingEvents = await EventModel.findAll({
      where: {
        event_id: mockEvents.map(event => event.event_id),
      },
    });

    logger.info(`Existing events ${JSON.stringify(existingEvents)}`);

    const existingEventIds = existingEvents.map(event => event.event_id);

    const eventsToBeAdded = mockEvents.filter(event => !existingEventIds.includes(event.event_id));

    const eventsDocsToBeAdded = eventsToBeAdded.map(event => {
      return EventModel.build({ ...event });
    });

    logger.info(`Events to be added ${JSON.stringify(eventsDocsToBeAdded)}`);

    for (const event of eventsDocsToBeAdded) {
      await event.save();
      logger.info(`Mock event ${event.event_name} initialized`);
    }

    logger.info('Mock events initialized');
  } catch (error) {
    logger.error('Error initializing mock event', error);
  }
};
