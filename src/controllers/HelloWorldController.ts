import { NextFunction, Request, Response } from 'express';
import { injectable } from 'inversify';
import { Logger } from 'log4js';
import { getLogger } from '../core/AppLogger';
import { HelloWorldControllerInterface } from './HelloWorldControllerInterface';

// Handles "throw" and passes it to error handler
// eslint-disable-next-line @typescript-eslint/ban-types
// eslint-disable-next-line max-len
const asyncRouteFunctionWrapper = (
  // eslint-disable-next-line @typescript-eslint/ban-types
  fn: Function,
) => (req: Request, res: Response, next: NextFunction) => fn(req, res, next)
  .catch(next /* "next" argument */);

@injectable()
export class HelloWorldController implements HelloWorldControllerInterface {
  private appLogger: Logger;

  constructor(
  ) {
    this.appLogger = getLogger();
  }

  handleHelloWorld(req: Request, res: Response): Response {
    return res.status(200)
      .send({ message: 'Hello world!' });
  }
}
