import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import { env } from './env';
import { isNodeEnvTest } from './utils/nodeEnv';

const commonProperties: ConnectionOptions = {
  type: 'mongodb',
  authSource: 'admin',
  database: env.MONGO_DB_DATABASE,
  entities: ['src/**/models/*.ts'],
};

export const connectToDatabase = async (): Promise<Connection> => {
  if (isNodeEnvTest()) {
    const mongoServer = await MongoMemoryServer.create();
    return createConnection({
      ...commonProperties,
      url: mongoServer.getUri(),
    });
  }
  return createConnection({
    ...commonProperties,
    host: env.MONGO_DB_HOST,
    port: env.MONGO_DB_PORT,
    username: env.MONGO_DB_USERNAME,
    password: env.MONGO_DB_PASSWORD,
  });
};
