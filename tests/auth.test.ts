import 'ts-jest/utils';
import request from 'supertest';
import { getApp } from './utils/getApp';
import { LoginDto } from '../src/auth/dtos/LoginDto';

describe('User Endpoints', () => {
  it('Login should work', async (done) => {
    request(await getApp())
      .post('/auth/login')
      .send(new LoginDto('myemail@mail.com', 'awesomepasswd'))
      .set('content-type', 'application/json')
      .expect(401, done);
  });
});
