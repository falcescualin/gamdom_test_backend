import { existsSync, mkdirSync } from 'fs';

import { format } from 'winston';

export const ensureLogDirectory = (dirPath: string) => {
  if (!existsSync(dirPath)) {
    try {
      mkdirSync(dirPath);
    } catch (err) {
      console.error(`Error creating log directory: ${err}`);
      // Handle or throw the error accordingly
    }
  }
};

export const logFormat = format.printf(({ timestamp, level, message, stack }) => {
  const callerInfo = stack ? `\n${stack}` : '';

  return `[${timestamp}] [${level.toUpperCase()}] [${callerInfo}] : [${message}]`;
});
