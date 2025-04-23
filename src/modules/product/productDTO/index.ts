import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  Validate,
} from 'class-validator';
import { Types } from 'mongoose';
import { QueryFilterDTO } from '../../../common/index.js';

export class CreateProductDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  description: string;

  @IsNotEmpty()
  @Validate((value: Types.ObjectId) => {
    return Types.ObjectId.isValid(value);
  })
  category: Types.ObjectId;

  @IsNotEmpty()
  @Validate((value: Types.ObjectId) => {
    return Types.ObjectId.isValid(value);
  })
  subCategory: Types.ObjectId;

  @IsNotEmpty()
  @Validate((value: Types.ObjectId) => {
    return Types.ObjectId.isValid(value);
  })
  brand: Types.ObjectId;

  coverImage: object;

  @IsOptional()
  @IsArray()
  subImages: object[];

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  discount: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class UpdateProductDTO {
  @IsString()
  @IsOptional()
  @MinLength(2)
  name: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  description: string;

  @IsOptional()
  @Validate((value: Types.ObjectId) => {
    return Types.ObjectId.isValid(value);
  })
  category: Types.ObjectId;

  @IsOptional()
  @Validate((value: Types.ObjectId) => {
    return Types.ObjectId.isValid(value);
  })
  subCategory: Types.ObjectId;

  @IsOptional()
  @Validate((value: Types.ObjectId) => {
    return Types.ObjectId.isValid(value);
  })
  brand: Types.ObjectId;

  coverImage: object;

  @IsOptional()
  @IsArray()
  subImages: object[];

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  price: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  discount: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  stock: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  quantity: number;
}

export class QueryDTO extends QueryFilterDTO {
  @IsOptional()
  @IsString()
  name?: string;
}
