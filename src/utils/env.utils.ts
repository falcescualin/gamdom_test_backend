import { cleanEnv, host, port, str } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    APP_NAME: str(),
    NODE_ENV: str({ choices: ['dev', 'stage', 'prod'] }),
    PORT: port(),

    DB_HOST: host(),
    DB_PORT: port(),
    DB_USER: str(),
    DB_PASSWORD: str(),
    DB_NAME: str(),

    SECRET_KEY: str(),

    LOG_DIR: str(),
    LOG_FORMAT: str({ choices: ['tiny'] }),
    LOG_LEVEL: str({ choices: ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'] }),

    ORIGIN: str(),
    CREDENTIALS: str({ choices: ['true', 'false'] }),
  });
};

export default validateEnv;
