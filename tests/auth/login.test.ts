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
import { HttpStatus } from '../../src/common/types/HttpStatus';

const login = (app: Application, email: any, password: any) => request(app)
  .post('/auth/login')
  .send(new LoginDto(email, password));

describe('Login tests', () => {
  let app: Application;
  const createdUser = new User('john@mail.com', '12345');

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
    await login(app, 'myemail@mail.com', 'awesomepasswd').expect(401);
  });

  it('Login_ShouldReturnBadRequest_WhenEmailIsInvalid', async () => {
    await Promise.all(['', 'mail.com', '  mail@', 'email@mail'].map(async (invalidEmail) => {
      const res: ApiErrorResponse =
        (await login(app, invalidEmail, 'awesomepasswd').expect(HttpStatus.BadRequest)).body;
      expect(res.errors?.email).toBeDefined();
    }));
  });

  it('Login_ShouldReturnBadRequest_WhenPasswordIsInvalid', async () => {
    await Promise.all(['', null, undefined].map(async (invalidPwd) => {
      const res: ApiErrorResponse =
        (await login(app, 'valid@mail.com', invalidPwd).expect(HttpStatus.BadRequest)).body;
      expect(res.errors?.password).toBeDefined();
    }));
  });

  it('Login_ShouldReturnToken_WhenCredentialsAreValid', async () => {
    const res: TokenDto =
      (await login(app, createdUser.email, createdUser.password)
        .expect(HttpStatus.Success)).body;
    expect(res.accessToken).toBeDefined();
    expect(res.refreshToken).toBeDefined();
  });
});
