import { Trim } from 'class-sanitizer';
import {
  IsNotEmpty,
} from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @Trim()
  email: string;

  @IsNotEmpty()
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
