import { injectable } from 'inversify';
import { getLogger, Logger } from 'log4js';
import { User } from '../models/User';

@injectable()
export class RegisterUserService {
  private appLogger: Logger;

  constructor() {
    this.appLogger = getLogger();
  }

  registerUser(user: User): void {
    this.appLogger.info('New user register', user);
  }
}
