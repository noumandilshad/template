import 'ts-jest/utils';
import request from 'supertest';
import { Application } from 'express';
import { Repository } from 'typeorm';
import { getApp } from '../utils/getApp';
import { LoginDto } from '../../src/auth/dtos/LoginDto';
import { appContainer } from '../../inversify.config';
import { MongoDbConnection } from '../../src/common/MongoDbConnection';
import { commonTypes } from '../../src/common/commonTypes';
import { User } from '../../src/user/models/User';
import { RegisterService } from '../../src/auth/services/RegisterService';
import { authTypes } from '../../src/auth/authTypes';
import { TokenDto } from '../../src/auth/dtos/TokenDto';
import { RefreshTokenDto } from '../../src/auth/dtos/RefreshTokenDto';
import { ApiErrorResponse } from '../../src/common/types/ApiErrorResponse';
import { ApiErrorMessage } from '../../src/common/error/ApiErrorMessage';
import { RefreshToken } from '../../src/auth/models/RefreshToken';

const login = (app: Application, email: string, password: string) => request(app)
  .post('/auth/login')
  .send(new LoginDto(email, password));

const refreshToken = (app: Application, email: string, token: string) => request(app)
  .post('/auth/refresh')
  .send(new RefreshTokenDto(
    email,
    token,
  ));

describe('Refresh Token tests', () => {
  const password = '12345';
  let createdUser = new User('john@mail.com', password);

  let app: Application;
  let refreshTokenRepository: Repository<RefreshToken>;

  beforeAll(async () => {
    app = await getApp();
    refreshTokenRepository = appContainer.get<Repository<RefreshToken>>(authTypes.RefreshTokenRepository);
    const registerService = appContainer.get<RegisterService>(authTypes.RegisterService);
    createdUser = await registerService.registerUser(createdUser);
  });
  afterAll(async () => {
    await appContainer.get<MongoDbConnection>(commonTypes.MongoDbConnection).closeConnection();
    // FIXME: test are not exiting. this is a temporary fix
    setTimeout(() => process.exit(), 1000);
  });

  it('RefreshToken_ShouldReturnUnauthorized_WhenTokenNotInDb', async () => {
    const tokenDto: TokenDto = (
      await login(
        app,
        createdUser.email,
        password,
      ).expect(200)
    ).body;

    const apiError: ApiErrorResponse = (
      await refreshToken(
        app,
        createdUser.email,
        `someStrThatInvalidatesTheToken${tokenDto.refreshToken}`,
      ).expect(401)
    ).body;
    expect(apiError.code).toBe(ApiErrorMessage.unauthorized.code);
    expect(apiError.message).toBe(ApiErrorMessage.unauthorized.message);
  });

  it('RefreshToken_ShouldReturnUnauthorized_WhenTokenWasAlreadyUsed', async () => {
    const tokenDto: TokenDto = (
      await login(app, createdUser.email, password).expect(200)
    ).body;

    // Use token to get a new accessToken
    await refreshToken(app, createdUser.email, tokenDto.refreshToken).expect(200);

    // Try to use it again
    const apiError: ApiErrorResponse = (
      await refreshToken(app, createdUser.email, tokenDto.refreshToken).expect(401)
    ).body;

    expect(apiError.code).toBe(ApiErrorMessage.unauthorized.code);
    expect(apiError.message).toBe(ApiErrorMessage.unauthorized.message);
  });

  it('RefreshToken_ShouldReturnUnauthorized_WhenEmailDoesntMatch', async () => {
    const tokenDto: TokenDto = (
      await login(app, createdUser.email, password).expect(200)
    ).body;

    const apiError: ApiErrorResponse = (
      await refreshToken(app, 'someother@mail.com', tokenDto.refreshToken).expect(401)
    ).body;

    expect(apiError.code).toBe(ApiErrorMessage.unauthorized.code);
    expect(apiError.message).toBe(ApiErrorMessage.unauthorized.message);
  });

  it('RefreshToken_ShouldBeSuccessful_WhenPayloadIsValid', async () => {
    const tokenDto: TokenDto = (
      await login(app, createdUser.email, password).expect(200)
    ).body;

    const res: TokenDto = (
      await refreshToken(app, createdUser.email, tokenDto.refreshToken).expect(200)
    ).body;

    expect(res.accessToken).toBeDefined();
    expect(res.refreshToken).toBeDefined();
  });
  it('RefreshToken_ShouldReturnUnauthorized_WhenTokenIsExpired', async () => {
    const expiredRefreshToken = new RefreshToken(
      'someToken',
      Date.now(),
      createdUser.id!.toString(),
      false,
    );
    refreshTokenRepository.create(expiredRefreshToken);

    const res: ApiErrorMessage = (
      await refreshToken(app, createdUser.email, expiredRefreshToken.token).expect(401)
    ).body;

    expect(res.code).toBe(ApiErrorMessage.unauthorized.code);
    expect(res.message).toBe(ApiErrorMessage.unauthorized.message);
  });
});
