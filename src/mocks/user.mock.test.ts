import { logger } from '@logger/index';
import { initializeMockUsers } from '@mocks/user.mock';
import { User as UserModel } from '@models/user.model';

jest.mock('@models/user.model');
jest.mock('@logger/index');

describe('initializeMockUsers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle errors during user initialization', async () => {
    (UserModel.findAll as jest.Mock).mockRejectedValue(new Error('Database error'));

    (logger.error as jest.Mock).mockImplementation();

    await initializeMockUsers();

    expect(logger.error).toHaveBeenCalledWith('Error initializing mock users', expect.any(Error));
  });
});
