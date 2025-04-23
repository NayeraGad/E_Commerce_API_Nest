import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product, User } from './index';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Cart {
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  userId: Types.ObjectId;

  @Prop({
    type: [
      {
        productId: { type: Types.ObjectId, ref: Product.name, required: true },
        quantity: { type: Number, required: true },
        subPrice: { type: Number, required: true },
      },
    ],
    ref: Product.name,
  })
  products: { productId: Types.ObjectId; quantity: number; subPrice: number }[];

  @Prop({ type: Number })
  total: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

CartSchema.pre('save', function (next) {
  this.total = this.products.reduce(
    (acc, product) => acc + product.subPrice * product.quantity,
    0,
  );

  next();
});

export type CartDocument = HydratedDocument<Cart>;

export const CartModel = MongooseModule.forFeature([
  {
    name: Cart.name,
    schema: CartSchema,
  },
]);
