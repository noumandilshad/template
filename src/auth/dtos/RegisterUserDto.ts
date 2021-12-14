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
  @Trim()
  firstName: string;

  @IsNotEmpty()
  @Trim()
  lastName: string;

  @IsNotEmpty()
  password: string;

  constructor(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) {
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
