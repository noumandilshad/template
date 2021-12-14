import { injectable } from 'inversify';
import { getLogger, Logger } from 'log4js';
import { ErrorDescription } from 'mongodb';
import { ApiError } from '../../common/ApiError';
import { collections } from '../../common/database';
import { User } from '../models/User';

@injectable()
export class UserRepository {
  private logger: Logger;

  constructor() {
    this.logger = getLogger();
  }

  public findByEmail(email: string): User | undefined {
    return undefined;
  }

  public async create(user: User): Promise<User> {
    const result = await collections.users!.insertOne(user);
    user.id = result.insertedId;
    this.logger.info(`New user with id ${user.id} was created`);
    return user;
  }
}
