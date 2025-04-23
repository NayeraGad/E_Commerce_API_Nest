import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { paymentMethodTypes } from '../../../common/index';

export class createOrderDTO {
  @IsNotEmpty()
  @IsString()
  @Length(11)
  phone: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsEnum(paymentMethodTypes)
  @IsString()
  paymentMethod: string;

  @IsOptional()
  @IsString()
  code: string;
}
