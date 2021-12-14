import { injectable } from 'inversify';
import { getLogger, Logger } from 'log4js';
import { ApiError } from '../../common/ApiError';
import { collections } from '../../common/database';
import { HTTPStatusCodes } from '../../common/types/HTTPStatusCodes';
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
    try {
      const result = await collections.users!.insertOne(user);
      user.id = result.insertedId;
      this.logger.info(`New user with id ${user.id} was created`);
      return user;
    } catch (error: any) {
      throw new ApiError(HTTPStatusCodes.InternalServerError, error.message);
    }
  }
}
