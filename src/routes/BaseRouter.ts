import { Router } from 'express';
import { injectable } from 'inversify';

@injectable()
export abstract class BaseRouter {
  abstract getConfiguredRouter(): Router;
}
