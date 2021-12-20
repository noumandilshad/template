import { Application } from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { appContainer } from '../../inversify.config';
import { commonTypes } from '../../src/common/commonTypes';
import { FriencyApi, types } from '../../src/FriencyApi';

export const getApp = async (): Promise<Application> => {
  const mongoServer = await MongoMemoryServer.create();
  appContainer.unbind(commonTypes.MongoDbHost);
  console.log(mongoServer.getUri());
  appContainer.bind(commonTypes.MongoDbHost).toConstantValue('');

  return appContainer.get<FriencyApi>(types.FriencyApi)
    .getConfiguredApp();
};
