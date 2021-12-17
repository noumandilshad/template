import { ContainerModule, interfaces } from 'inversify';
import { commonTypes } from './commonTypes';
import { env } from './env';
import { MongoDbConnection } from './MongoDbConnection';

export const commonContainer = new ContainerModule((bind: interfaces.Bind) => {
  bind<MongoDbConnection>(commonTypes.MongoDbConnection).to(MongoDbConnection);
  bind<string>(commonTypes.MongoDbConnString).toConstantValue(env.DB_CONN_STRING);
});
