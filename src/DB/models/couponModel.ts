import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './index';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Coupon {
  @Prop({
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
  })
  code: string;

  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  userId: Types.ObjectId;

  @Prop({ type: Number, required: true, min: 1, max: 100 })
  amount: number;

  @Prop({ type: Date, required: true })
  fromDate: Date;

  @Prop({ type: Date, required: true })
  toDate: Date;

  @Prop({ type: [Types.ObjectId], ref: User.name })
  usedBy: Types.ObjectId[];
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);

export type CouponDocument = HydratedDocument<Coupon>;

export const CouponModel = MongooseModule.forFeature([
  {
    name: Coupon.name,
    schema: CouponSchema,
  },
]);
