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

  async handleLogin(req: Request<any, any, LoginDto>, res: Response): Promise<void> {
    const loginDto = req.body;
    const token = await this.tokenService.issueAccessToken(loginDto.email, loginDto.password);

    res
      .status(HttpStatus.Success)
      .send(new TokenDto(token.accessToken, token.refreshToken));
  }

  async handleRegister(req: Request<any, any, RegisterDto>, res: Response<UserDto>): Promise<void> {
    this.appLogger.info('Creating a new user from ', RegisterDto);
    const registerUserDto = req.body;

    const user = await this.registerService.registerUser(
      new User(
        registerUserDto.email,
        registerUserDto.password,
        registerUserDto.phone,
      ),
    );

    res
      .status(HttpStatus.Created)
      .send(UserDto.fromUser(user));
  }

  public protectedRoute(_: Request<any, UserDto, any>, res: Response<UserDto>): void {
    res.status(HttpStatus.Created).send();
  }
}
