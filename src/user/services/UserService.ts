import { inject, injectable } from 'inversify';
import { getLogger, Logger } from 'log4js';
import { Repository } from 'typeorm';
import { RegisterDto } from '../../auth/dtos/RegisterDto';
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

  async createUser(registerDto: RegisterDto): Promise<User> {
    this.logger.info(`Creating a new user with email ${registerDto.email}`);

    if (await this.userRepository.findOne({ email: registerDto.email })) {
      throw ApiError.fromApiErrorMessage(ApiErrorMessage.emailAlreadyInUse);
    }

    if (registerDto.phone
      && await this.userRepository.findOne({ phone: registerDto.phone })) {
      throw ApiError.fromApiErrorMessage(ApiErrorMessage.phoneAlreadyInUse);
    }

    try {
      const user = await this.userRepository.save(registerDto);

      this.logger.info(`New user with id ${user.id} was created`);
      return user;
    } catch (error: any) {
      throw ApiError.fromInternalServerError(error.message);
    }
  }
}
