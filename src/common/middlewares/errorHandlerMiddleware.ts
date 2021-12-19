import {
  NextFunction,
  Request, Response,
} from 'express';
import { Logger } from 'log4js';
import { ApiError } from '../error/ApiError';

export const errorHandlerMiddleware =
  (logger: Logger) => (
    err: ApiError,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    logger.debug(err);
    res
      .status(err.statusCode)
      .send(err.toResponse());
  };
