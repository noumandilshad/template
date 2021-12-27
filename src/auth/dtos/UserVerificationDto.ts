import { Trim } from 'class-sanitizer';
import {
  IsNotEmpty, IsString,
} from 'class-validator';

export class UserVerificationDto {
  @IsNotEmpty()
  @Trim()
  @IsString()
  verificationCode: string;

  @IsNotEmpty()
  @Trim()
  userId: string;

  constructor(
    userId: string,
    verificationCode: string,
  ) {
    this.userId = userId;
    this.verificationCode = verificationCode;
  }
}
