import { inject, injectable } from 'inversify';
import { getLogger, Logger } from 'log4js';
import { ApiError } from '../../common/ApiError';
import { HTTPStatusCodes } from '../../common/types/HTTPStatusCodes';
import { AUTH_TYPES } from '../authTypes';
import { Token } from '../models/Token';
import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import { PasswordService } from './PasswordService';

@injectable()
export class TokenService {
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

  async issueAccessToken(email: string, password: string): Promise<Token> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      this.logger.debug('User not found');
      // TODO extract message to enum class with all error messages
      throw new ApiError(HTTPStatusCodes.BadRequest, 'Invalid credentials.');
    }

    if (!(await this.passwordService.checkPasswordMatches(user.password, password))) {
      this.logger.debug('Passwords don\'t match');
      throw new ApiError(HTTPStatusCodes.BadRequest, 'Invalid credentials.');
    }

    return this.issueTokenForUser(user);
  }

  private issueTokenForUser(user: User): Token {
    // TODO add logic for token
    return new Token('mockAccessToken', 'mockRefreshToken');
  }
}
