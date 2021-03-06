import express, { Router } from 'express';
import { inject, injectable } from 'inversify';
import { BaseRouter } from '../../common/types/BaseRouter';
import { AuthController } from './AuthController';
import { dtoValidationMiddleware } from '../../common/middlewares/dtoValidation';
import { LoginDto } from '../dtos/LoginDto';
import { RegisterDto } from '../dtos/RegisterDto';
import { authTypes } from '../authTypes';
import { RefreshTokenDto } from '../dtos/RefreshTokenDto';
import { UserVerificationDto } from '../dtos/UserVerificationDto';

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
    this.router.post(
      '/refresh',
      dtoValidationMiddleware(RefreshTokenDto),
      (req, res) => this.authController.handleRefreshToken(req, res),
    );

    this.router.post(
      '/verify',
      dtoValidationMiddleware(UserVerificationDto),
      (req, res) => this.authController.handleUserVerification(req, res),
    );
  }
}
