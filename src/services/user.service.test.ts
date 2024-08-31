import { HttpStatusCode } from 'axios';
import sinon from 'sinon';

import HttpError from '@classes/HttpError';
import { logger } from '@logger/index';
import { User as UserModel } from '@models/user.model';
import { UserService } from '@services/user.service'; // Adjust the import path

describe('UserService', () => {
  let userService: UserService;
  let findByPkStub: sinon.SinonStub;
  let saveStub: sinon.SinonStub;
  let loggerDebugStub: sinon.SinonStub;

  beforeEach(() => {
    userService = UserService.getInstance();
    findByPkStub = sinon.stub(UserModel, 'findByPk');
    saveStub = sinon.stub();
    loggerDebugStub = sinon.stub(logger, 'debug');

    // Mock `save` method
    UserModel.prototype.save = saveStub;
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return user by ID', async () => {
    const user = {
      id: '1',
      email: 'test@example.com',
      favorites: ['fav1', 'fav2'],
      toJSON: () => ({ id: '1', email: 'test@example.com', favorites: ['fav1', 'fav2'] }),
    };

    findByPkStub.resolves(user);

    const result = await userService.getUserById('1');
    expect(result).toEqual(user.toJSON());
  });

  it('should throw error if user not found', async () => {
    findByPkStub.resolves(null);

    await expect(userService.getUserById('1')).rejects.toThrowError(new HttpError(HttpStatusCode.NotFound, 'User not found'));
  });

  it('should return user favorites', async () => {
    const user = {
      id: '1',
      favorites: ['fav1', 'fav2'],
      toJSON: () => ({ id: '1', favorites: ['fav1', 'fav2'] }),
    };

    findByPkStub.resolves(user);

    const result = await userService.getFavorites('1');
    expect(result).toEqual(['fav1', 'fav2']);
  });

  it('should add a favorite if not already present', async () => {
    const user = {
      id: '1',
      favorites: ['fav1'],
      save: saveStub,
    };

    findByPkStub.resolves(user);

    await userService.addFavorite('1', 'fav2');
    expect(user.favorites).toContain('fav2');
    expect(saveStub.calledOnce).toBe(true);
    expect(loggerDebugStub.calledWith('User 1 added favorite fav2')).toBe(true);
  });

  it('should not add a favorite if it already exists', async () => {
    const user = {
      id: '1',
      favorites: ['fav1'],
      save: saveStub,
    };

    findByPkStub.resolves(user);

    await userService.addFavorite('1', 'fav1');
    expect(user.favorites).toEqual(['fav1']); // Favorites should remain unchanged
    expect(saveStub.notCalled).toBe(true);
    expect(loggerDebugStub.calledWith('Favorite already exists fav1')).toBe(true);
  });

  it('should remove a favorite', async () => {
    const user = {
      id: '1',
      favorites: ['fav1', 'fav2'],
      save: saveStub,
    };

    findByPkStub.resolves(user);

    await userService.removeFavorite('1', 'fav1');
    expect(user.favorites).toEqual(['fav2']);
    expect(saveStub.calledOnce).toBe(true);
    expect(loggerDebugStub.calledWith('User 1 removed favorite fav1')).toBe(true);
  });

  it('should throw error if removing a non-existent favorite', async () => {
    const user = {
      id: '1',
      favorites: ['fav2'],
      save: saveStub,
    };

    findByPkStub.resolves(user);

    await userService.removeFavorite('1', 'fav1');
    expect(user.favorites).toEqual(['fav2']); // Favorites should remain unchanged
  });
});
