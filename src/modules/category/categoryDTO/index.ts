import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class createCategoryDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class updateCategoryDTO {
  @IsString()
  @IsOptional()
  name: string;
}
