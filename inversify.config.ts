// reflect-metadata needs to be imported at a "global" place
import 'reflect-metadata';
import { Container } from 'inversify';
import { authContainer } from './src/auth/authContainer';
import { FriencyApi, TYPES } from './src/FriencyApi';
import { userContainer } from './src/user/userContainer';

const appContainer = new Container();
appContainer.load(authContainer);
appContainer.load(userContainer);
appContainer.bind<FriencyApi>(TYPES.FriencyApi).to(FriencyApi);

export { appContainer };
