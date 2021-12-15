import { injectable } from 'inversify';
import { getLogger, Logger } from 'log4js';
import { Document, InsertOneResult } from 'mongodb';
import { collections } from '../../common/database';
import { User } from '../models/User';

@injectable()
export class UserRepository {
  private logger: Logger;

  constructor() {
    this.logger = getLogger();
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return (await collections.users!.findOne({ email })) as unknown as User;
  }

  public async create(user: User): Promise<InsertOneResult<Document>> {
    return collections.users!.insertOne(user);
  }
}
