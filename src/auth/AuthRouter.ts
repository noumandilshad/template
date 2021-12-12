import 'reflect-metadata';
import express, { Router } from 'express';
import { inject, injectable } from 'inversify';
import { BaseRouter } from '../common/BaseRouter';
import { AuthController } from './controllers/AuthController';
import { AUTH_TYPES } from './authTypes';

@injectable()
export class AuthRouter implements BaseRouter {
  private router: Router;

  private authController: AuthController;

  constructor(@inject(AUTH_TYPES.AuthController) stageChangeController: AuthController) {
    this.router = express.Router();
    this.authController = stageChangeController;
  }

  getConfiguredRouter(): Router {
    this.configureRoutes();

    return this.router;
  }

  private configureRoutes() {
    this.router.get('/hello-world', (req, res) => this.authController.handleHelloWorld(req, res));
  }
}
