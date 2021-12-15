import { ContainerModule, interfaces } from 'inversify';
import { MongoClient } from 'mongodb';
import { commonTypes } from './commonTypes';
import { env } from './env';
import { MongoDbDatabaseConnection } from './MongoDbConnection';

export const commonContainer = new ContainerModule((bind: interfaces.Bind) => {
  bind<MongoDbDatabaseConnection>(commonTypes.MongoDbDatabaseConnection).to(MongoDbDatabaseConnection);
  bind<MongoClient>(commonTypes.MongoClient).toConstantValue(new MongoClient(env.DB_CONN_STRING));
});
