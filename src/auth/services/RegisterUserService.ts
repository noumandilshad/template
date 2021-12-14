import { inject, injectable } from 'inversify';
import { getLogger, Logger } from 'log4js';
import { ApiError } from '../../common/ApiError';
import { HTTPStatusCodes } from '../../common/types/HTTPStatusCodes';
import { AUTH_TYPES } from '../authTypes';
import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import { PasswordService } from './PasswordService';

@injectable()
export class RegisterUserService {
  private logger: Logger;

  private userRepository: UserRepository;

  private passwordService: PasswordService;

  constructor(
    @inject(AUTH_TYPES.UserRepository) userRepository: UserRepository,
    @inject(AUTH_TYPES.PasswordService) passwordService: PasswordService,
  ) {
    this.logger = getLogger();
    this.userRepository = userRepository;
    this.passwordService = passwordService;
  }

  async registerUser(user: User): Promise<User> {
    if (await this.userRepository.findByEmail(user.email)) {
      throw new ApiError(HTTPStatusCodes.BadRequest, 'Email is already in user');
    }

    // TODO: Add user email verification

    user.password = await this.passwordService.hashPassword(user.password);
    this.logger.debug('Password hashed', user.password);
    this.logger.info('New user register', user);

    try {
      const result = await this.userRepository.create(user);
      user.id = result.insertedId;
      this.logger.info(`New user with id ${user.id} was created`);
      return user;
    } catch (error: any) {
      throw new ApiError(HTTPStatusCodes.InternalServerError, error.message);
    }
  }
}
