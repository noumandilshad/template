import { inject, injectable } from 'inversify';
import { getLogger, Logger } from 'log4js';
import { ApiError } from '../../common/error/ApiError';
import { ApiErrorMessage } from '../../common/error/ApiErrorMessage';
import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import { userTypes } from '../userTypes';

@injectable()
export class UserService {
  private logger: Logger;

  private userRepository: UserRepository;

  constructor(
    @inject(userTypes.UserRepository) userRepository: UserRepository,
  ) {
    this.logger = getLogger();
    this.userRepository = userRepository;
  }

  async saveUser(user: User): Promise<User> {
    this.logger.info(`Creating a new user with email ${user.email}`);

    if (await this.userRepository.findByEmail(user.email)) {
      throw ApiError.fromApiErrorMessage(ApiErrorMessage.emailAlreadyInUse);
    }

    if (user.phone && await this.userRepository.findByPhoneNumber(user.phone)) {
      throw ApiError.fromApiErrorMessage(ApiErrorMessage.phoneAlreadyInUse);
    }

    try {
      const result = await this.userRepository.create(user);

      user.id = result.insertedId;

      this.logger.info(`New user with id ${user.id} was created`);
      return user;
    } catch (error: any) {
      throw ApiError.fromInternalServerError(error.message);
    }
  }
}
