import express, { Router } from 'express';
import { inject, injectable } from 'inversify';
import { BaseRouter } from '../../common/types/BaseRouter';
import { AuthController } from './AuthController';
import { dtoValidationMiddleware } from '../../common/middlewares/dtoValidation';
import { LoginDto } from '../dtos/LoginDto';
import { RegisterDto } from '../dtos/RegisterDto';
import { authTypes } from '../authTypes';

@injectable()
export class AuthRouter implements BaseRouter {
  private router: Router;

  private authController: AuthController;

  constructor(@inject(authTypes.AuthController) authController: AuthController) {
    this.router = express.Router();
    this.authController = authController;
  }

  getConfiguredRouter(): Router {
    this.configureRoutes();

    return this.router;
  }

  private configureRoutes() {
    this.router.post(
      '/login',
      dtoValidationMiddleware(LoginDto),
      (req, res) => this.authController.handleLogin(req, res),
    );
    this.router.post(
      '/register',
      dtoValidationMiddleware(RegisterDto),
      (req, res) => this.authController.handleRegister(req, res),
    );
    // TODO remove this
    this.router.get(
      '/protected',
      (req, res) => this.authController.protectedRoute(req, res),
    );
  }
}
