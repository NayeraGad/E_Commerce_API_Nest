import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class createSubCategoryDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class updateSubCategoryDTO {
  @IsString()
  @IsOptional()
  name: string;

  @IsOptional()
  category: Types.ObjectId;
}
