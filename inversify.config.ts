// reflect-metadata needs to be imported at a "global" place
import 'reflect-metadata';
import { Container } from 'inversify';
import { authContainer } from './src/auth/authContainer';
import { FriencyApi, types } from './src/FriencyApi';
import { userContainer } from './src/user/userContainer';
import { commonContainer } from './src/common/commonContainer';
import { connectToDatabase } from './src/common/databaseConnection';

const appContainer = new Container();

export const initializeAppContainer = async (): Promise<Container> => {
  await connectToDatabase();

  appContainer.load(authContainer);
  appContainer.load(userContainer);
  appContainer.load(commonContainer);
  appContainer.bind<FriencyApi>(types.FriencyApi).to(FriencyApi);
  return appContainer;
};

export { appContainer };
