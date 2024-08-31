import { HttpStatusCode } from 'axios';
import { Response } from 'express';

import HttpError from '@classes/HttpError';
import { UILogLevels } from '@generated/data-contracts';
import { RequestWithUser } from '@interfaces/auth.interface';
import { logger } from '@logger/index';

export class LogController {
  public putLogLevel = async (req: RequestWithUser, res: Response) => {
    try {
      const { level } = req.body as { level: UILogLevels };
      const loggLevelBefore = logger.level;

      if (level === loggLevelBefore) {
        logger.warn(`Log level request by ${req.user?.email} but log levels are the same ${loggLevelBefore} = ${logger.level}`);

        return res.status(HttpStatusCode.NotModified).send();
      }

      logger.level = level;

      logger.warn(`Log level changed from ${loggLevelBefore} to ${logger.level} by ${req.user?.email}`);

      return res.status(HttpStatusCode.Ok).json({
        success: true,
        data: { level: logger.level },
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
