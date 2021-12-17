import { inject, injectable } from 'inversify';
import { getLogger, Logger } from 'log4js';
import { sign, verify } from 'jsonwebtoken';
import { ApiError } from '../../common/ApiError';
import { HttpStatus } from '../../common/types/HttpStatus';
import { Token } from '../models/Token';
import { User } from '../../user/models/User';
import { PasswordService } from './PasswordService';
import { UserDto } from '../../user/dtos/UserDto';
import { env } from '../../common/env';
import { UserRepository } from '../../user/repositories/UserRepository';
import { authTypes } from '../authTypes';
import { userTypes } from '../../user/userTypes';

@injectable()
export class TokenService {
  private logger: Logger;

  private userRepository: UserRepository;

  private passwordService: PasswordService;

  private jwtSecret: string;

  constructor(
    @inject(userTypes.UserRepository) userRepository: UserRepository,
    @inject(authTypes.PasswordService) passwordService: PasswordService,
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
      throw new ApiError(HttpStatus.Unauthorized, 'Invalid credentials.');
    }

    if (!(await this.passwordService.checkPasswordMatches(user.password, password))) {
      this.logger.debug('Passwords don\'t match');
      throw new ApiError(HttpStatus.Unauthorized, 'Invalid credentials.');
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
      verify(token, this.jwtSecret);
      this.logger.debug('Valid token');
      return true;
    } catch (err) {
      this.logger.debug('Invalid token');
      return false;
    }
  }
}
