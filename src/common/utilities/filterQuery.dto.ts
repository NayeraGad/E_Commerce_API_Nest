import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class QueryFilterDTO {
  @IsOptional()
  @IsString()
  select?: string;

  @IsOptional()
  @IsString()
  sort?: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number;
}
