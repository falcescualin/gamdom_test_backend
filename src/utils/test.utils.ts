import { Dialect } from 'sequelize';
import { Model, Sequelize } from 'sequelize-typescript';

import { User } from '@models/user.model';

const testConfig = {
  dialect: 'postgres' as Dialect,
  storage: ':memory:', // Use in-memory SQLite for tests
  logging: false,
  models: [User],
};

const sequelize = new Sequelize(testConfig);

export const connectTestDb = async () => {
  await sequelize.sync({ force: true });
};

export const disconnectTestDb = async () => {
  await sequelize.close();
};

export const clearTestDatabase = async () => {
  const models = sequelize.modelManager.models;
  for (const model of models) {
    await (model as typeof Model & (new () => Model)).truncate({ cascade: true });
  }
};
