import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { getLogger, Logger } from 'log4js';
import { HTTPStatusCodes } from '../common/types/HTTPStatusCodes';
import { AUTH_TYPES } from './authTypes';
import { LoginDto } from './dtos/LoginDto';
import { RegisterUserDto } from './dtos/RegisterUserDto';
import { TokenDto } from './dtos/TokenDto';
import { User } from './models/User';
import { TokenService } from './services/TokenService';
import { RegisterUserService } from './services/RegisterUserService';

@injectable()
export class AuthController {
  private appLogger: Logger;

  private registerUserService: RegisterUserService;

  private tokenService: TokenService;

  constructor(
    @inject(AUTH_TYPES.RegisterUserService) registerUserService: RegisterUserService,
    @inject(AUTH_TYPES.TokenService) tokenService: TokenService,
  ) {
    this.appLogger = getLogger();
    this.registerUserService = registerUserService;
    this.tokenService = tokenService;
  }

  handleLogin(req: Request<any, any, LoginDto>, res: Response): Response {
    const loginDto = req.body;
    const token = this.tokenService.getAccessToken(loginDto.email, loginDto.password);

    return res
      .status(HTTPStatusCodes.Success)
      .send(new TokenDto(token.accessToken, token.refreshToken));
  }

  handleRegister(req: Request<any, any, RegisterUserDto>, res: Response): void {
    const registerUserDto = req.body;
    this.registerUserService.registerUser(
      new User(registerUserDto.email, registerUserDto.password),
    );
    res
      .status(HTTPStatusCodes.Created)
      .send();
  }
}
