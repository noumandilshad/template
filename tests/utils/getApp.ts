import { Application } from 'express';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import mongodb from 'mongo-mock';
import { MongoClient } from 'mongodb';
import { appContainer } from '../../inversify.config';
import { commonTypes } from '../../src/common/commonTypes';
import { FriencyApi, types } from '../../src/FriencyApi';

export const getApp = async (): Promise<Application> => {
  mongodb.max_delay = 0;// you can choose to NOT pretend to be async (default is 400ms)
  const { MongoClient: mongoClient } = mongodb;

  appContainer.unbind(commonTypes.MongoClient);
  appContainer.bind<MongoClient>(commonTypes.MongoClient).toConstantValue(mongoClient);

  return appContainer.get<FriencyApi>(types.FriencyApi)
    .getConfiguredApp();
};
