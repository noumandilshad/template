import { RequestHandler } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { sanitize } from 'class-sanitizer';
import { ApiError } from '../error/ApiError';
import { ApiErrorMessage } from '../error/ApiErrorMessage';

const processErrors =
  (
    errors: ValidationError[],
  ): Record<string, string[]> => errors.reduce<Record<string, string[]>>(
    (acc, { property, constraints }) => {
      let propErrors: string[] = [];

      if (constraints) {
        propErrors = Object.values(constraints);
      }

      return { ...acc, [property]: propErrors };
    },
    {},
  );

export const dtoValidationMiddleware =
  (
    type: any,
    skipMissingProperties = false,
  ): RequestHandler => async (req, res, next) => {
    const dtoObj = plainToInstance(type, req.body);

    sanitize(dtoObj);

    const errors: ValidationError[] = await validate(dtoObj, { skipMissingProperties });

    if (errors.length > 0) {
      next(ApiError.fromApiErrorMessage(
        ApiErrorMessage.invalidFields,
        processErrors(errors),
      ));
      return;
    }
    req.body = dtoObj;
    next();
  };
