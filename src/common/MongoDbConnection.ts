import { connect } from 'http2';
import { inject, injectable } from 'inversify';
import { getLogger, Logger } from 'log4js';
import { Connection, createConnection } from 'typeorm';
import { commonTypes } from './commonTypes';

@injectable()
export class MongoDbConnection {
  private logger: Logger;

  private mongoDbHost: string;

  private mongoDbPort: number;

  private mongoDbUsername: string;

  private mongoDbPassword: string;

  private mongoDbDatabase: string;

  private connection?: Connection;

  constructor(
    @inject(commonTypes.MongoDbHost) mongoDbHost: string,
    @inject(commonTypes.MongoDbPort) mongoDbPort: number,
    @inject(commonTypes.MongoDbUsername) mongoDbUsername: string,
    @inject(commonTypes.MongoDbPassword) mongoDbPassword: string,
    @inject(commonTypes.MongoDbDatabase) mongoDbDatabase: string,
  ) {
    this.logger = getLogger();
    this.mongoDbHost = mongoDbHost;
    this.mongoDbPort = mongoDbPort;
    this.mongoDbUsername = mongoDbUsername;
    this.mongoDbPassword = mongoDbPassword;
    this.mongoDbDatabase = mongoDbDatabase;
  }

  public async connect(): Promise<void> {
    console.log(this.mongoDbHost);
    this.connection = await createConnection({
      type: 'mongodb',
      host: this.mongoDbHost,
      port: this.mongoDbPort,
      username: this.mongoDbUsername,
      password: this.mongoDbPassword,
      database: this.mongoDbDatabase,
    });

    // eslint-disable-next-line max-len
    this.logger.info(`Successfully connected to database: ${this.mongoDbDatabase}`);
  }

  public closeConnection(): Promise<void> {
    return this.connection!.close();
  }
}
