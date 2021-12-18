import { inject, injectable } from 'inversify';
import { getLogger, Logger } from 'log4js';
import { User } from '../../user/models/User';
import { UserService } from '../../user/services/UserService';
import { userTypes } from '../../user/userTypes';
import { authTypes } from '../authTypes';
import { PasswordService } from './PasswordService';

@injectable()
export class RegisterService {
  private logger: Logger;

  private userService: UserService;

  private passwordService: PasswordService;

  constructor(
    @inject(userTypes.UserService) userService: UserService,
    @inject(authTypes.PasswordService) passwordService: PasswordService,
  ) {
    this.logger = getLogger();
    this.userService = userService;
    this.passwordService = passwordService;
  }

  async registerUser(user: User): Promise<User> {
    const registeredUser: User = { ...user };
    this.logger.debug(`Registering a new user ${user}`);

    registeredUser.password = await this.passwordService.hashPassword(user.password);

    return this.userService.saveUser(registeredUser);
    // TODO: Add user email verification
  }
}
