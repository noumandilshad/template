import 'reflect-metadata';
import express, { Router } from 'express';
import { inject, injectable } from 'inversify';
import { HelloWorldControllerInterface } from '../../controllers/HelloWorldControllerInterface';
import { TYPES } from '../../types/types';
import { HelloWorldRouterInterface } from './HelloWorldRouterInterface';
import { BaseRouter } from '../BaseRouter';

@injectable()
export class HelloWorldRouter extends BaseRouter implements HelloWorldRouterInterface {
  private router: Router;

  private helloWorldController: HelloWorldControllerInterface;

  constructor(@inject(TYPES.HelloWorldControllerInterface) stageChangeController: HelloWorldControllerInterface) {
    super();
    this.router = express.Router();
    this.helloWorldController = stageChangeController;
  }

  getConfiguredRouter(): Router {
    this.configureRoutes();

    return this.router;
  }

  private configureRoutes() {
    this.router.get('/hello-world', (req, res, next) => this.helloWorldController.handleHelloWorld(req, res, next));
  }
}
