import { inject, injectable } from 'inversify';
import { Collection, Db, MongoClient } from 'mongodb';
import { commonTypes } from './commonTypes';
import { env } from './env';

const USERS_COLLECTION_NAME = 'users';

export const collections: { users?: Collection } = {};

@injectable()
export class MongoDbDatabaseConnection {
  private mongoClient: MongoClient;

  constructor(@inject(commonTypes.MongoClient) mongoClient: MongoClient) {
    this.mongoClient = mongoClient;
  }

  public async connect(): Promise<void> {
    await this.mongoClient.connect();

    const db: Db = this.mongoClient.db(env.DB_NAME);

    const usersCollection: Collection = db.collection(USERS_COLLECTION_NAME);

    collections.users = usersCollection;

    await collections.users!.createIndex({ email: 1 }, { unique: true });

    // eslint-disable-next-line max-len
    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${usersCollection.collectionName}`);
  }
}
