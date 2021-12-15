import { Request, Response } from 'express';

export const notFoundMiddleware = (_: Request, res: Response) => {
  res
    .status(404)
    .send({
      message: 'Not found',
    });
};
