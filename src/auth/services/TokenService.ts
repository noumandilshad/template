import { inject, injectable } from 'inversify';
import { getLogger, Logger } from 'log4js';
import { ApiError } from '../../common/ApiError';
import { HTTPStatusCodes } from '../../common/types/HTTPStatusCodes';
import { AUTH_TYPES } from '../authTypes';
import { Token } from '../models/Token';
import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import { hashPassword } from '../utils/hashPassword';

@injectable()
export class TokenService {
  private logger: Logger;

  private userRepository: UserRepository;

  constructor(@inject(AUTH_TYPES.UserRepository) userRepository: UserRepository) {
    this.logger = getLogger();
    this.userRepository = userRepository;
  }

  getAccessToken(email: string, password: string): Token {
    const user = this.userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(HTTPStatusCodes.BadRequest, 'Invalid credentials.');
    }

    if (!this.passwordMatches(user, password)) {
      throw new ApiError(HTTPStatusCodes.BadRequest, 'Invalid credentials.');
    }

    return this.issueTokenForUser(user);
  }

  private issueTokenForUser(user: User): Token {
    return new Token('mockAccessToken', 'mockRefreshToken');
  }

  private passwordMatches(user: User, password: string) {
    return user.password === hashPassword(password);
  }
}
