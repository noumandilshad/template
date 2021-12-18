import 'ts-jest/utils';
import request from 'supertest';
import { Application } from 'express';
import { getApp } from '../utils/getApp';
import { LoginDto } from '../../src/auth/dtos/LoginDto';
import { appContainer } from '../../inversify.config';
import { MongoDbConnection } from '../../src/common/MongoDbConnection';
import { commonTypes } from '../../src/common/commonTypes';
import { User } from '../../src/user/models/User';
import { RegisterService } from '../../src/auth/services/RegisterService';
import { authTypes } from '../../src/auth/authTypes';
import { ApiErrorResponse } from '../../src/common/types/ApiErrorResponse';
import { TokenDto } from '../../src/auth/dtos/TokenDto';

describe('Login', () => {
  let app: Application;
  const createdUser = new User('john', 'doe', 'john@mail.com', '12345');

  beforeAll(async () => {
    app = await getApp();
    const registerService = appContainer.get<RegisterService>(authTypes.RegisterService);
    await registerService.registerUser(createdUser);
  });
  afterAll(async () => {
    await appContainer.get<MongoDbConnection>(commonTypes.MongoDbConnection).closeConnection();
    // FIXME: test are not exiting. this is a temporary fix
    setTimeout(() => process.exit(), 1000);
  });

  it('Login_ShouldReturnUnauthorized_WhenUserDoesntExist', async () => {
    await request(app)
      .post('/auth/login')
      .send(new LoginDto('myemail@mail.com', 'awesomepasswd'))
      .set('content-type', 'application/json')
      .expect(401);
  });

  it('Login_ShouldReturnBadRequest_WhenEmailIsInvalid', async () => {
    await Promise.all(['', 'mail.com', '  mail@', 'email@mail'].map(async (invalidEmail) => {
      const res = await request(app)
        .post('/auth/login')
        .send(new LoginDto(invalidEmail, 'awesomepasswd'))
        .set('content-type', 'application/json')
        .expect(400);
      const body = res.body as ApiErrorResponse;
      expect(body.errors?.email).toBeDefined();
    }));
  });

  it('Login_ShouldReturnBadRequest_WhenPasswordIsInvalid', async () => {
    await Promise.all(['', null, undefined].map(async (invalidPwd) => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'valid@mail.com', password: invalidPwd })
        .set('content-type', 'application/json')
        .expect(400);
      const body = res.body as ApiErrorResponse;
      expect(body.errors?.password).toBeDefined();
    }));
  });

  it('Login_ShouldReturnToken_WhenCredentialsAreValid', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send(new LoginDto(createdUser.email, createdUser.password))
      .set('content-type', 'application/json')
      .expect(200);
    const body = res.body as TokenDto;
    expect(body.accessToken).toBeDefined();
    expect(body.refreshToken).toBeDefined();
  });
});
