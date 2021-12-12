export class APIError {
  message: string;

  statusCode: number;

  constructor(message: string, statusCode = 500) {
    this.message = message;
    this.statusCode = statusCode;
  }

  toString(): string {
    return `[APIError] - ${JSON.stringify(this)}`;
  }
}
