import { inject, injectable } from 'inversify';
import { getLogger, Logger } from 'log4js';
import { ErrorDescription } from 'mongodb';
import { ApiError } from '../../common/ApiError';
import { HTTPStatusCodes } from '../../common/types/HTTPStatusCodes';
import { AUTH_TYPES } from '../authTypes';
import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import { hashPassword } from '../utils/hashPassword';

@injectable()
export class RegisterUserService {
  private logger: Logger;

  private userRepository: UserRepository;

  constructor(@inject(AUTH_TYPES.UserRepository) userRepository: UserRepository) {
    this.logger = getLogger();
    this.userRepository = userRepository;
  }

  async registerUser(user: User): Promise<User> {
    if (this.userRepository.findByEmail(user.email)) {
      throw new ApiError(HTTPStatusCodes.BadRequest, 'Email is already in user');
    }
    user.password = hashPassword(user.password);
    this.logger.info('New user register', user);
    try {
      return await this.userRepository.create(user);
    } catch (error: any) {
      throw new ApiError(HTTPStatusCodes.InternalServerError, error.message);
    }
  }
}
