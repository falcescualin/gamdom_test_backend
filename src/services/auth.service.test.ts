import { faker } from '@faker-js/faker';
import { HttpStatusCode } from 'axios';

import HttpError from '@classes/HttpError';
import { UIRoles, UITokenJWTTypes, UIUser } from '@generated/data-contracts';
import { User as UserModel } from '@models/user.model';
import { generateJWTToken, isValidEmailDomain } from '@utils/auth.utils';

import { AuthService } from './auth.service';

jest.mock('@models/user.model');
jest.mock('@utils/auth.utils');

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = AuthService.getInstance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully and return user and tokens', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        role: 'USER',
        comparePassword: jest.fn().mockResolvedValue(true),
        toJSON: jest.fn().mockReturnValue({ id: 'user-id', email: 'test@example.com' }),
      };

      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
      (generateJWTToken as jest.Mock).mockImplementation((type: UITokenJWTTypes) => `${type}-token`);

      const result = await authService.login('test@example.com', 'password');

      expect(result).toEqual({
        user: { id: 'user-id', email: 'test@example.com' },
        tokens: {
          accessToken: 'ACCESS-token',
          refreshToken: 'REFRESH-token',
        },
      });
    });

    it('should throw an error if user not found', async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(authService.login('test@example.com', 'password')).rejects.toThrow(
        new HttpError(HttpStatusCode.NotFound, 'Invalid email or password')
      );
    });

    it('should throw an error if password is incorrect', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        role: 'USER',
        comparePassword: jest.fn().mockResolvedValue(false),
      };

      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);

      await expect(authService.login('test@example.com', 'password')).rejects.toThrow(
        new HttpError(HttpStatusCode.Unauthorized, 'Invalid email or password')
      );
    });
  });

  describe('register', () => {
    it('should register a new user and return login data', async () => {
      (isValidEmailDomain as jest.Mock).mockResolvedValue(true);
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);

      const mockUser: UIUser = {
        id: 'user-id',
        email: 'test@example.com',
        role: UIRoles.SUPER_ADMIN,
        createdAt: faker.date.recent().toISOString(),
      };

      (UserModel.build as jest.Mock).mockReturnValue({ ...mockUser, password: 'password', save: jest.fn().mockResolvedValue(true) });
      (generateJWTToken as jest.Mock).mockImplementation((type: UITokenJWTTypes) => `${type}-token`);
      jest.spyOn(authService, 'login').mockResolvedValue({
        user: mockUser,
        tokens: {
          accessToken: 'ACCESS-token',
          refreshToken: 'REFRESH-token',
        },
      });

      const result = await authService.register('test@example.com', 'password');

      expect(result).toEqual({
        user: { id: mockUser.id, email: mockUser.email, role: mockUser.role, createdAt: mockUser.createdAt },
        tokens: {
          accessToken: 'ACCESS-token',
          refreshToken: 'REFRESH-token',
        },
      });
    });

    it('should throw an error if email is already registered', async () => {
      const mockExistingUser = {
        id: 'existing-user-id',
        email: 'test@example.com',
      };

      (UserModel.findOne as jest.Mock).mockResolvedValue(mockExistingUser);
      (isValidEmailDomain as jest.Mock).mockResolvedValue(true);

      await expect(authService.register('test@example.com', 'password')).rejects.toThrow(
        new HttpError(HttpStatusCode.Conflict, 'Email already registered')
      );
    });

    it('should throw an error if email domain is invalid', async () => {
      const mockExistingUser = {
        id: 'existing-user-id',
        email: 'test@example.com',
      };

      (UserModel.findOne as jest.Mock).mockResolvedValue(mockExistingUser);
      (isValidEmailDomain as jest.Mock).mockResolvedValue(false);

      await expect(authService.register('test@example.com', 'password')).rejects.toThrow(
        new HttpError(HttpStatusCode.BadRequest, 'Invalid email domain')
      );
    });
  });

  describe('me', () => {
    it('should return user data', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        role: 'USER',
        toJSON: jest.fn().mockReturnValue({ id: 'user-id', email: 'test@example.com' }),
      };

      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.me({
        email: 'test@example.com',
        id: faker.string.uuid(),
        role: UIRoles.SUPER_ADMIN,
        createdAt: '',
      });

      expect(result).toEqual({
        user: { id: 'user-id', email: 'test@example.com' },
      });
    });

    it('should throw an error if user not found', async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.me({
          email: 'test@example.com',
          id: faker.string.uuid(),
          role: UIRoles.SUPER_ADMIN,
          createdAt: faker.date.recent().toISOString(),
        })
      ).rejects.toThrow(new HttpError(HttpStatusCode.NotFound, 'User not found'));
    });
  });

  describe('generateAccessToken', () => {
    it('should generate and return an access token', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        role: 'USER',
      };

      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
      (generateJWTToken as jest.Mock).mockReturnValue('ACCESS-token');

      const result = await authService.generateAccessToken('test@example.com');

      expect(result).toBe('ACCESS-token');
    });

    it('should throw an error if user not found', async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(authService.generateAccessToken('test@example.com')).rejects.toThrow(new HttpError(HttpStatusCode.NotFound, 'User not found'));
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate and return a refresh token', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        role: 'USER',
      };

      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
      (generateJWTToken as jest.Mock).mockReturnValue('REFRESH-token');

      const result = await authService.generateRefreshToken('test@example.com');

      expect(result).toBe('REFRESH-token');
    });

    it('should throw an error if user not found', async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(authService.generateRefreshToken('test@example.com')).rejects.toThrow(new HttpError(HttpStatusCode.NotFound, 'User not found'));
    });
  });
});
