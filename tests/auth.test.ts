import 'ts-jest/utils';
import request from 'supertest';
import { getApp } from './utils/getApp';

describe('User Endpoints', () => {
  it('Login should work', async (done) => {
    request(await getApp())
      .post('/auth/login')
      .set('content-type', 'application/json')
      .expect(401, done);
  });
});
