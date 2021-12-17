// reflect-metadata needs to be imported at a "global" place
import 'reflect-metadata';
import { Container } from 'inversify';
import { authContainer } from './src/auth/authContainer';
import { FriencyApi, types } from './src/FriencyApi';
import { userContainer } from './src/user/userContainer';
import { commonContainer } from './src/common/commonContainer';

const appContainer = new Container();
appContainer.load(authContainer);
appContainer.load(userContainer);
appContainer.load(commonContainer);
appContainer.bind<FriencyApi>(types.FriencyApi).to(FriencyApi);

export { appContainer };
