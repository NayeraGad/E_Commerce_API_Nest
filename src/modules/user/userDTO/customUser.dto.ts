import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  customPasswordDecorator,
  UserGender,
  UserRoles,
} from '../../../common/index.js';
import { Transform } from 'class-transformer';

export class SignUpDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(15)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @customPasswordDecorator({ message: 'Passwords not match' })
  cPassword: string;

  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  DOB: Date;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsEnum(UserRoles)
  role: string;

  @IsEnum(UserGender)
  gender: string;
}

export class ConfirmEmailDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}

export class loginDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}
