import { NextFunction, Request, Response } from 'express';

export interface HelloWorldControllerInterface {
  handleHelloWorld(req: Request, res: Response, next: NextFunction): Response;
}
