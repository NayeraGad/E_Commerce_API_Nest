import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './index';
import { Hash, otpTypes } from '../../common/index';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class OTP {
  @Prop({ type: String, required: true })
  code: string;

  @Prop({ type: String, required: true, enum: otpTypes })
  otpType: string;

  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  userId: Types.ObjectId;

  @Prop({ type: Date, required: true })
  expiresAt: Date;
}

export const OTPSchema = SchemaFactory.createForClass(OTP);

OTPSchema.pre('save', function () {
  if (this.isDirectModified('code')) {
    this.code = Hash({ plainText: this.code });
  }
});

export type OTPDocument = HydratedDocument<OTP>;

export const OTPModel = MongooseModule.forFeature([
  { name: OTP.name, schema: OTPSchema },
]);
