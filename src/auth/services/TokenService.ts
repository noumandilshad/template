import { getRepository, Repository } from 'typeorm';
import { inject, injectable } from 'inversify';
import { getLogger, Logger } from 'log4js';
import { sign, verify } from 'jsonwebtoken';
import randToken from 'rand-token';
import { ApiError } from '../../common/error/ApiError';
import { TokenPair } from '../models/TokenPair';
import { User } from '../../user/models/User';
import { PasswordService } from './PasswordService';
import { UserDto } from '../../user/dtos/UserDto';
import { authTypes } from '../authTypes';
import { userTypes } from '../../user/userTypes';
import { ApiErrorMessage } from '../../common/error/ApiErrorMessage';
import { RefreshToken } from '../models/RefreshToken';

@injectable()
export class TokenService {
  private logger: Logger;

  private userRepository: Repository<User>;

  private refreshTokenRepository: Repository<RefreshToken>;

  private passwordService: PasswordService;

  private jwtSecret: string;

  private jwtAccessTokenExpiration: number;

  private jwtRefreshTokenExpiration: number;

  constructor(
    @inject(userTypes.UserRepository) userRepository: Repository<User>,
    @inject(authTypes.RefreshTokenRepository) refreshTokenRepository: Repository<RefreshToken>,
    @inject(authTypes.PasswordService) passwordService: PasswordService,
    @inject(authTypes.JwtSecret) jwtSecret: string,
    @inject(authTypes.JwtRefreshTokenExpiration) jwtRefreshTokenExpiration: number,
    @inject(authTypes.JwtAccessTokenExpiration) jwtAccessTokenExpiration: number,
  ) {
    this.logger = getLogger();
    this.jwtSecret = jwtSecret;
    this.jwtAccessTokenExpiration = jwtAccessTokenExpiration;
    this.jwtRefreshTokenExpiration = jwtRefreshTokenExpiration;
    this.userRepository = userRepository;
    this.passwordService = passwordService;
    this.refreshTokenRepository = refreshTokenRepository;
  }

  async issueTokenPairForCredentials(email: string, password: string): Promise<TokenPair> {
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      this.logger.debug('User not found');
      // TODO extract message to enum class with all error messages
      throw ApiError.fromApiErrorMessage(ApiErrorMessage.invalidLoginCredentials);
    }

    if (!(await this.passwordService.checkPasswordMatches(user.password, password))) {
      this.logger.debug('Passwords don\'t match');
      throw ApiError.fromApiErrorMessage(ApiErrorMessage.invalidLoginCredentials);
    }

    return this.issueTokenPairForUser(user);
  }

  async issueTokenPairForRefreshToken(token: string, email: string): Promise<TokenPair> {
    const refreshToken = await this.refreshTokenRepository.findOne({ token });
    if (!refreshToken) {
      this.logger.debug('Refresh token not found');
      throw ApiError.fromApiErrorMessage(ApiErrorMessage.unauthorized);
    }
    if (refreshToken.revoked) {
      this.logger.debug('Refresh token was revoked');
      throw ApiError.fromApiErrorMessage(ApiErrorMessage.unauthorized);
    }
    if (Date.now() >= refreshToken.expiresAt) {
      this.logger.debug('Refresh token is expired');
      throw ApiError.fromApiErrorMessage(ApiErrorMessage.unauthorized);
    }

    const user = await this.userRepository.findOne(refreshToken.userId);
    if (!user || user!.email !== email) {
      this.logger.debug('Refresh token email doesn\'t match');
      throw ApiError.fromApiErrorMessage(ApiErrorMessage.unauthorized);
    }

    // Revoke token to avoid being used a second time
    refreshToken.revoked = true;
    await this.refreshTokenRepository.update(refreshToken.id, { revoked: true });
    return this.issueTokenPairForUser(user);
  }

  private async issueTokenPairForUser(user: User): Promise<TokenPair> {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken();

    const createdRefreshToken = await this.refreshTokenRepository.save({
      token: refreshToken,
      expiresAt: Date.now() + this.jwtRefreshTokenExpiration,
      userId: user.id.toString(),
      revoked: false,
    });

    return new TokenPair(accessToken, createdRefreshToken);
  }

  public generateAccessToken(user: User): string {
    return sign(
      { ...UserDto.fromUser(user) },
      this.jwtSecret,
      {
        algorithm: 'HS512',
        expiresIn: this.jwtAccessTokenExpiration,
      },
    );
  }

  public generateRefreshToken(): string {
    return randToken.uid(512);
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
