import { inject, injectable } from 'inversify';
import { getLogger, Logger } from 'log4js';
import { Repository } from 'typeorm';
import { ApiError } from '../../common/error/ApiError';
import { ApiErrorMessage } from '../../common/error/ApiErrorMessage';
import { User } from '../models/User';
import { userTypes } from '../userTypes';

@injectable()
export class UserService {
  private logger: Logger;

  private userRepository: Repository<User>;

  constructor(
    @inject(userTypes.UserRepository) userRepository: Repository<User>,
  ) {
    this.logger = getLogger();
    this.userRepository = userRepository;
  }

  async saveUser(user: User): Promise<User> {
    this.logger.info(`Creating a new user with email ${user.email}`);

    if (await this.userRepository.findOne({ email: user.email })) {
      throw ApiError.fromApiErrorMessage(ApiErrorMessage.emailAlreadyInUse);
    }

    if (user.phone && await this.userRepository.findOne({ phone: user.phone })) {
      throw ApiError.fromApiErrorMessage(ApiErrorMessage.phoneAlreadyInUse);
    }

    try {
      const createdUser = await this.userRepository.create(user);

      this.logger.info(`New user with id ${createdUser.id} was created`);
      return createdUser;
    } catch (error: any) {
      throw ApiError.fromInternalServerError(error.message);
    }
  }
}
