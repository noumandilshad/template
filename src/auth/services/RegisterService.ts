import { inject, injectable } from 'inversify';
import { getLogger, Logger } from 'log4js';
import { User } from '../../user/models/User';
import { UserService } from '../../user/services/UserService';
import { userTypes } from '../../user/userTypes';
import { authTypes } from '../authTypes';
import { RegisterDto } from '../dtos/RegisterDto';
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

  async registerUser(registerDto: RegisterDto): Promise<User> {
    this.logger.debug(`Registering a new user ${registerDto}`);

    return this.userService.createUser({
      ...registerDto,
      password: await this.passwordService.hashPassword(registerDto.password),
    });
    // TODO: Add user email verification
  }
}
