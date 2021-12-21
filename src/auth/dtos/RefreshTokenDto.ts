import { Trim } from 'class-sanitizer';
import {
  IsNotEmpty,
} from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty()
  @Trim()
  email: string;

  @IsNotEmpty()
  refreshToken: string;

  constructor(
    email: string,
    refreshToken: string,
  ) {
    this.email = email;
    this.refreshToken = refreshToken;
  }
}
