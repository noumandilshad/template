import { Collection, Db, MongoClient } from 'mongodb';
import { env } from './env';

const USERS_COLLECTION_NAME = 'users';

export const collections: { users?: Collection } = {};

export const connectToDatabase = async (): Promise<void> => {
  const client: MongoClient = new MongoClient(env.DB_CONN_STRING);

  await client.connect();

  const db: Db = client.db(process.env.DB_NAME);

  const usersCollection: Collection = db.collection(USERS_COLLECTION_NAME);

  collections.users = usersCollection;

  // eslint-disable-next-line max-len
  console.log(`Successfully connected to database: ${db.databaseName} and collection: ${usersCollection.collectionName}`);
};
