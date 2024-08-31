/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED                                   ##
 * ##                                                           ##
 * ## AUTHOR: Alin Falcescu                                     ##
 * ---------------------------------------------------------------
 */

export enum UISortKeys {
  CreatedAt = 'createdAt',
  UpdatedAt = 'updatedAt',
  Email = 'email',
  Role = 'role',
  EmailVerified = 'emailVerified',
  LastSignInAt = 'lastSignInAt',
}

export enum UISortDirections {
  Asc = 'asc',
  Desc = 'desc',
}

export enum UIUserBlockTypes {
  HARD = 'HARD',
  SOFT = 'SOFT',
}

export enum UIRoles {
  SUPER_ADMIN = 'SUPER_ADMIN',
  USER = 'USER',
}

export enum UITokenJWTTypes {
  ACCESS = 'ACCESS',
  REFRESH = 'REFRESH',
}

export enum UILogLevels {
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Verbose = 'verbose',
  Debug = 'debug',
  Silly = 'silly',
}

export interface UIUser {
  id: string;
  /** @format email */
  email: string;
  role: UIRoles;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  lastSignInAt?: Date;
}

export interface UIGenericHttpError {
  /**
   * Error code
   * @example 400
   */
  code?: UIHttpStatusCodes;
  /** Error message */
  message?: string;
}

export enum UIHttpStatusCodes {
  Value200 = 200,
  Value400 = 400,
  Value401 = 401,
  Value404 = 404,
  Value500 = 500,
}

export interface UIUserResponseSuccessData {
  items?: UIUser[];
  /**
   * Total number of users
   * @min 0
   * @example 100
   */
  totalCount?: number;
}

export interface UILoginResponseSuccessData {
  /**
   * Indicates whether the request was successful
   * @example true
   */
  success: boolean;
  data: {
    user: UIUser;
    tokens: {
      /** Access token */
      accessToken: string;
      /** Refresh token */
      refreshToken: string;
    };
  };
}

export interface UIMeResponseSuccessData {
  user: UIUser;
}

export interface UILoggerUpdatePayload {
  level?: UILogLevels;
}

export interface UIRefreshCreatePayload {
  /** Refresh token */
  refreshToken?: string;
}

export type UIRefreshCreateError = UIGenericHttpError;

export type UIGetAuthData = UIMeResponseSuccessData;

export type UIGetAuthError = UIGenericHttpError;

export interface UILoginCreatePayload {
  /** @format email */
  email: string;
  /**
   * Password must contain at least 1 lowercase, 1 uppercase, 1 number, 1 special character, and be 6-30 characters long.
   * @minLength 6
   * @maxLength 30
   * @pattern ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,30}$
   */
  password: string;
}

export type UILoginCreateData = UILoginResponseSuccessData;

export type UILoginCreateError = UIGenericHttpError;

export interface UIRegisterCreatePayload {
  /** @format email */
  email: string;
  /**
   * Password must contain at least 1 lowercase, 1 uppercase, 1 number, 1 special character, and be 6-30 characters long.
   * @minLength 6
   * @maxLength 30
   * @pattern ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,30}$
   */
  password: string;
}

export type UIRegisterCreateError = UIGenericHttpError;

export interface UIRefreshPasswordCreatePayload {
  /** @format email */
  email: string;
}

export interface UIInviteCreatePayload {
  /** @format email */
  email: string;
}

export interface UIUsersListParams {
  /**
   * Page number
   * @min 1
   * @default 1
   */
  page?: number;
  /**
   * Number of items per page
   * @min 1
   * @max 100
   * @default 10
   */
  limit?: number;
  id?: string;
  /**
   * Email address
   * @format email
   */
  email?: string;
  /**
   * Sort by field
   * @default "createdAt"
   */
  sortKey?: UISortKeys;
  /**
   * Sort direction
   * @default "asc"
   */
  sortDir?: UISortDirections;
  /** Search query */
  search?: string;
}

export interface UIUsersCreatePayload {
  username?: string;
  email?: string;
  /**
   * Password must contain at least 1 lowercase, 1 uppercase, 1 number, 1 special character, and be 6-30 characters long.
   * @format password
   * @minLength 6
   * @maxLength 30
   * @pattern ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,30}$
   */
  password?: string;
}

export type UIUsersCreateData = any;

export interface UIUsersDetailData {
  id?: string;
  username?: string;
  email?: string;
}
