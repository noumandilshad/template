import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { getLogger, Logger } from 'log4js';
import { HttpStatus } from '../../common/types/HttpStatus';
import { LoginDto } from '../dtos/LoginDto';
import { RegisterDto } from '../dtos/RegisterDto';
import { TokenDto } from '../dtos/TokenDto';
import { User } from '../../user/models/User';
import { TokenService } from '../services/TokenService';
import { RegisterService } from '../services/RegisterService';
import { UserDto } from '../../user/dtos/UserDto';
import { authTypes } from '../authTypes';
import { RefreshTokenDto } from '../dtos/RefreshTokenDto';

@injectable()
export class AuthController {
  private appLogger: Logger;

  private registerService: RegisterService;

  private tokenService: TokenService;

  constructor(
    @inject(authTypes.RegisterService) registerService: RegisterService,
    @inject(authTypes.TokenService) tokenService: TokenService,
  ) {
    this.appLogger = getLogger();
    this.registerService = registerService;
    this.tokenService = tokenService;
  }

  public async handleLogin(req: Request<any, any, LoginDto>, res: Response): Promise<void> {
    const loginDto = req.body;
    const tokenPair = await this.tokenService.issueTokenPairForCredentials(
      loginDto.email,
      loginDto.password,
    );

    res
      .status(HttpStatus.Success)
      .send(new TokenDto(tokenPair.accessToken, tokenPair.refreshToken.token));
  }

  public async handleRegister(req: Request<any, any, RegisterDto>, res: Response<UserDto>): Promise<void> {
    this.appLogger.info('Creating a new user from ', RegisterDto);
    const registerUserDto = req.body;

    const user = await this.registerService.registerUser(registerUserDto);
    console.log(user);
    res
      .status(HttpStatus.Created)
      .send(UserDto.fromUser(user));
  }

  public async handleRefreshToken(req: Request<any, any, RefreshTokenDto>, res: Response): Promise<void> {
    const refreshTokenDto = req.body;
    const tokenPair = await this.tokenService.issueTokenPairForRefreshToken(
      refreshTokenDto.refreshToken,
      refreshTokenDto.email,
    );
    res
      .status(HttpStatus.Success)
      .send(new TokenDto(tokenPair.accessToken, tokenPair.refreshToken.token));
  }
}
