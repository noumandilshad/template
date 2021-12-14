import express, {
  Application as ExpressApplication, NextFunction, Request, Response,
} from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { Logger } from 'log4js';
import { inject, injectable } from 'inversify';
import { AuthRouter } from './auth/AuthRouter';
import { getLogger } from './common/AppLogger';
import { AUTH_TYPES } from './auth/authTypes';
import { ApiError } from './common/ApiError';
import { connectToDatabase } from './common/database';

@injectable()
export class FriencyApi {
  private appLogger: Logger;

  private app: ExpressApplication;

  private authRouter: AuthRouter;

  constructor(@inject(AUTH_TYPES.AuthRouter) authRouter: AuthRouter) {
    this.appLogger = getLogger();
    this.app = express();
    this.authRouter = authRouter;
  }

  getConfiguredApp(): ExpressApplication {
    connectToDatabase()
      .then(() => {
        this.configurePreRouterMiddlewares();
        this.configureRouters();
        this.configureErrorHandling();
      })
      .catch((error: Error) => {
        this.appLogger.error('Database connection failed', error);
        process.exit();
      });
    return this.app;
  }

  private configureErrorHandling() {
    this.app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
      this.appLogger.error(err);
      return res
        .status(err.statusCode)
        .send(err.toResponse());
    });

    // catch 404 and forward to error handler
    this.app.use((req, res) => {
      res.status(404).send({
        message: 'Not found',
      });
    });
  }

  private configurePreRouterMiddlewares() {
    this.app.use((req, res, next) => {
      res.header('Content-Type', 'application/json');
      next();
    });

    this.app.use(morgan('combined', {
      stream: {
        write: (str: string) => {
          this.appLogger.info(str);
        },
      },
    }));

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use(express.static(path.join(__dirname, 'public')));
  }

  private configureRouters() {
    this.app.use('/auth', this.authRouter.getConfiguredRouter());
  }
}
const TYPES = {
  FriencyApi: Symbol.for('FriencyApi'),
};

export { TYPES };
