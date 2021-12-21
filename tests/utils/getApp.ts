import { Application } from 'express';
import { appContainer, initializeAppContainer } from '../../inversify.config';
import { FriencyApi, types } from '../../src/FriencyApi';

export const getApp =
  (): Application => {
    initializeAppContainer();
    return appContainer.get<FriencyApi>(types.FriencyApi)
      .getConfiguredApp();
  };
