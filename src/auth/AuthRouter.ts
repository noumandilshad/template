import express, { Router } from 'express';
import { inject, injectable } from 'inversify';
import { BaseRouter } from '../common/BaseRouter';
import { AuthController } from './AuthController';
import { AUTH_TYPES } from './authTypes';
import { dtoValidationMiddleware } from '../common/middlewares/dtoValidation';
import { LoginDto } from './dtos/LoginDto';
import { RegisterUserDto } from './dtos/RegisterUserDto';

@injectable()
export class AuthRouter implements BaseRouter {
  private router: Router;

  private authController: AuthController;

  constructor(@inject(AUTH_TYPES.AuthController) authController: AuthController) {
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
      dtoValidationMiddleware(RegisterUserDto),
      (req, res) => this.authController.handleRegister(req, res),
    );
  }
}
