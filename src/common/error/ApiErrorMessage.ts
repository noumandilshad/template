import { HttpStatus } from '../types/HttpStatus';

export class ApiErrorMessage {
  public static readonly unauthorized =
    new ApiErrorMessage('10001', 'Unauthorized', HttpStatus.Unauthorized);

  public static readonly invalidLoginCredentials =
    new ApiErrorMessage('10002', 'Invalid credentials', HttpStatus.Unauthorized);

  public static readonly emailAlreadyInUse =
    new ApiErrorMessage('10003', 'Email is already in use', HttpStatus.BadRequest);

  public static readonly phoneAlreadyInUse =
    new ApiErrorMessage('10004', 'Phone number is already in use', HttpStatus.BadRequest);

  public static readonly invalidFields =
    new ApiErrorMessage('10005', 'Invalid fields', HttpStatus.BadRequest);

  private constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly statusCode: HttpStatus,
  ) { }
}
