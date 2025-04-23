import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Encrypt, Hash, UserGender, UserRoles } from '../../common/index';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User {
  @Prop({
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 15,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
    unique: true,
  })
  email: string;

  @Prop({ type: String, required: true, minlength: 8 })
  password: string;

  @Prop({ type: Date, required: true })
  DOB: Date;

  @Prop({ type: String, required: true, trim: true, length: 11 })
  phone: string;

  @Prop({ type: String, required: true, trim: true })
  address: string;

  @Prop({ type: String, enum: UserRoles, default: UserRoles.user })
  role: string;

  @Prop({ type: String, enum: UserGender, default: UserGender.male })
  gender: string;

  @Prop({ type: Boolean })
  confirmed: boolean;

  @Prop({ type: Boolean })
  isDeleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  if (this.isDirectModified('password')) {
    this.password = Hash({ plainText: this.password });
  }

  if (this.isDirectModified('phone')) {
    this.phone = Encrypt({ plainText: this.phone });
  }

  next();
});

export type UserDocument = HydratedDocument<User>;

export const UserModel = MongooseModule.forFeature([
  {
    name: User.name,
    schema: UserSchema,
  },
]);
