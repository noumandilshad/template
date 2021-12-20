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
import { UserRepository } from '../../user/repositories/UserRepository';
import { ApiErrorMessage } from '../../common/error/ApiErrorMessage';
import { RefreshToken } from '../models/RefreshToken';
import { RefreshTokenRepository } from '../repositories/RefreshTokenRepository';

@injectable()
export class TokenService {
  private logger: Logger;

  private userRepository: UserRepository;

  private refreshTokenRepository: RefreshTokenRepository;

  private passwordService: PasswordService;

  private jwtSecret: string;

  private jwtAccessTokenExpiration: number;

  private jwtRefreshTokenExpiration: number;

  constructor(
    @inject(userTypes.UserRepository) userRepository: UserRepository,
    @inject(authTypes.RefreshTokenRepository) refreshTokenRepository: RefreshTokenRepository,
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
    const user = await this.userRepository.findByEmail(email);

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
    const refreshToken = await this.refreshTokenRepository.findByToken(token);
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

    const user = await this.userRepository.findById(refreshToken.userId);
    if (!user || user!.email !== email) {
      this.logger.debug('Refresh token email doesn\'t match');
      throw ApiError.fromApiErrorMessage(ApiErrorMessage.unauthorized);
    }

    // Revoke token to avoid being used a second time
    refreshToken.revoked = true;
    await this.refreshTokenRepository.revoke(refreshToken._id!);
    return this.issueTokenPairForUser(user);
  }

  private issueTokenPairForUser(user: User): TokenPair {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    this.refreshTokenRepository.create(refreshToken);

    return new TokenPair(accessToken, refreshToken);
  }

  public generateAccessToken(user: User): string {
    return sign(
      { ...UserDto.fromUser(user) },
      this.jwtSecret,
      {
        algorithm: 'HS512',
        expiresIn: env.JWT_ACCESS_TOKEN_EXPIRATION,
      },
    );
  }

  public generateRefreshToken(user: User): RefreshToken {
    const token = randToken.uid(512);
    return new RefreshToken(
      token,
      Date.now() + env.JWT_REFRESH_TOKEN_EXPIRATION,
      user._id!,
      false,
    );
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
