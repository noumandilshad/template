import {
  Request, Response, NextFunction,
} from 'express';

export const contentTypeJsonMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  res.header('Content-Type', 'application/json');
  next();
};
