import { injectable } from 'inversify';
import { getLogger, Logger } from 'log4js';
import {
  model, Mongoose,
} from 'mongoose';
import { env } from '../../common/env';
import { User } from '../models/User';
import { userSchema } from '../schema/userSchema';

@injectable()
export class UserRepository {
  private logger: Logger;

  private static UserModel = model('User', userSchema);

  constructor() {
    this.logger = getLogger();
  }

  public findByEmail(email: string): User | undefined {
    return undefined;
  }

  public create(user: User): User {
    const mongoose = new Mongoose();

    mongoose.connect(env.MONGODB_URL, (err) => {
      this.logger.info('Mongodb successfully connected');
      const newUser = new UserRepository.UserModel({ ...user });
      this.logger.info(newUser);

      (newUser.save() as Promise<any>).then((...args: string[]) => {
        this.logger.info('User saved successfully', args);
        user.id = newUser.id;
      }).catch((error: string) => {
        // FIXME: this should throw an exception 500
        this.logger.error(error);
      });
    });
    return user;
  }
}
