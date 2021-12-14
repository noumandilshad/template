import { inject, injectable } from 'inversify';
import { getLogger, Logger } from 'log4js';
import { sign, verify } from 'jsonwebtoken';
import { ApiError } from '../../common/ApiError';
import { HTTPStatusCodes } from '../../common/types/HTTPStatusCodes';
import { AUTH_TYPES } from '../authTypes';
import { Token } from '../models/Token';
import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import { PasswordService } from './PasswordService';
import { UserDto } from '../dtos/UserDto';
import { env } from '../../common/env';

@injectable()
export class TokenService {
  private logger: Logger;

  private userRepository: UserRepository;

  private passwordService: PasswordService;

  private jwtSecret: string;

  constructor(
    @inject(AUTH_TYPES.UserRepository) userRepository: UserRepository,
    @inject(AUTH_TYPES.PasswordService) passwordService: PasswordService,
  ) {
    this.logger = getLogger();
    this.jwtSecret = env.JWT_PRIVATE_KEY;
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
    const token = sign({ ...UserDto.fromUser(user) }, this.jwtSecret);

    // TODO add logic for refresh token
    return new Token(token, 'notImplemented');
  }

  public isTokenValid(token: string): boolean {
    try {
      this.logger.debug(`Verifying token ${token}`);
      verify(token, this.jwtSecret);
      this.logger.debug(`Valid token ${token}`);
      return true;
    } catch (err) {
      this.logger.debug(`Invalid token ${token}`);
      return false;
    }
  }
}
