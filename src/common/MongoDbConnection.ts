import { inject, injectable } from 'inversify';
import { getLogger, Logger } from 'log4js';
import { Collection, Db, MongoClient } from 'mongodb';
import { commonTypes } from './commonTypes';
import { env } from './env';

const USERS_COLLECTION_NAME = 'users';

export const collections: { users?: Collection } = {};

@injectable()
export class MongoDbConnection {
  private mongoClient: MongoClient;

  private logger: Logger;

  constructor(@inject(commonTypes.MongoDbConnString) mongoDbConnString: string) {
    this.logger = getLogger();
    this.mongoClient = new MongoClient(mongoDbConnString);
  }

  public async connect(): Promise<void> {
    await this.mongoClient.connect();

    const db: Db = this.mongoClient.db(env.DB_NAME);

    const usersCollection: Collection = db.collection(USERS_COLLECTION_NAME);

    collections.users = usersCollection;

    await collections.users!.createIndex({ email: 1 }, { unique: true });

    // eslint-disable-next-line max-len
    this.logger.info(`Successfully connected to database: ${db.databaseName} and collection: ${usersCollection.collectionName}`);
  }

  public async closeConnection(): Promise<void> {
    return this.mongoClient.close();
  }
}
