import {
  Request, Response,
} from 'express';
import { Logger } from 'log4js';
import { ApiError } from '../ApiError';

export const errorHandlerMiddleware = (logger: Logger) => (err: ApiError, req: Request, res: Response): void => {
  logger.error(err);
  res
    .status(err.statusCode)
    .send(err.toResponse());
};
