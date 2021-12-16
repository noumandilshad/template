import express, {
  Application as ExpressApplication,
} from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { Logger } from 'log4js';
import { inject, injectable } from 'inversify';
import { getLogger } from './common/AppLogger';
import { TokenService } from './auth/services/TokenService';
import { checkJwtTokenMiddleware } from './auth/middlewares/authMiddleware';
import { authTypes } from './auth/authTypes';
import { AuthRouter } from './auth/routes/AuthRouter';
import { notFoundMiddleware } from './common/middlewares/notFoundMiddleware';
import { errorHandlerMiddleware } from './common/middlewares/errorHandlerMiddleware';
import { loggerMiddleware } from './common/middlewares/loggerMiddleware';
import { commonTypes } from './common/commonTypes';
import { contentTypeJsonMiddleware } from './common/middlewares/contentTypeJsonMiddleware';
import { MongoDbConnection } from './common/MongoDbConnection';

@injectable()
export class FriencyApi {
  private appLogger: Logger;

  private app: ExpressApplication;

  private authRouter: AuthRouter;

  private tokenService: TokenService;

  private databaseConnection: MongoDbConnection;

  constructor(
    @inject(authTypes.AuthRouter) authRouter: AuthRouter,
    @inject(authTypes.TokenService) tokenService: TokenService,
    @inject(commonTypes.MongoDbConnection) databaseConnection: MongoDbConnection,
  ) {
    this.appLogger = getLogger();
    this.app = express();
    this.authRouter = authRouter;
    this.tokenService = tokenService;
    this.databaseConnection = databaseConnection;
  }

  async getConfiguredApp(): Promise<ExpressApplication> {
    try {
      await this.databaseConnection.connect();
    } catch (error) {
      this.appLogger.error('Database connection failed', error);
      throw error;
    }
    this.addPreRouterMiddlewares();
    this.addRouters();

    this.addPostRouterMiddlewares();
    return this.app;
  }

  private addPostRouterMiddlewares() {
    this.app.use(errorHandlerMiddleware(this.appLogger));
    this.app.use(notFoundMiddleware);
  }

  private addPreRouterMiddlewares() {
    this.app.use(contentTypeJsonMiddleware);
    this.app.use(loggerMiddleware(this.appLogger));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use(express.static(path.join(__dirname, 'public')));
    this.app.use(checkJwtTokenMiddleware(this.tokenService));
  }

  private addRouters() {
    this.app.use('/auth', this.authRouter.getConfiguredRouter());
  }
}

export const types = {
  FriencyApi: Symbol.for('FriencyApi'),
};
