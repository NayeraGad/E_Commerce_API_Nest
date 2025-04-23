import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsNotEmpty,
  IsString,
  Length,
  Max,
  Min,
  IsPositive,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
  IsOptional,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsDateAfterConstrains implements ValidatorConstraintInterface {
  validate(toDate: Date, args?: ValidationArguments) {
    return toDate > args?.object['fromDate'];
  }

  defaultMessage(args?: ValidationArguments): string {
    return `${args?.property} must be after ${args?.object['fromDate']}`;
  }
}

@ValidatorConstraint({ async: true })
export class IsFromDateValid implements ValidatorConstraintInterface {
  validate(fromDate: Date) {
    return fromDate >= new Date();
  }

  defaultMessage(args?: ValidationArguments): string {
    return `${args?.property} must be today's date or a future date`;
  }
}

export class CreateCouponDTO {
  @IsString()
  @IsNotEmpty()
  @Length(2, 10)
  code: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Min(1)
  @Max(100)
  amount: number;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @Validate(IsFromDateValid)
  fromDate: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @Validate(IsDateAfterConstrains)
  toDate: Date;
}

export class UpdateCouponDTO {
  @IsOptional()
  @IsString()
  @Length(2, 10)
  code: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(100)
  amount: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Validate(IsFromDateValid)
  fromDate: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Validate(IsDateAfterConstrains)
  toDate: Date;
}
