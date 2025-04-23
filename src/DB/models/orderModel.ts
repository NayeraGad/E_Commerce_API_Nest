import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Cart, Coupon, User } from './index';
import {
  paymentMethodTypes,
  orderStatusTypes,
  Encrypt,
} from '../../common/index';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Order {
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: Cart.name })
  cart: Types.ObjectId;

  @Prop({ type: Number })
  totalPrice: number;

  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: String, required: true, enum: paymentMethodTypes })
  paymentMethod: string;

  @Prop({ type: String, required: true, enum: orderStatusTypes })
  status: string;

  @Prop({ type: Date, default: Date.now() + 3 * 24 * 60 * 60 * 1000 })
  arrivesAt: Date;

  @Prop({
    type: {
      paidAt: Date,
      deliveredAt: Date,
      deliveredBy: { type: Types.ObjectId, ref: User.name },
      cancelledAt: Date,
      cancelledBy: { type: Types.ObjectId, ref: User.name },
      refundedAt: Date,
      refundedBy: { type: Types.ObjectId, ref: User.name },
    },
  })
  orderChanges: object;

  @Prop({ type: Types.ObjectId, ref: Coupon.name })
  coupon: Types.ObjectId;

  @Prop({ type: String })
  paymentIntent: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.pre('save', function (next) {
  if (this.isDirectModified('phone')) {
    this.phone = Encrypt({ plainText: this.phone });
  }

  next();
});

export type OrderDocument = HydratedDocument<Order>;

export const OrderModel = MongooseModule.forFeature([
  {
    name: Order.name,
    schema: OrderSchema,
  },
]);
