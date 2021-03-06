import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import { getEnv } from './env';
import { isNodeEnvTest } from './utils/nodeEnv';

const commonProperties: ConnectionOptions = {
  type: 'mongodb',
  authSource: 'admin',
  database: getEnv('MONGO_DB_DATABASE'),
  entities: ['src/**/models/*.ts'],
};
let mongoServer: MongoMemoryServer;

export const connectToDatabase = async (): Promise<Connection> => {
  if (isNodeEnvTest()) {
    mongoServer = await MongoMemoryServer.create();
    return createConnection({
      ...commonProperties,
      url: await mongoServer.getUri(),
    });
  }
  return createConnection({
    ...commonProperties,
    host: getEnv('MONGO_DB_HOST'),
    port: parseInt(getEnv('MONGO_DB_PORT'), 10),
    username: getEnv('MONGO_DB_USERNAME'),
    password: getEnv('MONGO_DB_PASSWORD'),
  });
};

export const closeMemoryMongoServer = (): Promise<boolean> => mongoServer.stop();
