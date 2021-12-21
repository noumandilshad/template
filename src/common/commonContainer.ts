import { ContainerModule, interfaces } from 'inversify';
import { commonTypes } from './commonTypes';
import { env } from './env';

export const commonContainer = new ContainerModule((bind: interfaces.Bind) => {
  bind<string>(commonTypes.MongoDbHost).toConstantValue(env.MONGO_DB_HOST);
  bind<number>(commonTypes.MongoDbPort).toConstantValue(env.MONGO_DB_PORT);
  bind<string>(commonTypes.MongoDbUsername).toConstantValue(env.MONGO_DB_USERNAME);
  bind<string>(commonTypes.MongoDbPassword).toConstantValue(env.MONGO_DB_PASSWORD);
  bind<string>(commonTypes.MongoDbDatabase).toConstantValue(env.MONGO_DB_DATABASE);
});
