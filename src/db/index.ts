import { Sequelize } from 'sequelize-typescript';

import { Event as EventModel } from '@models/event.model';
import { User as UserModel } from '@models/user.model';

export const sequilizeInstance = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  dialect: 'postgres',
  models: [UserModel, EventModel],
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  retry: {
    max: 5,
  },
});
