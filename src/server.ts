import validateEnv from '@utils/env.utils';
import { sequilizeInstance } from 'db';

import App from './app';
import { logger } from './logger';
import Routes from './routes';

try {
  validateEnv();

  const app = new App(new Routes());

  app.listen();

  process.on('SIGTERM', async () => {
    logger.info('SIGTERM signal received.');
    await sequilizeInstance.close();
    logger.info('Database connection closed.');
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    logger.info('SIGINT signal received.');
    await sequilizeInstance.close();
    logger.info('Database connection closed.');
    process.exit(0);
  });

  process.on('unhandledRejection', reason => {
    logger.error(`Reason: ${reason}`);
  });

  process.on('uncaughtException', err => {
    logger.error(`Uncaught Exception: ${err.message}`);
  });
} catch (err) {
  console.error(err, err.stack);
}
