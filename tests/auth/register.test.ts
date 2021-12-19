import 'ts-jest/utils';
import request from 'supertest';
import { Application } from 'express';
import { getApp } from '../utils/getApp';
import { appContainer } from '../../inversify.config';
import { MongoDbConnection } from '../../src/common/MongoDbConnection';
import { commonTypes } from '../../src/common/commonTypes';
import { User } from '../../src/user/models/User';
import { RegisterService } from '../../src/auth/services/RegisterService';
import { authTypes } from '../../src/auth/authTypes';
import { RegisterDto } from '../../src/auth/dtos/RegisterDto';
import { ApiErrorMessage } from '../../src/common/error/ApiErrorMessage';
import { ApiErrorResponse } from '../../src/common/types/ApiErrorResponse';
import { UserDto } from '../../src/user/dtos/UserDto';
import { HttpStatus } from '../../src/common/types/HttpStatus';

describe('Register tests', () => {
  const registerUrl = '/auth/register';
  const alreadyRegisteredUser = new User('paul@mail.com', '12345', '+351911911911');
  const validEmail = 'john@mail.com';
  const validPassword = 'somepwd';
  const validPhone = '+49911911911';
  let app: Application;

  it('Register_ShouldReturnError_WhenEmailAlreadyExists', async () => {
    const res = await request(app)
      .post(registerUrl)
      .send(new RegisterDto(alreadyRegisteredUser.email, validPassword))
      .set('content-type', 'application/json')
      .expect(ApiErrorMessage.emailAlreadyInUse.statusCode);
    const body = res.body as ApiErrorResponse;
    expect(body.code).toBe(ApiErrorMessage.emailAlreadyInUse.code);
    expect(body.message).toBe(ApiErrorMessage.emailAlreadyInUse.message);
  });

  it('Register_ShouldReturnError_WhenPhoneAlreadyExists', async () => {
    const res = await request(app)
      .post(registerUrl)
      .send(new RegisterDto(validEmail, validPassword, alreadyRegisteredUser.phone))
      .set('content-type', 'application/json')
      .expect(ApiErrorMessage.phoneAlreadyInUse.statusCode);
    const body = res.body as ApiErrorResponse;
    expect(body.code).toBe(ApiErrorMessage.phoneAlreadyInUse.code);
    expect(body.message).toBe(ApiErrorMessage.phoneAlreadyInUse.message);
  });

  it('Register_ShouldReturnBadRequest_WhenEmailIsInvalid', async () => {
    await Promise.all(['', 'mail.com', '  mail@', 'email@mail'].map(async (invalidEmail) => {
      const res = await request(app)
        .post(registerUrl)
        .send(new RegisterDto(invalidEmail, validPassword))
        .set('content-type', 'application/json')
        .expect(HttpStatus.BadRequest);
      const body = res.body as ApiErrorResponse;
      expect(body.errors?.email).toBeDefined();
    }));
  });

  it('Register_ShouldReturnBadRequest_WhenPasswordIsInvalid', async () => {
    await Promise.all(['', '1234', '  ', null].map(async (invalidPassword) => {
      const res = await request(app)
        .post(registerUrl)
        .send({ email: validEmail, password: invalidPassword })
        .set('content-type', 'application/json')
        .expect(HttpStatus.BadRequest);
      const body = res.body as ApiErrorResponse;
      expect(body.errors?.password).toBeDefined();
    }));
  });

  it('Register_ShouldReturnBadRequest_WhenPhoneIsInvalid', async () => {
    await Promise.all(['++', '911', '911911911'].map(async (invalidPhone) => {
      const res = await request(app)
        .post(registerUrl)
        .send(new RegisterDto(validEmail, validPassword, invalidPhone))
        .set('content-type', 'application/json')
        .expect(HttpStatus.BadRequest);
      const body = res.body as ApiErrorResponse;
      expect(body.errors?.phone).toBeDefined();
    }));
  });

  it('Register_ShouldReturnUser_WhenFieldsAreValid', async () => {
    const res = await request(app)
      .post(registerUrl)
      .send(new RegisterDto(validEmail, validPassword, validPhone))
      .set('content-type', 'application/json')
      .expect(HttpStatus.Created);
    const body = res.body as UserDto;
    expect(body.email).toBe(validEmail);
    expect(body.phone).toBe(validPhone);
    expect(body.id).toBeDefined();
  });

  beforeAll(async () => {
    app = await getApp();
    const registerService = appContainer.get<RegisterService>(authTypes.RegisterService);
    await registerService.registerUser(alreadyRegisteredUser);
  });
  afterAll(async () => {
    await appContainer.get<MongoDbConnection>(commonTypes.MongoDbConnection).closeConnection();
    // FIXME: test are not exiting. this is a temporary fix
    setTimeout(() => process.exit(), 1000);
  });
});
