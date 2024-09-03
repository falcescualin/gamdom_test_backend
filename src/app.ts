import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { NextFunction, Response } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';

import HttpError from '@classes/HttpError';
import { APP_NAME, CREDENTIALS, LOG_FORMAT, NODE_ENV, ORIGIN, PORT } from '@config';
import { Routes } from '@interfaces/routes.interface';
import { logger, stream } from '@logger/index';
import { initializeMockEvents } from '@mocks/event.mock';
import { initializeMockUsers } from '@mocks/user.mock';
import { sequilizeInstance } from 'db';

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(route: Routes) {
    this.app = express();

    this.env = NODE_ENV || 'dev';
    this.port = PORT || 3000;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(route);
    this.initializeErrorHandling();
    this.initializeUserMock();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`============ ENV: ${this.env} ===========`);
      logger.info(`🚀 ${APP_NAME} started on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private connectToDatabase() {
    try {
      sequilizeInstance.authenticate();
      sequilizeInstance.sync();

      logger.info('Connected to PostgreSQL database successfully');
    } catch (err) {
      console.error('Failed to connect to PostgreSQL database:', err.stack);
    }
  }

  public async closeConnection() {
    try {
      await sequilizeInstance.close();
      logger.info('Database connection closed successfully');
    } catch (err) {
      console.error('Error closing the database connection:', err.stack);
    }
  }

  private initializeMiddlewares() {
    try {
      this.app.use(morgan(LOG_FORMAT, { stream }));
      this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
      this.app.use(hpp());
      this.app.use(helmet());
      this.app.use(compression());
      // TODO modify limit per route
      this.app.use(express.json({ limit: '50mb' }));
      this.app.use(express.urlencoded({ extended: true }));
      this.app.use(cookieParser());
    } catch (err) {
      logger.error(err);
    }
  }

  private initializeRoutes(route: Routes) {
    this.app.use('/api', route.getRouter());
  }

  private initializeErrorHandling() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.app.use((err: HttpError, _req, res: Response, next: NextFunction) => {
      if (NODE_ENV === 'dev') {
        logger.error(err);

        return res.status(err.status || 500).json({
          success: false,
          message: err.message,
          errors: err.stack,
        });
      } else
        return res.status(err.status || 500).json({
          success: false,
          message: err.message,
        });
    });
  }

  private initializeUserMock() {
    if (this.env === 'dev') {
      initializeMockUsers();
      initializeMockEvents();
    }
  }
}

export default App;
