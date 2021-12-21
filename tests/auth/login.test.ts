import 'ts-jest/utils';
import request from 'supertest';
import { Application } from 'express';
import { Connection } from 'typeorm';
import { getApp } from '../utils/getApp';
import { LoginDto } from '../../src/auth/dtos/LoginDto';
import { appContainer } from '../../inversify.config';
import { RegisterService } from '../../src/auth/services/RegisterService';
import { authTypes } from '../../src/auth/authTypes';
import { ApiErrorResponse } from '../../src/common/types/ApiErrorResponse';
import { TokenDto } from '../../src/auth/dtos/TokenDto';
import { HttpStatus } from '../../src/common/types/HttpStatus';
import { RegisterDto } from '../../src/auth/dtos/RegisterDto';
import { closeMemoryMongoServer, connectToDatabase } from '../../src/common/databaseConnection';

const login = (app: Application, email: any, password: any) => request(app)
  .post('/auth/login')
  .send(new LoginDto(email, password));

describe('Login tests', () => {
  const createdUser = new RegisterDto('john@mail.com', '12345');

  let app: Application;
  let dbConnection: Connection;

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

  beforeAll(async () => {
    dbConnection = await connectToDatabase();
    app = getApp();
    const registerService = appContainer.get<RegisterService>(authTypes.RegisterService);
    await registerService.registerUser(createdUser);
  });

  afterAll(async () => {
    await dbConnection.close();
    await closeMemoryMongoServer();
  });
});
