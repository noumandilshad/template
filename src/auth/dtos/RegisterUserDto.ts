import { Trim } from 'class-sanitizer';
import {
  IsEmail,
  IsNotEmpty,
} from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  @Trim()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
