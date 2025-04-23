import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Validate } from 'class-validator';
import { Types } from 'mongoose';

export class cartDTO {
  @IsNotEmpty()
  @Validate((value: Types.ObjectId) => {
    return Types.ObjectId.isValid(value);
  })
  productId: Types.ObjectId;

  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  quantity: number;
}

export class removeFromCartDTO {
  @IsNotEmpty()
  @Validate((value: Types.ObjectId) => {
    return Types.ObjectId.isValid(value);
  })
  productId: Types.ObjectId;
}
