import { Application } from 'express';
import { appContainer } from '../../inversify.config';
import { FriencyApi, types } from '../../src/FriencyApi';

export const getApp = async (): Promise<Application> =>
  // eslint-disable-next-line implicit-arrow-linebreak
  appContainer.get<FriencyApi>(types.FriencyApi)
    .getConfiguredApp();
