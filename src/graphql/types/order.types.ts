import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { orderStatusTypes, paymentMethodTypes } from 'src/common/index';
import { Cart, Order } from 'src/DB/models/index';

registerEnumType(orderStatusTypes, {
  name: 'OrderStatus',
});

registerEnumType(paymentMethodTypes, {
  name: 'paymentMethodTypes',
});

@ObjectType()
export class CartProductsType {
  @Field(() => ID, { nullable: false })
  productId: Types.ObjectId;

  @Field(() => Number, { nullable: false })
  quantity: number;

  @Field(() => Number, { nullable: false })
  subPrice: number;
}

@ObjectType()
export class CartType implements Partial<Cart> {
  @Field(() => ID, { nullable: false })
  _id: string;

  @Field(() => ID, { nullable: false })
  userId: Types.ObjectId;

  @Field(() => [CartProductsType], { nullable: false })
  products: CartProductsType[];

  @Field(() => Number, { nullable: false })
  total: number;
}

@ObjectType()
export class OrderType implements Partial<Order> {
  @Field(() => ID, { nullable: false })
  _id: string;

  @Field(() => ID, { nullable: false })
  userId: Types.ObjectId;

  @Field(() => CartType, { nullable: false })
  cart: Types.ObjectId | undefined;

  @Field(() => Number, { nullable: false })
  totalPrice: number;

  @Field(() => String, { nullable: false })
  phone: string;

  @Field(() => String, { nullable: false })
  address: string;

  @Field(() => paymentMethodTypes, { nullable: false })
  paymentMethod: string;

  @Field(() => orderStatusTypes, { nullable: false })
  status: string;

  @Field(() => Date, { nullable: true })
  arrivesAt: Date;
}
