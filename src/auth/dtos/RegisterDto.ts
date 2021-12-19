import { Trim } from 'class-sanitizer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @Trim()
  @IsEmail()
  email: string;

  @Trim()
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @IsNotEmpty()
  @MinLength(5)
  password: string;

  constructor(
    email: string,
    password: string,
    phone?: string,
  ) {
    this.email = email;
    this.password = password;
    this.phone = phone;
  }
}
