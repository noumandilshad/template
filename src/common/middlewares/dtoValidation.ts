import { RequestHandler } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { sanitize } from 'class-sanitizer';
import { ApiError } from '../ApiError';
import { HTTPStatusCodes } from '../types/HTTPStatusCodes';

// eslint-disable-next-line operator-linebreak
export const dtoValidationMiddleware =
  (type: any, skipMissingProperties = false): RequestHandler => (req, res, next) => {
    const dtoObj = plainToInstance(type, req.body);
    sanitize(dtoObj);

    validate(dtoObj, { skipMissingProperties }).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const dtoErrors = errors.reduce<Record<string, string[]>>(
            (acc, { property, constraints }) => {
              let propErrors: string[] = [];

              if (constraints) {
                propErrors = Object.values(constraints);
              }

              return { ...acc, [property]: propErrors };
            },
            {},
          );
          next(new ApiError(HTTPStatusCodes.BadRequest, 'Invalid fields', dtoErrors));
        } else {
          req.body = dtoObj;
          next();
        }
      },
    );
  };
