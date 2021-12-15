import { Logger } from 'log4js';
import morgan from 'morgan';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const loggerMiddleware = (logger: Logger) => morgan('combined', {
  stream: {
    write: (str: string) => {
      logger.info(str);
    },
  },
});
