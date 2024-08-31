import { HttpStatusCode } from 'axios';

import HttpError from '@classes/HttpError';
import { UILoginResponseSuccessData, UIMeResponseSuccessData, UITokenJWTTypes, UIUser } from '@generated/data-contracts';
import { User as UserModel } from '@models/user.model';
import { generateJWTToken, isValidEmailDomain } from '@utils/auth.utils';

export class AuthService {
  private static instance: AuthService;

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(email: string, password: string): Promise<UILoginResponseSuccessData['data']> {
    const user = await UserModel.findOne({ where: { email } });

    if (!user) {
      throw new HttpError(HttpStatusCode.NotFound, 'Invalid email or password');
    }

    const isPasswordMatching: boolean = await user.comparePassword(password);

    if (!isPasswordMatching) {
      throw new HttpError(HttpStatusCode.Unauthorized, 'Invalid email or password');
    }

    const accessToken = generateJWTToken(UITokenJWTTypes.ACCESS, {
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateJWTToken(UITokenJWTTypes.REFRESH, {
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: user.toJSON(),
      tokens: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    };
  }

  // TODO more complex validations
  public async register(email: string, password: string): Promise<UILoginResponseSuccessData['data']> {
    const existingUser = await UserModel.findOne({ where: { email } });

    if (!(await isValidEmailDomain(email))) {
      throw new HttpError(HttpStatusCode.BadRequest, 'Invalid email domain');
    }

    if (existingUser) {
      throw new HttpError(HttpStatusCode.Conflict, 'Email already registered');
    }

    const newUser = new UserModel({ email, password });

    await newUser.save();

    const data = await this.login(email, password);

    return data;
  }

  public async me(user: UIUser): Promise<UIMeResponseSuccessData> {
    const foundUser = await UserModel.findOne({ where: { email: user.email } });

    if (!foundUser) {
      throw new HttpError(HttpStatusCode.NotFound, 'User not found');
    }

    return {
      user: foundUser.toJSON(),
    };
  }

  public async generateAccessToken(email: string): Promise<string> {
    const user = await UserModel.findOne({ where: { email } });

    if (!user) {
      throw new HttpError(HttpStatusCode.NotFound, 'User not found');
    }

    const accessToken = generateJWTToken(UITokenJWTTypes.ACCESS, {
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return accessToken;
  }

  public async generateRefreshToken(email: string): Promise<string> {
    const user = await UserModel.findOne({ where: { email } });

    if (!user) {
      throw new HttpError(HttpStatusCode.NotFound, 'User not found');
    }

    const refreshToken = generateJWTToken(UITokenJWTTypes.REFRESH, {
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return refreshToken;
  }
}
