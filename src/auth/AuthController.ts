import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { getLogger, Logger } from 'log4js';
import { HTTPStatusCodes } from '../common/types/HTTPStatusCodes';
import { AUTH_TYPES } from './authTypes';
import { RegisterUserDto } from './dtos/RegisterUserDto';
import { User } from './models/User';
import { RegisterUserService } from './services/RegisterUserService';

@injectable()
export class AuthController {
  private appLogger: Logger;

  private registerUserService: RegisterUserService;

  constructor(
    @inject(AUTH_TYPES.RegisterUserService) registerUserService: RegisterUserService,
  ) {
    this.appLogger = getLogger();
    this.registerUserService = registerUserService;
  }

  handleLogin(req: Request, res: Response): Response {
    return res.status(200)
      .send({ message: 'Hello world!' });
  }

  handleRegister(req: Request<any, any, RegisterUserDto>, res: Response): void {
    const registerUserDto = req.body;
    this.registerUserService.registerUser(
      new User(registerUserDto.email, registerUserDto.password),
    );
    res.status(HTTPStatusCodes.Created).send();
  }
}
