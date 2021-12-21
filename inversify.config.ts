// reflect-metadata needs to be imported at a "global" place
import 'reflect-metadata';
import { Container } from 'inversify';
import { authContainer } from './src/auth/authContainer';
import { FriencyApi, types } from './src/FriencyApi';
import { userContainer } from './src/user/userContainer';

const appContainer = new Container();

export const initializeAppContainer = (): Container => {
  appContainer.load(authContainer);
  appContainer.load(userContainer);
  appContainer.bind<FriencyApi>(types.FriencyApi).to(FriencyApi);
  return appContainer;
};

export { appContainer };
