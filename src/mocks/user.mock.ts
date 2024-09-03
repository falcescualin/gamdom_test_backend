import { UIRoles } from '@generated/data-contracts';
import { logger } from '@logger/index';
import { User as UserModel } from '@models/user.model';

export const mockUsers = [
  {
    id: '166fbabf-e306-42ab-bc08-f7e01d1c403a',
    email: 'falcescu.alin@gmail.com',
    password: 'Test1234_',
    role: UIRoles.SUPER_ADMIN,
  },
  {
    id: 'c6dfa76e-1a28-40a9-97f4-2f8672ba62fa',
    email: 'falcescu.alin+SUPER_ADMIN@gmail.com',
    password: 'Test1234_',
    role: UIRoles.SUPER_ADMIN,
  },
  {
    id: '6022dd4e-3646-44db-8705-608279ad1346',
    email: 'falcescu.alin+USER@gmail.com',
    password: 'Test1234_',
    role: UIRoles.USER,
  },
];

export const initializeMockUsers = async (): Promise<void> => {
  try {
    const emails = mockUsers.map(user => user.email.toLowerCase());

    // Fetch existing users by email
    const existingUsers = await UserModel.findAll({
      where: {
        email: emails,
      },
    });

    const existingEmails = existingUsers.map(user => user.email.toLowerCase());
    const usersToBeAdded = mockUsers.filter(user => !existingEmails.includes(user.email.toLowerCase()));

    // Create new user instances
    const userDocsToBeAdded = usersToBeAdded.map(user => {
      return UserModel.build({ ...user });
    });

    for (const user of userDocsToBeAdded) {
      await user.save();
      logger.info(`Mock user ${user.email} initialized`);
    }

    logger.info('Mock users initialized');
  } catch (error) {
    logger.error('Error initializing mock users', error);
  }
};
