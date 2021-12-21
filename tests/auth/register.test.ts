import 'ts-jest/utils';
import request from 'supertest';
import { Application } from 'express';
import { Connection } from 'typeorm';
import { getApp } from '../utils/getApp';
import { appContainer } from '../../inversify.config';
import { RegisterService } from '../../src/auth/services/RegisterService';
import { authTypes } from '../../src/auth/authTypes';
import { RegisterDto } from '../../src/auth/dtos/RegisterDto';
import { ApiErrorMessage } from '../../src/common/error/ApiErrorMessage';
import { ApiErrorResponse } from '../../src/common/types/ApiErrorResponse';
import { UserDto } from '../../src/user/dtos/UserDto';
import { HttpStatus } from '../../src/common/types/HttpStatus';
import { closeMemoryMongoServer, connectToDatabase } from '../../src/common/databaseConnection';

const register = (app: Application, email: any, password: any, phone?: any) => request(app)
  .post('/auth/register')
  .send(new RegisterDto(email, password, phone));

describe('Register tests', () => {
  const registeredUser = new RegisterDto('paul@mail.com', '12345', '+351911911911');
  const validEmail = 'john@mail.com';
  const validPassword = 'somepwd';
  const validPhone = '+49911911911';
  let app: Application;
  let dbConnection: Connection;

  it('Register_ShouldReturnError_WhenEmailAlreadyExists', async () => {
    const res: ApiErrorResponse = (await register(app, registeredUser.email, validPassword)
      .expect(ApiErrorMessage.emailAlreadyInUse.statusCode)
    ).body;
    expect(res.code).toBe(ApiErrorMessage.emailAlreadyInUse.code);
    expect(res.message).toBe(ApiErrorMessage.emailAlreadyInUse.message);
  });

  it('Register_ShouldReturnError_WhenPhoneAlreadyExists', async () => {
    const res: ApiErrorResponse = (
      await register(app, validEmail, validPassword, registeredUser.phone)
        .expect(ApiErrorMessage.phoneAlreadyInUse.statusCode)
    ).body;
    expect(res.code).toBe(ApiErrorMessage.phoneAlreadyInUse.code);
    expect(res.message).toBe(ApiErrorMessage.phoneAlreadyInUse.message);
  });

  it('Register_ShouldReturnBadRequest_WhenEmailIsInvalid', async () => {
    await Promise.all(['', 'mail.com', '  mail@', 'email@mail'].map(async (invalidEmail) => {
      const res: ApiErrorResponse = (
        await register(app, invalidEmail, validPassword)
          .expect(HttpStatus.BadRequest)
      ).body;
      expect(res.errors?.email).toBeDefined();
    }));
  });

  it('Register_ShouldReturnBadRequest_WhenPasswordIsInvalid', async () => {
    await Promise.all(['', '1234', '  ', null].map(async (invalidPassword) => {
      const res: ApiErrorResponse = (
        await register(app, validEmail, invalidPassword)
          .expect(HttpStatus.BadRequest)
      ).body;
      expect(res.errors?.password).toBeDefined();
    }));
  });

  it('Register_ShouldReturnBadRequest_WhenPhoneIsInvalid', async () => {
    await Promise.all(['++', '911', '911911911'].map(async (invalidPhone) => {
      const res: ApiErrorResponse = (
        await register(app, validEmail, validPassword, invalidPhone)
          .expect(HttpStatus.BadRequest)
      ).body;
      expect(res.errors?.phone).toBeDefined();
    }));
  });

  it('Register_ShouldReturnUser_WhenFieldsAreValid', async () => {
    const res: UserDto = (
      await register(app, validEmail, validPassword, validPhone)
        .expect(HttpStatus.Created)
    ).body;
    expect(res.email).toBe(validEmail);
    expect(res.phone).toBe(validPhone);
    expect(res.id).toBeDefined();
  });

  beforeAll(async () => {
    dbConnection = await connectToDatabase();
    app = getApp();
    const registerService = appContainer.get<RegisterService>(authTypes.RegisterService);
    await registerService.registerUser(registeredUser);
  });

  afterAll(async () => {
    await dbConnection.close();
    await closeMemoryMongoServer();
  });
});
