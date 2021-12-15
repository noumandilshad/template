import { NextFunction, Request, Response } from 'express';
import { TokenService } from '../services/TokenService';
import { ApiError } from '../../common/ApiError';
import { HttpStatus } from '../../common/types/HttpStatus';

const NO_AUTH_PATHS = [
  '/auth/login',
  '/auth/register',
];

export const authMiddleware = (
  tokenService: TokenService,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (NO_AUTH_PATHS.includes(req.path)) {
    next();
    return;
  }
  const authHeader = String(req.headers.authorization || '');

  if (!authHeader.startsWith('Bearer ')) {
    throw new ApiError(HttpStatus.Unauthorized, 'Unauthorized.');
  }
  const token = authHeader.substring(7, authHeader.length);

  if (!tokenService.isTokenValid(token)) {
    throw new ApiError(HttpStatus.Unauthorized, 'Unauthorized.');
  }
  next();
};
