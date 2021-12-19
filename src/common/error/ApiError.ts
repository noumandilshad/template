import { ApiErrorResponse } from '../types/ApiErrorResponse';
import { HttpStatus } from '../types/HttpStatus';
import { isEnvDevelopment } from '../utils/isEnvDevelopment';
import { ApiErrorMessage } from './ApiErrorMessage';

const SOMETHING_WENT_WRONG_MESSAGE = 'Something went wrong.';

export class ApiError {
  // eslint-disable-next-line
  private constructor(
    public message: string,
    public statusCode: HttpStatus,
    public code?: string,
    public errors?: Record<string, string[]>,
  ) { }

  public static fromApiErrorMessage(
    apiErrorMessage: ApiErrorMessage,
    errors?: Record<string, string[]>,
  ): ApiError {
    return new ApiError(
      apiErrorMessage.message,
      apiErrorMessage.statusCode,
      apiErrorMessage.code,
      errors,
    );
  }

  public static fromInternalServerError(
    message: string,
  ): ApiError {
    return new ApiError(
      message,
      HttpStatus.InternalServerError,
    );
  }

  public isServerError(): boolean {
    return this.statusCode >= 500
      && this.statusCode <= 599;
  }

  public toResponse(): ApiErrorResponse {
    const response: ApiErrorResponse = {
      statusCode: this.statusCode.toString(),
      message: !isEnvDevelopment() && this.isServerError()
        ? SOMETHING_WENT_WRONG_MESSAGE
        : this.message,
    };
    if (this.errors) {
      response.errors = this.errors;
    }
    if (this.code) {
      response.code = this.code;
    }

    return response;
  }

  public toString(): string {
    return `[APIError] - ${JSON.stringify(this)}`;
  }
}
