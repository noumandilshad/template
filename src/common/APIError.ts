import { ApiErrorResponse } from './types/ApiErrorResponse';
import { isEnvDevelopment } from './utils/isEnvDevelopment';

const SOMETHING_WENT_WRONG_MESSAGE = 'Something went wrong.';

export class ApiError {
  // eslint-disable-next-line
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: Record<string, string[]>,
  ) { }

  isServerError(): boolean {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }

  toResponse(): ApiErrorResponse {
    const response: ApiErrorResponse = {
      status: this.statusCode.toString(),
      message: !isEnvDevelopment() && this.isServerError()
        ? SOMETHING_WENT_WRONG_MESSAGE
        : this.message,
    };
    if (this.errors) {
      response.errors = this.errors;
    }

    return response;
  }

  toString(): string {
    return `[APIError] - ${JSON.stringify(this)}`;
  }
}
