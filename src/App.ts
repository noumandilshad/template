import { HttpError } from 'http-errors';
import express, {
  Application as ExpressApplication, NextFunction, Request, Response,
} from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { Logger } from 'log4js';
import { inject, injectable } from 'inversify';
import { HTTPStatusCodes } from './types/HTTPStatusCodes';
import { getLogger } from './core/AppLogger';
import { TYPES } from './types/types';
import { AppInterface } from './AppInterface';
import { isEnvDevelopment } from './core/utils/isEnvDevelopment';
import { HelloWorldRouterInterface } from './routes/HelloWorldRoutes/HelloWorldRouterInterface';

const SOMETHING_WENT_WRONG_MESSAGE = 'Something went wrong.';

@injectable()
export class HelloWorldApp implements AppInterface {
  private appLogger: Logger;

  private app: ExpressApplication;

  private helloWorldRouter: HelloWorldRouterInterface;

  constructor(@inject(TYPES.HelloWorldRouterInterface) helloWorldRouter: HelloWorldRouterInterface) {
    this.appLogger = getLogger();
    this.app = express();
    this.helloWorldRouter = helloWorldRouter;
  }

  getConfiguredApp(): ExpressApplication {
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

    this.configureRouters();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
      res.status(err.statusCode || HTTPStatusCodes.InternalServerError);
      this.appLogger.error(err);
      return res.send({
        message: isEnvDevelopment() ? err.message : SOMETHING_WENT_WRONG_MESSAGE,
      });
    });

    // catch 404 and forward to error handler
    this.app.use((req, res) => {
      res.status(404).send({
        message: 'Not found',
      });
    });

    return this.app;
  }

  private configureRouters() {
    this.app.use('/', this.helloWorldRouter.getConfiguredRouter());
  }
}
