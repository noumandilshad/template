import { Request, Response } from 'express';
import { injectable } from 'inversify';
import { getLogger, Logger } from 'log4js';

@injectable()
export class AuthController {
  private appLogger: Logger;

  constructor(
  ) {
    this.appLogger = getLogger();
  }

  handleLogin(req: Request, res: Response): Response {
    return res.status(200)
      .send({ message: 'Hello world!' });
  }

  handleRegister(req: Request, res: Response): void {
    throw new Error('Method not implemented.');
  }
}
