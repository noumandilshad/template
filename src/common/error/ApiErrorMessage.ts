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

  public static readonly codeExpired =
    new ApiErrorMessage('10006', 'Code expired', HttpStatus.BadRequest);

  public static readonly codeUsed =
    new ApiErrorMessage('10007', 'Code already used', HttpStatus.BadRequest);

  public static readonly invalidUserOrCode =
    new ApiErrorMessage('10008', 'Invalid user or code', HttpStatus.BadRequest);

  public static readonly userNotExists =
    new ApiErrorMessage('10008', 'User does not exists', HttpStatus.NotFound);

  private constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly statusCode: HttpStatus,
  ) { }
}
