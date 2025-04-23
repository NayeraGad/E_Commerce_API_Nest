import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class createBrandDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class updateBrandDTO {
  @IsString()
  @IsOptional()
  name: string;

  @IsOptional()
  subCategory: Types.ObjectId;
}
