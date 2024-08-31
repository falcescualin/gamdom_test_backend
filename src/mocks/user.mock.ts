import { UIRoles } from '@generated/data-contracts';
import { logger } from '@logger/index';
import { User as UserModel } from '@models/user.model';

export const mockUsers = [
  {
    id: '65c33f5659fe406430245074',
    email: 'falcescu.alin+SUPER_ADMIN@gmail.com',
    password: 'Test1234_',
    role: UIRoles.SUPER_ADMIN,
  },
  {
    id: '65c33f5659fe406430245075',
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
